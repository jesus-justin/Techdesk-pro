import { TicketStatus, TICKET_STATUS_FLOW } from "@techdesk-pro/constants";
import type { Role } from "@techdesk-pro/constants";
import type { TicketFilterInput, UpdateTicketInput } from "@techdesk-pro/validators";
import { prisma } from "../lib/prisma";
import { AuditService } from "./AuditService";

export class TicketService {
  static async list(filters: TicketFilterInput, userId: string, role: Role) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    const where = {
      ...(role === "EMPLOYEE" ? { submittedById: userId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.priority ? { priority: filters.priority } : {}),
      ...(filters.q
        ? {
            OR: [
              { title: { contains: filters.q, mode: "insensitive" as const } },
              { description: { contains: filters.q, mode: "insensitive" as const } }
            ]
          }
        : {})
    };

    const [items, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          submittedBy: true,
          assignedTo: true,
          comments: true,
          asset: true
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.ticket.count({ where })
    ]);

    return {
      items,
      page,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    };
  }

  static async getById(id: string, userId: string, role: Role) {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        comments: {
          include: {
            author: true
          },
          orderBy: { createdAt: "asc" }
        },
        submittedBy: true,
        assignedTo: true,
        asset: true
      }
    });

    if (!ticket) {
      throw Object.assign(new Error("Ticket not found"), { status: 404 });
    }

    if (role === "EMPLOYEE" && ticket.submittedById !== userId) {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }

    return ticket;
  }

  static async create(
    data: { title: string; description: string; priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; assetId?: string },
    submittedById: string
  ) {
    const ticket = await prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        submittedById,
        assetId: data.assetId
      }
    });

    await AuditService.log("CREATE", "TICKET", ticket.id, submittedById, { title: ticket.title });
    return ticket;
  }

  static async update(id: string, data: UpdateTicketInput, userId: string, role: Role) {
    const existing = await prisma.ticket.findUnique({ where: { id } });
    if (!existing) {
      throw Object.assign(new Error("Ticket not found"), { status: 404 });
    }

    if (role === "EMPLOYEE" && existing.submittedById !== userId) {
      throw Object.assign(new Error("Forbidden"), { status: 403 });
    }

    if ((data.assignedToId !== undefined || data.status !== undefined) && role === "EMPLOYEE") {
      throw Object.assign(new Error("Only IT staff or admin can assign/update status"), { status: 403 });
    }

    if (data.status && data.status !== existing.status) {
      const allowed = TICKET_STATUS_FLOW[existing.status as TicketStatus];
      if (!allowed.includes(data.status as TicketStatus)) {
        throw Object.assign(new Error("Invalid status transition"), { status: 400 });
      }
    }

    const updated = await prisma.ticket.update({
      where: { id },
      data: {
        ...data,
        resolvedAt:
          data.status === "RESOLVED" && existing.status !== "RESOLVED"
            ? new Date()
            : existing.resolvedAt,
        closedAt: data.status === "CLOSED" && existing.status !== "CLOSED" ? new Date() : existing.closedAt
      }
    });

    const action =
      data.status === TicketStatus.RESOLVED
        ? "RESOLVE"
        : data.status === TicketStatus.CLOSED
          ? "CLOSE"
          : "UPDATE";

    await AuditService.log(action, "TICKET", updated.id, userId, { before: existing.status, after: updated.status });
    return updated;
  }

  static async delete(id: string, userId: string) {
    const ticket = await prisma.ticket.delete({ where: { id } });
    await AuditService.log("DELETE", "TICKET", id, userId, { title: ticket.title });
    return ticket;
  }

  static async addComment(ticketId: string, content: string, authorId: string) {
    const comment = await prisma.comment.create({
      data: {
        ticketId,
        authorId,
        content
      }
    });

    await AuditService.log("UPDATE", "TICKET_COMMENT", comment.id, authorId, { ticketId });
    return comment;
  }
}
