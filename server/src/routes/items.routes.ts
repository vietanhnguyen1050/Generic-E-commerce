import { Router } from "express";
import {
  createItem,
  deleteItem,
  getItemById,
  listItems,
  updateItem
} from "../controllers/items.controller.js";

const itemsRouter = Router();

itemsRouter.get("/", listItems);
itemsRouter.get("/:id", getItemById);
itemsRouter.post("/", createItem);
itemsRouter.patch("/:id", updateItem);
itemsRouter.delete("/:id", deleteItem);

export default itemsRouter;
