import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request & { userId?: string }, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"] ?? "";

    try {
        const decoded = jwt.verify(authHeader, process.env.JWT_SECRET as string) as { userId?: string };
        console.log(decoded);
        if (decoded.userId) {
            req.userId = decoded.userId;
            return next();
        } else {
            return res.status(403).json({
                message: "You are not logged in"
            })    
        }
    } catch(e) {
        return res.status(403).json({
            message: "You are not logged in"
        })
    }
}