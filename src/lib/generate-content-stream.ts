import { StringOutputParser } from "@langchain/core/output_parsers";
import { toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStreamResponse } from "ai";
import { NextResponse } from "next/server";
import model from "./model";
import validate, { ValidationResponseError } from "./zod-validate";
import z from "zod";
import { prisma } from "./prisma";
import { getIO } from "@/lib/socket";



type GenerateStreamOptions<TInput, TPayload> = {
    req: Request;
    userId: string;
    schema: z.ZodSchema<TInput>;
    template: any;
    templateId: string;
    buildPayload: (data: TInput) => TPayload;
};

export const generateContentStream = async <TInput, TPayload>({
    req,
    userId,
    schema,
    template,
    templateId,
    buildPayload,
}: GenerateStreamOptions<TInput, TPayload>) => {
    try {
        const body = await req.json();

        const providerName = req.headers.get('x-provider');
        const providerKey = req.headers.get('x-provider-key');

        let activeModel: unknown = model;

        if (providerName && providerKey) {
            console.log(`Using custom provider: ${providerName}`);

            if (providerName === 'openrouter') {
                const { ChatOpenAI } = await import("@langchain/openai");
                activeModel = new ChatOpenAI({
                    model: "meta-llama/llama-3.2-3b-instruct:free",
                    configuration: {
                        apiKey: providerKey,
                        baseURL: "https://openrouter.ai/api/v1"
                    }
                });
            } else if (providerName === 'openai') {
                const { ChatOpenAI } = await import("@langchain/openai");
                activeModel = new ChatOpenAI({
                    model: "gpt-4o-mini",
                    apiKey: providerKey
                });
            } else if (providerName === 'google') {
                const { ChatGoogleGenerativeAI } = await import("@langchain/google-genai");
                activeModel = new ChatGoogleGenerativeAI({
                    model: "gemini-2.5-flash",
                    apiKey: providerKey
                });
            } else if (providerName === 'groq') {
                const { ChatOpenAI } = await import("@langchain/openai");
                activeModel = new ChatOpenAI({
                    model: "openai/gpt-oss-20b",
                    apiKey: providerKey,
                    configuration: {
                        baseURL: "https://api.groq.com/openai/v1"
                    }
                });
            } else if (providerName === 'anthropic') {
                const { ChatAnthropic } = await import("@langchain/anthropic");
                activeModel = new ChatAnthropic({
                    model: "claude-sonnet-4-5-20250929",
                    apiKey: providerKey
                });
            }
        } else if (req.headers.get('x-openrouter-key')) {
            const key = req.headers.get('x-openrouter-key');
            if (key) {
                const { ChatOpenAI } = await import("@langchain/openai");
                activeModel = new ChatOpenAI({
                    model: "meta-llama/llama-3.2-3b-instruct:free",
                    configuration: {
                        apiKey: key,
                        baseURL: "https://openrouter.ai/api/v1"
                    }
                });
            }
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true },
        });

        if (user && user.credits < 10) {
            return NextResponse.json(
                { error: "Not enough credits" },
                { status: 400 }
            );
        }


        const data = body?.prompt
            ? JSON.parse(body.prompt)
            : body;

        const validatedData = validate(schema, data);

        const parser = new StringOutputParser();
        const chain = template.pipe(activeModel).pipe(parser);


        const payload = buildPayload(validatedData);

        const generator = await chain.stream(payload);
        const stream = new ReadableStream({
            async pull(controller) {
                const { value, done } = await generator.next();
                if (done) {
                    controller.close();
                } else {
                    controller.enqueue(value);
                }
            },
        });

        let fullResponse = "";
        const transformStream = new TransformStream({
            transform(chunk, controller) {
                fullResponse += chunk;
                controller.enqueue(chunk);
            },
            async flush() {
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        credits: {
                            decrement: 10
                        }
                    },
                });

                const history = await prisma.history.create({
                    data: {
                        templateSlug: templateId,
                        aiResponse: fullResponse,
                        user: {
                            connect: {
                                id: userId
                            }
                        },
                    }
                });

                try {
                    const io = getIO();
                    io.to(`user:${userId}`).emit('content-generate', {
                        message: history,
                        userId
                    });
                } catch (e) {
                    console.warn("Socket IO not initialized or failed to emit", e);
                }
            },
        });

        return createUIMessageStreamResponse({
            stream: toUIMessageStream(stream.pipeThrough(transformStream)),
        });


    } catch (error) {
        console.error(error);

        if (error instanceof ValidationResponseError) {
            return error.response;
        }

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                {
                    error: "Invalid JSON data format",
                    message: error.message,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to generate content" },
            { status: 500 }
        );
    }
}
