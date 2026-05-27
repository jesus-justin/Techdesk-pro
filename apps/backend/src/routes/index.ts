import { Router } from "express";
import authRoutes from "./auth.js";
import ticketRoutes from "./tickets.js";
import assetRoutes from "./assets.js";
import userRoutes from "./users.js";
import auditRoutes from "./audit.js";
import dashboardRoutes from "./dashboard.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);
router.use("/assets", assetRoutes);
router.use("/users", userRoutes);
router.use("/audit", auditRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
