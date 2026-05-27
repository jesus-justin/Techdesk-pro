import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { type JwtPayload } from "@techdesk-pro/types";

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ success: false, error: "Missing or invalid authorization header" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ success: false, error: "JWT secret is not configured" });
      return;
    }

    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = {
      userId: payload.userId,
      role: payload.role
    };
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}
