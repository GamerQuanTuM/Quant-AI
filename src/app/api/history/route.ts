import { NextResponse } from "next/server"
import z from "zod"
import { prisma } from "@/lib/prisma"
import { protect } from "@/middleware/protect"
import validate from "@/lib/zod-validate"

const getHistory = async (req: Request, userId: string) => {
    try {
        const userHistory = await prisma.history.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(userHistory, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to get history" }, { status: 500 })
    }

}

const historySchema = z.object({
    historyId: z.string().min(1, "History ID is required"),
})

const deleteHistory = async (req: Request, userId: string) => {

    const url = new URL(req.url)
    const searchParams = url.searchParams
    const historyIdParams = searchParams.get("historyId")

    const { historyId } = validate(historySchema, { historyId: historyIdParams })

    try {
        await prisma.history.delete({
            where: {
                id: historyId
            }
        })

        return NextResponse.json("History deleted successfully", { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to get history" }, { status: 500 })
    }

}


export const GET = protect(getHistory)
export const DELETE = protect(deleteHistory)