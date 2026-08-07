import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/http-error.js";

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new HttpError(404, "Route not found."));
};
