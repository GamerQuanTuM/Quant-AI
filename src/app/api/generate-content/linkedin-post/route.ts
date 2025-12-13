import { NextResponse } from "next/server"
import z from "zod"
import { PromptTemplate } from "@langchain/core/prompts"
import { toUIMessageStream } from '@ai-sdk/langchain'
import { StringOutputParser } from "@langchain/core/output_parsers"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { createUIMessageStreamResponse } from 'ai'

import { protect } from "@/middleware/protect"
import validate, { ValidationResponseError } from "@/lib/zod-validate"

const linkedinPostSchema = z.object({
    topic: z.string().min(1, "Topic is required"),
    audience: z.string().min(1, "Audience is required"),
    takeaways: z.string().optional(),
    tone: z.string().min(1, "Tone is required")
})

const linkedinPostTemplate = new PromptTemplate({
    template: `
You are a professional LinkedIn content writer.

Write a high-performing LinkedIn post based on the following inputs:

Topic:
{topic}

Target Audience:
{audience}

Key Takeaways (must be clearly reflected):
{takeaways}

Tone:
{tone}

Requirements:
- Start with a strong 1–2 line hook that creates curiosity or tension
- Use short paragraphs (1–2 lines max)
- Include 1 relevant example or insight
- Avoid emojis unless they fit the tone
- Keep it under 1200 words
- End with a clear call-to-action (question or prompt for discussion)
- Do NOT use hashtags excessively (max 3 if used)

Output ONLY the LinkedIn post text.
`,
    inputVariables: ["topic", "audience", "takeaways", "tone"],
});

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.7,
    maxRetries: 2,
    apiKey: process.env.GOOGLE_API_KEY,
    streaming: true,
});

const generateLinkedinPost = async (req: Request, userId: string) => {
    try {
        const body = await req.json()
        
        let data;
        
        if (body.prompt) {
            data = JSON.parse(body.prompt)
        } else {
            data = body
        }
        
        
        const { topic, audience, takeaways, tone } = validate(linkedinPostSchema, data)
        
        const parser = new StringOutputParser()
        const chain = linkedinPostTemplate.pipe(model).pipe(parser);

        const payload = {
            topic,
            audience,
            takeaways: takeaways || "",
            tone,
        };

        const stream = await chain.stream(payload);

        return createUIMessageStreamResponse({
            stream: toUIMessageStream(stream),
        });

    } catch (error) {
        console.log("Error in generateLinkedinPost:", error)
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        if (error instanceof SyntaxError) {

            return NextResponse.json({ 
                error: "Invalid JSON data format",
                message: error.message 
            }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
    }
}

export const POST = protect(generateLinkedinPost)