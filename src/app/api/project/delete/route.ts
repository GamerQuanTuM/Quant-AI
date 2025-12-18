import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { protect } from "@/middleware/protect"
import validate, { ValidationResponseError } from "@/lib/zod-validate"
import z from "zod"
import { publishToQueue } from "@/lib/rabbitmq"

const deleteProjectSchema = z.object({
    projectSlug: z.string(),
})


const deleteProject = async (req: Request, userId: string) => {
    try {
        const url = new URL(req.url)
        const searchParams = url.searchParams
        const projectSlugParams = searchParams.get("projectSlug")

        const { projectSlug: slug } = validate(
            deleteProjectSchema,
            { projectSlug: projectSlugParams }
        )

        const deleteProject = await prisma.project.delete({
            where: {
                slug,
                userId
            }
        })

        await prisma.generatedContent.deleteMany({
            where: {
                projectId: deleteProject.id
            }
        })
        // Publish notification (fire and forget)
        publishToQueue('notifications', {
            userId,
            type: 'PROJECT_DELETED',
            message: `Project "${deleteProject.name}" deleted successfully.`,
            actor: 'User',
            actorId: userId,
            metadata: { projectSlug: slug }
        }).catch(err => console.error("Failed to publish notification:", err));

        return NextResponse.json("Project deleted successfully", { status: 200 })
    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
    }

}

export const DELETE = protect(deleteProject)