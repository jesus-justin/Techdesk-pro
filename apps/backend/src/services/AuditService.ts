import { type AuditAction, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class AuditService {
  static async log(
    action: AuditAction,
    entity: string,
    entityId: string,
    performedById: string,
    metadata?: Record<string, unknown> | Prisma.InputJsonValue | null
  ) {
    return prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        performedById,
        metadata: metadata ? (metadata as unknown as Prisma.InputJsonValue) : undefined
      }
    });
  }

  static async list(input: { cursor?: string; userId?: string; action?: AuditAction; limit?: number }) {
    const limit = input.limit ?? 20;

    const rows = await prisma.auditLog.findMany({
      where: {
        ...(input.userId ? { performedById: input.userId } : {}),
        ...(input.action ? { action: input.action } : {})
      },
      include: {
        performedBy: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: limit + 1,
      ...(input.cursor
        ? {
            skip: 1,
            cursor: { id: input.cursor }
          }
        : {})
    });

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;

    return {
      items,
      nextCursor: hasMore ? items[items.length - 1]?.id ?? null : null,
      hasMore
    };
  }
}
