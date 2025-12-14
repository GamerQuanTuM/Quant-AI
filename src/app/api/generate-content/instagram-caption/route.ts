import z from "zod"

import { protect } from "@/middleware/protect"
import { instagramCaptionTemplate } from "@/constants/prompt"
import { generateContentStream } from "@/lib/generate-content-stream"

const instagramCaptionSchema = z.object({
    description: z.string().min(1, "Description is required"),
    tone: z.string().min(1, "Tone is required"),
})

const generateInstagramCaption = async (req: Request, userId: string) => {
    return generateContentStream({
        req,
        schema: instagramCaptionSchema,
        template: instagramCaptionTemplate,
        buildPayload: ({ description, tone }) => ({
            description,
            tone,
        }),
    });
}

export const POST = protect(generateInstagramCaption)
