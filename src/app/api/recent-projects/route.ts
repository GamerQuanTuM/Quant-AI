import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { protect } from "@/middleware/protect"


const recentProject = async (req: Request, userId: string) => {
    try {
        const projectsOfUser = await prisma.project.findMany(
            {
                where: {
                    userId
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 3
            }
        )
        return NextResponse.json(projectsOfUser, { status: 200 })
    } catch (error) {
        console.error("Error fetching recent projects:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
    }

}

export const GET = protect(recentProject)