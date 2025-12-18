
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { protect } from "@/middleware/protect";

const deleteNotification = async (req: Request, userId: string, context: { params: Promise<{ id: string }> }) => {
    try {
        const params = await context.params;
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
        }

        // Verify ownership and delete
        const notification = await prisma.notification.findUnique({
            where: { id },
        });

        if (!notification) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        if (notification.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await prisma.notification.delete({
            where: { id },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete notification:", error);
        return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
    }
};

export const DELETE = protect(deleteNotification);
