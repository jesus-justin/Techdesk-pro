import type { Role } from "@techdesk-pro/constants";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: Role;
      };
    }
  }
}

export {};
