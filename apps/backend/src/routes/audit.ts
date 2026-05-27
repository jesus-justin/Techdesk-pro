import { type AuditAction } from "@prisma/client";
import { Router } from "express";
import { Role } from "@techdesk-pro/constants";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { AuditService } from "../services/AuditService.js";

const router = Router();
router.use(verifyToken, requireRole(Role.ADMIN));

router.get("/", async (req, res, next) => {
  try {
    const cursor = req.query.cursor ? String(req.query.cursor) : undefined;
    const userId = req.query.userId ? String(req.query.userId) : undefined;
    const action = req.query.action ? (String(req.query.action) as AuditAction) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const result = await AuditService.list({ cursor, userId, action, limit });
    res.json({ success: true, data: result.items, meta: { hasMore: result.hasMore, nextCursor: result.nextCursor } });
  } catch (error) {
    next(error);
  }
});

export default router;
