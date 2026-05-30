import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { Role } from "@techdesk-pro/constants";
import { prisma } from "../lib/prisma";
import { AuditService } from "./AuditService";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getSecrets(): { access: string; refresh: string } {
  const access = process.env.JWT_SECRET;
  const refresh = process.env.JWT_REFRESH_SECRET;

  if (!access || !refresh) {
    throw new Error("JWT secrets are not configured");
  }

  return { access, refresh };
}

function toSafeUser<T extends { passwordHash: string; refreshToken: string | null }>(user: T) {
  const { passwordHash: _passwordHash, refreshToken: _refreshToken, ...safe } = user;
  return safe;
}

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    const { access, refresh } = getSecrets();
    const accessToken = jwt.sign({ userId: user.id, role: user.role }, access, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: user.id, role: user.role }, refresh, { expiresIn: "7d" });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashRefreshToken(refreshToken) }
    });

    await AuditService.log("LOGIN", "AUTH", user.id, user.id, { email: user.email });

    return {
      accessToken,
      refreshToken,
      user: toSafeUser(user)
    };
  }

  static async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw Object.assign(new Error("Email already in use"), { status: 409 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: data.role ?? Role.EMPLOYEE
      }
    });

    await AuditService.log("CREATE", "USER", user.id, user.id, { email: user.email, role: user.role });
    return toSafeUser(user);
  }

  static async refreshToken(token: string) {
    const { access, refresh } = getSecrets();
    const payload = jwt.verify(token, refresh) as { userId: string; role: Role };

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.refreshToken) {
      throw Object.assign(new Error("Invalid refresh token"), { status: 401 });
    }

    if (user.refreshToken !== hashRefreshToken(token)) {
      throw Object.assign(new Error("Refresh token mismatch"), { status: 401 });
    }

    const accessToken = jwt.sign({ userId: user.id, role: user.role }, access, { expiresIn: "15m" });
    return { accessToken };
  }

  static async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null
      }
    });

    await AuditService.log("LOGOUT", "AUTH", userId, userId);
  }
}
