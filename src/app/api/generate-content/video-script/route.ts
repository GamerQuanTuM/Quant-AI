import z from "zod"

import { protect } from "@/middleware/protect"
import { videoScriptTemplate } from "@/constants/prompt"
import { generateContentStream } from "@/lib/generate-content-stream"

const videoScriptSchema = z.object({
    topic: z.string().min(1, "Topic is required"),
    platform: z.string().min(1, "Platform is required"),
    tone: z.string().min(1, "Tone is required"),
})

const generateVideoScript = async (req: Request, userId: string) => {
    return generateContentStream({
        req,
        userId,
        schema: videoScriptSchema,
        template: videoScriptTemplate,
        templateId:"video-script",
        buildPayload: ({ topic, platform, tone }) => ({
            topic,
            platform,
            tone,
        }),
    });
}

export const POST = protect(generateVideoScript)
