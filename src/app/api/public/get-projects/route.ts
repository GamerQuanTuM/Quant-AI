import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { protect } from "@/middleware/protect";

const getProjects = async (req: Request, userId: string) => {
    try {
        const projects = await prisma.project.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            },
        });

        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

export const GET = protect(getProjects);
