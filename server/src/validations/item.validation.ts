import type { CreateItemInput, UpdateItemInput } from "../types/item.js";
import { HttpError } from "../utils/http-error.js";

const isNonEmptyString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

export const validateCreateItem = (payload: unknown): CreateItemInput => {
  if (typeof payload !== "object" || payload === null) {
    throw new HttpError(400, "Request body must be an object.");
  }

  const { name, description } = payload as Record<string, unknown>;

  if (!isNonEmptyString(name)) {
    throw new HttpError(400, "Field 'name' is required.");
  }

  if (description !== undefined && typeof description !== "string") {
    throw new HttpError(400, "Field 'description' must be a string.");
  }

  return {
    name: name.trim(),
    description: typeof description === "string" ? description.trim() : undefined
  };
};

export const validateUpdateItem = (payload: unknown): UpdateItemInput => {
  if (typeof payload !== "object" || payload === null) {
    throw new HttpError(400, "Request body must be an object.");
  }

  const { name, description } = payload as Record<string, unknown>;

  if (name === undefined && description === undefined) {
    throw new HttpError(400, "At least one field must be provided.");
  }

  if (name !== undefined && !isNonEmptyString(name)) {
    throw new HttpError(400, "Field 'name' must be a non-empty string.");
  }

  if (description !== undefined && typeof description !== "string") {
    throw new HttpError(400, "Field 'description' must be a string.");
  }

  return {
    name: typeof name === "string" ? name.trim() : undefined,
    description: typeof description === "string" ? description.trim() : undefined
  };
};
