import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { protect } from "@/middleware/protect"
import validate, { ValidationResponseError } from "@/lib/zod-validate"
import z from "zod"

const meSchema = z.object({
    projects: z.boolean().optional(),
})


const me = async (req: Request, userId: string) => {
    try {
        const url = new URL(req.url)
        const searchParams = url.searchParams
        const projectsParam = searchParams.get('projects')
        const { projects } = validate(meSchema, { projects: projectsParam === 'true' ? true : (projectsParam === 'false' ? false : undefined) })

        const user = await prisma.user.findUnique({ where: { id: userId }, include: { projects: projects ? { include: { contents: true } } : false } })
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
        const { passwordHash, ...rest } = user;
        return NextResponse.json(rest, { status: 200 })
    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
    }

}

export const GET = protect(me)