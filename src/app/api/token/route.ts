import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { protect } from "@/middleware/protect"
import z from "zod"
import validate, { ValidationResponseError } from "@/lib/zod-validate"
import { decrypt } from "@/lib/encryption"

const getUserTokens = async (req: Request, userId: string) => {
    try {
        const userTokens = await prisma.token.findMany({
            where: {
                userId
            }
        })

        userTokens.forEach(token => {
            token.token = decrypt(token.token)
        })

        return NextResponse.json(userTokens, { status: 200 })
    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        return NextResponse.json({ error: "Failed to delete token" }, { status: 500 })
    }

}

const deleteTokenSchema = z.object({
    tokenId: z.string(),
})

const deleteToken = async (req: Request, userId: string) => {
    try {
        const body = await req.json()

        const parsed = validate(deleteTokenSchema, body)
        const { tokenId } = parsed
        const result = await prisma.token.deleteMany({
            where: {
                id: tokenId,
                userId: userId
            }
        })

        if (result.count === 0) {
            return NextResponse.json({ error: "Token not found or unauthorized" }, { status: 404 })
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        return NextResponse.json({ error: "Failed to delete token" }, { status: 500 })
    }
}

export const GET = protect(getUserTokens)
export const DELETE = protect(deleteToken)