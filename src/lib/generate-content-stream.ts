import { StringOutputParser } from "@langchain/core/output_parsers";
import { toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStreamResponse } from "ai";
import { NextResponse } from "next/server";
import model from "./model";
import validate, { ValidationResponseError } from "./zod-validate";
import z from "zod";

type GenerateStreamOptions<TInput, TPayload> = {
    req: Request;
    schema: z.ZodSchema<TInput>;
    template: any;
    buildPayload: (data: TInput) => TPayload;
};

export const generateContentStream = async <TInput, TPayload>({
    req,
    schema,
    template,
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

        const data = body?.prompt
            ? JSON.parse(body.prompt)
            : body;

        const validatedData = validate(schema, data);

        const parser = new StringOutputParser();
        const chain = template.pipe(activeModel).pipe(parser);

        const payload = buildPayload(validatedData);

        const stream = await chain.stream(payload);

        return createUIMessageStreamResponse({
            stream: toUIMessageStream(stream),
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
};
