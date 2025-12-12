import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { protect } from "@/middleware/protect"


const me = async (req: Request, userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const { passwordHash, ...rest } = user;
    return NextResponse.json(rest, { status: 200 })
}

export const GET = protect(me)