import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { protect } from "@/middleware/protect";

const getNotifications = async (req: Request, userId: string) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        });

        return NextResponse.json(notifications, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}

export const GET = protect(getNotifications);
