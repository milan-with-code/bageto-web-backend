import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export function signAccessToken(payload: object) {
    return jwt.sign(payload, ENV.JWT_SECRET!, { expiresIn: "7d" });
}

export function verifyToken<T = any>(token: string): T {
    return jwt.verify(token, ENV.JWT_SECRET!) as T;
}

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in live
    sameSite: "none" as const, // cross-site cookie allowed
    path: "/",
    domain: ".vercel.app",
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
};
