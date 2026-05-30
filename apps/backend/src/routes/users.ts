import { Router } from "express";
import { Role } from "@techdesk-pro/constants";
import { UserSchemas } from "@techdesk-pro/validators";
import { verifyToken } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { UserService } from "../services/UserService";

const router = Router();
router.use(verifyToken);

router.get("/", requireRole(Role.ADMIN), async (_req, res, next) => {
  try {
    const users = await UserService.list();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (req.user!.role !== Role.ADMIN && req.user!.userId !== req.params.id) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    const user = await UserService.getById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/role", requireRole(Role.ADMIN), async (req, res, next) => {
  try {
    const payload = UserSchemas.updateUserRoleSchema.parse(req.body);
    const user = await UserService.updateRole(req.params.id, payload.role, req.user!.userId);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

export default router;
