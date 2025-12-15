import z from "zod"

import { protect } from "@/middleware/protect"
import { linkedinPostTemplate } from "@/constants/prompt"
import { generateContentStream } from "@/lib/generate-content-stream"

const linkedinPostSchema = z.object({
    topic: z.string().min(1, "Topic is required"),
    audience: z.string().min(1, "Audience is required"),
    takeaways: z.string().optional(),
    tone: z.string().min(1, "Tone is required")
})



const generateLinkedinPost = async (req: Request, userId: string) => {
    return generateContentStream({
        req,
        userId,
        schema: linkedinPostSchema,
        template: linkedinPostTemplate,
        templateId:"linkedin-post",
        buildPayload: ({ topic, audience, takeaways, tone }) => ({
            topic,
            audience,
            takeaways: takeaways || "",
            tone,
        }),
    });
}

export const POST = protect(generateLinkedinPost)