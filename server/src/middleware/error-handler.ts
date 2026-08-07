import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof Error) {
    res.status(500).json({
      message: "Internal Server Error",
      detail: env.nodeEnv === "development" ? error.message : undefined
    });
    return;
  }

  res.status(500).json({ message: "Internal Server Error" });
};
