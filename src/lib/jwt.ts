import jwt from "jsonwebtoken";
interface CustomJwtPayload extends jwt.JwtPayload {
    userId: string;
}

function isCustomJwtPayload(decoded: string | jwt.JwtPayload): decoded is CustomJwtPayload {
    return (decoded as CustomJwtPayload).userId !== undefined;
}

export default isCustomJwtPayload