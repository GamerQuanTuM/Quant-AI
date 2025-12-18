import { prisma } from "@/lib/prisma";
import validate, { ValidationResponseError } from "@/lib/zod-validate";
import { protect } from "@/middleware/protect"
import { NextResponse } from "next/server";
import { z } from "zod";
import { publishToQueue } from "@/lib/rabbitmq";

const saveContentSchema = z.object({
    content: z.string(),
    projectId: z.string(),
    templateId: z.string(),
    inputData: z.any(),
})

const saveContent = async (req: Request, userId: string) => {
    try {
        const body = await req.json()

        const { content, inputData, projectId, templateId } = validate(saveContentSchema, body)

        const save = await prisma.generatedContent.create({
            data: {
                inputData,
                outputText: content,
                templateId,
                project: {
                    connect: {
                        id: projectId
                    }
                }
            }
        })

        // Publish notification
        publishToQueue('notifications', {
            userId,
            type: 'CONTENT_SAVED',
            message: `New content generated and saved.`,
            actor: 'User',
            actorId: userId,
            metadata: { contentId: save.id, projectId: projectId, templateId: templateId }
        }).catch(err => console.error("Failed to publish notification:", err));

        return NextResponse.json({ save }, { status: 200 })

    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export const POST = protect(saveContent)