import { prisma } from "@/lib/prisma";
import validate, { ValidationResponseError } from "@/lib/zod-validate";
import { protect } from "@/middleware/protect"
import { NextResponse } from "next/server";
import { z } from "zod";

const getUserProjectContentsSchema = z.object({
    projectSlug: z.string(),
})


const getUserProjectContents = async (req: Request, userId: string) => {
    try {
        const url = new URL(req.url)
        const searchParams = url.searchParams
        const projectSlug = searchParams.get("projectSlug")

        const { projectSlug: slug } = validate(
            getUserProjectContentsSchema,
            { projectSlug }
        )


        const contents = await prisma.project.findUnique({
            where: {
                slug,
                userId
            },
            select: {
                name: true,
                slug: true,
                contents: true,
                createdAt: true
            }
        })

        return NextResponse.json(contents, { status: 200 })

    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export const GET = protect(getUserProjectContents)