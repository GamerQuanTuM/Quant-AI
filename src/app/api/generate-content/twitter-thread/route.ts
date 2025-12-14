import z from "zod"

import { protect } from "@/middleware/protect"
import { twitterThreadTemplate } from "@/constants/prompt"
import { generateContentStream } from "@/lib/generate-content-stream"

const twitterThreadSchema = z.object({
    topic: z.string().min(1, "Topic is required"),
    points: z.string().optional(),
    tone: z.string().min(1, "Tone is required")
})



const TwitterThreadPost = async (req: Request, userId: string) => {
    return generateContentStream({
        req,
        userId,
        schema: twitterThreadSchema,
        template: twitterThreadTemplate,
        buildPayload: ({ topic, points, tone }) => ({
            topic,
            points,
            tone,
        }),
    });
}

export const POST = protect(TwitterThreadPost)