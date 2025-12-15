import z from "zod"

import { protect } from "@/middleware/protect"
import { codeGenerationTemplate } from "@/constants/prompt"
import { generateContentStream } from "@/lib/generate-content-stream"

const codeGenerationSchema = z.object({
    description: z.string().min(1, "Description is required"),
    language: z.string().min(1, "Language is required"),
    context: z.string().optional(),
})

const generateCode = async (req: Request, userId: string) => {
    return generateContentStream({
        req,
        userId,
        schema: codeGenerationSchema,
        template: codeGenerationTemplate,
        templateId:"code-generation",
        buildPayload: ({ description, language, context }) => ({
            description,
            language,
            context: context || "",
        }),
    });
}

export const POST = protect(generateCode)
