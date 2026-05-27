import { Router } from "express";
import { Role } from "@techdesk-pro/constants";
import { AssetSchemas } from "@techdesk-pro/validators";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { AssetService } from "../services/AssetService.js";

const router = Router();
router.use(verifyToken);

router.get("/", requireRole(Role.IT_STAFF, Role.ADMIN), async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const status = req.query.status as undefined;
    const q = req.query.q ? String(req.query.q) : undefined;
    const result = await AssetService.list(page, limit, status, q);
    res.json({ success: true, data: result.items, meta: result });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireRole(Role.IT_STAFF, Role.ADMIN), async (req, res, next) => {
  try {
    const payload = AssetSchemas.createAssetSchema.parse(req.body);
    const asset = await AssetService.create(payload, req.user!.userId);
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const asset = await AssetService.getById(req.params.id);
    res.json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", requireRole(Role.IT_STAFF, Role.ADMIN), async (req, res, next) => {
  try {
    const payload = AssetSchemas.updateAssetSchema.parse(req.body);
    const asset = await AssetService.update(req.params.id, payload, req.user!.userId);
    res.json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireRole(Role.ADMIN), async (req, res, next) => {
  try {
    await AssetService.delete(req.params.id, req.user!.userId);
    res.json({ success: true, data: { deleted: true } });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/assign", requireRole(Role.IT_STAFF, Role.ADMIN), async (req, res, next) => {
  try {
    const payload = AssetSchemas.assignAssetSchema.parse(req.body);
    const assignment = await AssetService.assign(req.params.id, payload.userId, payload.notes, req.user!.userId);
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
});

export default router;
