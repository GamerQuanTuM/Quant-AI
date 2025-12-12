import { prisma } from "@/lib/prisma";
import validate, { ValidationResponseError } from "@/lib/zod-validate";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import z from "zod";

const registerSchema = z.object({
    email: z.string().email({
        message: "Invalid email address",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
    name: z.string().min(3, {
        message: "Name must be at least 3 characters long",
    }),
});

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const parsed = validate(registerSchema, body);

        const { email, password, name } = parsed;

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: await bcrypt.hash(password, 10),
                name,
            },
        });
        const { passwordHash, ...rest } = user
        return NextResponse.json(rest, { status: 201 });
    } catch (error) {
        if (error instanceof ValidationResponseError) {
            return error.response;
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}