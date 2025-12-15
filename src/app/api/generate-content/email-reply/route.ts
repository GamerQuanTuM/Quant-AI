import z from "zod"

import { protect } from "@/middleware/protect"
import { emailReplyTemplate, linkedinPostTemplate } from "@/constants/prompt"
import { generateContentStream } from "@/lib/generate-content-stream"

const emailReplySchema = z.object({
    sender: z.string().min(1, "Sender is required"),
    receipent: z.string().min(1, "Receipent is required"),
    context: z.string().optional(),
    response_points: z.string().optional(),
    tone: z.string().min(1, "Tone is required")
})



const generateEmailReply = async (req: Request, userId: string) => {
    return generateContentStream({
        req,
        userId,
        schema: emailReplySchema,
        template: emailReplyTemplate,
        templateId:"email-reply",
        buildPayload: ({ sender, receipent, context, response_points, tone }) => ({
            sender,
            receipent,
            context: context || "",
            response_points: response_points || "",
            tone,
        }),
    });
}

export const POST = protect(generateEmailReply)