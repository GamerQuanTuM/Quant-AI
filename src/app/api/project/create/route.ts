import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { protect } from "@/middleware/protect"
import validate, { ValidationResponseError } from "@/lib/zod-validate"
import z from "zod"

const createProjectSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().optional(),
    slug: z.string(),
})


const createProject = async (req: Request, userId: string) => {
    try {
        const body = await req.json()
        const { name, description, slug } = validate(createProjectSchema, body)

        const checkSlug = await prisma.project.findFirst({
            where: {
                slug,
                userId
            }
        })

        if (checkSlug) {
            return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
        }

        const createProject = await prisma.project.create({
            data: {
                name,
                description,
                slug,
                userId,
            }
        })
        return NextResponse.json(createProject, { status: 200 })
    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }

}

export const POST = protect(createProject)