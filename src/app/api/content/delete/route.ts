import { prisma } from "@/lib/prisma";
import validate, { ValidationResponseError } from "@/lib/zod-validate";
import { protect } from "@/middleware/protect"
import { NextResponse } from "next/server";
import { z } from "zod";

const deleteContentSchema = z.object({
    contentId: z.string(),
})

const deleteContent = async (req: Request, userId: string) => {
    try {
        const body = await req.json()

        const {contentId} = validate(deleteContentSchema, body)

        await prisma.generatedContent.delete({
            where: {
                id: contentId
            }
        })

        return NextResponse.json({ message: "Content deleted successfully" }, { status: 200 })

    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export const DELETE = protect(deleteContent)