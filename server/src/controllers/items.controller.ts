import type { Request, Response, NextFunction } from "express";
import { itemsService } from "../services/items.service.js";
import { validateCreateItem, validateUpdateItem } from "../validations/item.validation.js";

export const listItems = (_req: Request, res: Response) => {
  res.status(200).json(itemsService.list());
};

export const getItemById = (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = itemsService.getById(req.params.id);
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

export const createItem = (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = validateCreateItem(req.body);
    const item = itemsService.create(payload);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const updateItem = (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = validateUpdateItem(req.body);
    const item = itemsService.update(req.params.id, payload);
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteItem = (req: Request, res: Response, next: NextFunction) => {
  try {
    itemsService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
