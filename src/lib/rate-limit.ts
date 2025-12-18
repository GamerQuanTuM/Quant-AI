
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const RATELIMIT_WINDOW = 60;
const MAX_REQUESTS = 20; 
export async function rateLimit(req: Request, userId: string): Promise<NextResponse | null> {
    if (!redis) return null;

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const key = `ratelimit:${userId || ip}`;

    try {
        const current = await redis.incr(key);

        if (current === 1) {
            await redis.expire(key, RATELIMIT_WINDOW);
        }

        if (current > MAX_REQUESTS) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 }
            );
        }

        return null;
    } catch (error) {
        console.error("Rate limit error:", error);
        return null;
    }
}
