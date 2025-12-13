import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import validate, { ValidationResponseError } from "@/lib/zod-validate";
import z from "zod";
import { protect } from "@/middleware/protect";

const checkSlugSchema = z.object({
    slug: z.string(),
})


async function checkSlug(request: Request, userId: string) {
    try {
        const body = await request.json();

        const { slug } = validate(checkSlugSchema, body)

        if (!slug || typeof slug !== 'string') {
            return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
        }

        const updatedSlug = slug.replace(/\s+/g, '-').toLowerCase()

        const existingProject = await prisma.project.findFirst({
            where: {
                slug: updatedSlug,
                userId
            }
        });

        return NextResponse.json({ available: !existingProject });
    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export const POST = protect(checkSlug)
