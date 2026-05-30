import { Router } from "express";
import { TicketStatus, AssetStatus } from "@techdesk-pro/constants";
import { verifyToken } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const router = Router();
router.use(verifyToken);

router.get("/", async (_req, res, next) => {
  try {
    const [
      openTickets,
      inProgressTickets,
      resolvedTickets,
      totalTickets,
      totalAssets,
      availableAssets,
      recentActivity
    ] = await Promise.all([
      prisma.ticket.count({ where: { status: TicketStatus.OPEN } }),
      prisma.ticket.count({ where: { status: TicketStatus.IN_PROGRESS } }),
      prisma.ticket.count({ where: { status: TicketStatus.RESOLVED } }),
      prisma.ticket.count(),
      prisma.asset.count(),
      prisma.asset.count({ where: { status: AssetStatus.AVAILABLE } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          performedBy: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        openTickets,
        inProgressTickets,
        resolvedTickets,
        totalTickets,
        totalAssets,
        availableAssets,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
