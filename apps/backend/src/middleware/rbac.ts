import type { NextFunction, Request, Response } from "express";
import type { Role } from "@techdesk-pro/constants";

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    if (!roles.includes(userRole)) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    next();
  };
}
