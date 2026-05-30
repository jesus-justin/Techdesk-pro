import { Router } from "express";
import authRoutes from "./auth";
import ticketRoutes from "./tickets";
import assetRoutes from "./assets";
import userRoutes from "./users";
import auditRoutes from "./audit";
import dashboardRoutes from "./dashboard";

const router = Router();

router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);
router.use("/assets", assetRoutes);
router.use("/users", userRoutes);
router.use("/audit", auditRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
