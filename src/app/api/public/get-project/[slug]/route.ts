import { NextResponse } from "next/server";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { protect } from "@/middleware/protect";
import validate, { ValidationResponseError } from "@/lib/zod-validate";

const getProjectSchema = z.object({
    content: z.enum(["true", "false"]).optional(),
})

const getProject = async (req: Request, userId: string, context: { params: Promise<{ slug: string }> }) => {
    try {
        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const content = searchParams.get("content");

        const { content: includeContent } = validate(getProjectSchema, { content: content ?? undefined })

        const booleanContent = Boolean(includeContent);

        const { slug } = await context.params;

        if (!slug) {
            return NextResponse.json({ error: "Project slug is required" }, { status: 400 });
        }

        const project = await prisma.project.findUnique({
            where: {
                slug,
                userId
            },
            include: {
                contents: booleanContent
            }
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project, { status: 200 });
    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        console.error("Failed to fetch project:", error);
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}


export const GET = protect(getProject);
