import z from "zod"

import { protect } from "@/middleware/protect"

import { blogPostTemplate } from "@/constants/prompt"
import { generateContentStream } from "@/lib/generate-content-stream"

const blogPostSchema = z.object({
    keywords: z.string().min(1, "Keywords are required"),
    outline: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    tone: z.string().min(1, "Tone is required")
})


const BlogPost = async (req: Request, userId: string) => {
   return generateContentStream({
           req,
           userId,
           schema: blogPostSchema,
           template: blogPostTemplate,
           buildPayload: ({ keywords, outline, title, tone }) => ({
               keywords,
               outline,
               title,
               tone,
           }),
       });
}

export const POST = protect(BlogPost)