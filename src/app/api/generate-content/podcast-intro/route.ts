import z from "zod"

import { protect } from "@/middleware/protect"
import { podcastIntroTemplate } from "@/constants/prompt"
import { generateContentStream } from "@/lib/generate-content-stream"

const podcastIntroSchema = z.object({
    podcastName: z.string().min(1, "Podcast name is required"),
    episodeTopic: z.string().min(1, "Episode topic is required"),
    guest: z.string().optional(),
    tone: z.string().min(1, "Tone is required"),
})

const generatePodcastIntro = async (req: Request, userId: string) => {
    return generateContentStream({
        req,
        userId,
        schema: podcastIntroSchema,
        template: podcastIntroTemplate,
        buildPayload: ({ podcastName, episodeTopic, guest, tone }) => ({
            podcastName,
            episodeTopic,
            guest: guest || "",
            tone,
        }),
    });
}

export const POST = protect(generatePodcastIntro)
