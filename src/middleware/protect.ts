
import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { rateLimit } from "@/lib/rate-limit";
import isCustomJwtPayload from "@/lib/jwt";


type Handler = (req: Request, userId: string, ...args: any[]) => Promise<NextResponse> | NextResponse | Response | Promise<Response>;


export const protect = (handler: Handler) => {
    return async (req: Request, ...args: any[]) => {
        const authHeader = req.headers.get("authorization");
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);

            if (isCustomJwtPayload(decoded)) {
                const limitResponse = await rateLimit(req, decoded.userId);
                if (limitResponse) return limitResponse;

                return handler(req, decoded.userId, ...args);
            } else {
                return NextResponse.json({ error: "Unauthorized: Invalid token payload" }, { status: 401 });
            }

        } catch (error) {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }
    };
};