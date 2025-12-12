import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'


import z from "zod";
import validate, { ValidationResponseError } from "@/lib/zod-validate";

const loginSchema = z.object({
    email: z.email({
        message: "Invalid email address",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
});

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const parsed = validate(loginSchema, body);
        const { email, password } = parsed;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
        const { passwordHash, ...rest } = user
        const cookieStore = await cookies()
        cookieStore.set('token', token, { httpOnly: true, path: '/', sameSite: 'strict', maxAge: 60 * 60 * 24 * 7 })
        return NextResponse.json({ ...rest, token }, { status: 200 });
    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}