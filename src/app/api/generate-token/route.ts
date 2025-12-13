import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import z from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import validate, { ValidationResponseError } from "@/lib/zod-validate";
import { protect } from "@/middleware/protect"
import { encrypt } from "@/lib/encryption";

const generateTokenSchema = z.object({
    alias: z.string().min(3).max(20).optional(),
})

const generateToken = async (req: Request, userId: string) => {
    const body = await req.json()

    try {
        const parsed = validate(generateTokenSchema, body);
        const { alias } = parsed;
        const token = jwt.sign({ userId }, process.env.JWT_SECRET!)

        const encryptedToken = encrypt(token)

        const savedToken = await prisma.token.create({
            data: {
                token: encryptedToken,
                userId,
                alias,
                expiry: new Date(9999, 0, 1)
            }
        })

        const { token:dbToken, ...rest } = savedToken

        return NextResponse.json({ ...rest, token });
    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }


}

export const POST = protect(generateToken)