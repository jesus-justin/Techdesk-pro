import { Router } from "express";
import { Role } from "@techdesk-pro/constants";
import { TicketSchemas } from "@techdesk-pro/validators";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { TicketService } from "../services/TicketService.js";

const router = Router();
router.use(verifyToken);

router.get("/", async (req, res, next) => {
  try {
    const filters = TicketSchemas.ticketFilterSchema.parse(req.query);
    const result = await TicketService.list(filters, req.user!.userId, req.user!.role);
    res.json({ success: true, data: result.items, meta: result });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = TicketSchemas.createTicketSchema.parse(req.body);
    const ticket = await TicketService.create(payload, req.user!.userId);
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const ticket = await TicketService.getById(req.params.id, req.user!.userId, req.user!.role);
    res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const payload = TicketSchemas.updateTicketSchema.parse(req.body);
    const ticket = await TicketService.update(req.params.id, payload, req.user!.userId, req.user!.role);
    res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireRole(Role.ADMIN), async (req, res, next) => {
  try {
    await TicketService.delete(req.params.id, req.user!.userId);
    res.json({ success: true, data: { deleted: true } });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/comments", async (req, res, next) => {
  try {
    const payload = TicketSchemas.addCommentSchema.parse(req.body);
    const comment = await TicketService.addComment(req.params.id, payload.content, req.user!.userId);
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
});

export default router;
