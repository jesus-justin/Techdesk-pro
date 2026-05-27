import { type Role } from "@techdesk-pro/constants";
import { prisma } from "../lib/prisma.js";
import { AuditService } from "./AuditService.js";

export class UserService {
  static async list() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  static async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw Object.assign(new Error("User not found"), { status: 404 });
    }

    return user;
  }

  static async updateRole(id: string, role: Role, performedById: string) {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    await AuditService.log("UPDATE", "USER", id, performedById, { role });
    return user;
  }
}
