import { AssetStatus } from "@techdesk-pro/constants";
import { prisma } from "../lib/prisma.js";
import { AuditService } from "./AuditService.js";

export class AssetService {
  static async list(page = 1, limit = 20, status?: AssetStatus, q?: string) {
    const where = {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { category: { contains: q, mode: "insensitive" as const } },
              { serialNumber: { contains: q, mode: "insensitive" as const } }
            ]
          }
        : {})
    };

    const [items, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        include: {
          assignments: {
            include: { user: true },
            orderBy: { assignedAt: "desc" }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.asset.count({ where })
    ]);

    return {
      items,
      page,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    };
  }

  static async getById(id: string) {
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        assignments: {
          include: { user: true },
          orderBy: { assignedAt: "desc" }
        }
      }
    });

    if (!asset) {
      throw Object.assign(new Error("Asset not found"), { status: 404 });
    }

    return asset;
  }

  static async create(data: {
    name: string;
    category: string;
    serialNumber: string;
    model: string;
    manufacturer: string;
    purchaseDate?: Date;
    notes?: string;
  }, performedById: string) {
    const asset = await prisma.asset.create({
      data: {
        ...data,
        status: AssetStatus.AVAILABLE
      }
    });

    await AuditService.log("CREATE", "ASSET", asset.id, performedById, { name: asset.name });
    return asset;
  }

  static async update(id: string, data: Record<string, unknown>, performedById: string) {
    const asset = await prisma.asset.update({ where: { id }, data });
    await AuditService.log("UPDATE", "ASSET", id, performedById, data);
    return asset;
  }

  static async delete(id: string, performedById: string) {
    const existing = await prisma.asset.findUnique({ where: { id } });
    if (!existing) {
      throw Object.assign(new Error("Asset not found"), { status: 404 });
    }

    if (existing.status === AssetStatus.IN_USE) {
      throw Object.assign(new Error("Cannot delete asset while in use"), { status: 400 });
    }

    await prisma.asset.delete({ where: { id } });
    await AuditService.log("DELETE", "ASSET", id, performedById, { name: existing.name });
  }

  static async assign(assetId: string, userId: string, notes: string | undefined, performedById: string) {
    const assignment = await prisma.assetAssignment.create({
      data: {
        assetId,
        userId,
        notes: notes ?? null
      }
    });

    await prisma.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.IN_USE }
    });

    await AuditService.log("ASSIGN", "ASSET", assetId, performedById, { userId });
    return assignment;
  }

  static async unassign(assetId: string, performedById: string) {
    const latest = await prisma.assetAssignment.findFirst({
      where: { assetId, returnedAt: null },
      orderBy: { assignedAt: "desc" }
    });

    if (!latest) {
      throw Object.assign(new Error("No active assignment found"), { status: 404 });
    }

    await prisma.assetAssignment.update({
      where: { id: latest.id },
      data: { returnedAt: new Date() }
    });

    await prisma.asset.update({
      where: { id: assetId },
      data: { status: AssetStatus.AVAILABLE }
    });

    await AuditService.log("UPDATE", "ASSET_ASSIGNMENT", latest.id, performedById, { assetId, returned: true });
  }
}
