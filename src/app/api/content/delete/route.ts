import { prisma } from "@/lib/prisma";
import validate, { ValidationResponseError } from "@/lib/zod-validate";
import { protect } from "@/middleware/protect"
import { NextResponse } from "next/server";
import { z } from "zod";
import { publishToQueue } from "@/lib/rabbitmq";

const deleteContentSchema = z.object({
    contentId: z.string(),
})

const deleteContent = async (req: Request, userId: string) => {
    try {
        const body = await req.json()

        const { contentId } = validate(deleteContentSchema, body)

        const deletedContent = await prisma.generatedContent.delete({
            where: {
                id: contentId
            }
        })

        // Publish notification
        publishToQueue('notifications', {
            userId,
            type: 'CONTENT_DELETED',
            message: `Content deleted successfully.`,
            actor: 'User',
            actorId: userId,
            metadata: { contentId: contentId, projectId: deletedContent.projectId }
        }).catch(err => console.error("Failed to publish notification:", err));

        return NextResponse.json({ message: "Content deleted successfully" }, { status: 200 })

    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export const DELETE = protect(deleteContent)