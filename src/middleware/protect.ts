import { NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";

// Define an interface for your expected JWT payload shape
interface CustomJwtPayload extends jwt.JwtPayload {
    userId: string;
}

type Handler = (req: Request, userId: string) => Promise<NextResponse> | NextResponse | Response | Promise<Response> ;

function isCustomJwtPayload(decoded: string | jwt.JwtPayload): decoded is CustomJwtPayload {
    return (decoded as CustomJwtPayload).userId !== undefined;
}

export const protect = (handler: Handler) => {
    return async (req: Request) => {
        const authHeader = req.headers.get("authorization");
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);

            if (isCustomJwtPayload(decoded)) {
                return handler(req, decoded.userId);
            } else {
                return NextResponse.json({ error: "Unauthorized: Invalid token payload" }, { status: 401 });
            }

        } catch (error) {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }
    };
};