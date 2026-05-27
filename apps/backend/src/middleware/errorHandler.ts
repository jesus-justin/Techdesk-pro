import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    const fieldErrors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }));

    res.status(400).json({
      success: false,
      error: "Validation failed",
      data: fieldErrors
    });
    return;
  }

  const status = (err as Error & { status?: number }).status ?? 500;
  logger.error(err.message, { stack: err.stack });

  res.status(status).json({
    success: false,
    error: err.message || "Internal server error"
  });
}
