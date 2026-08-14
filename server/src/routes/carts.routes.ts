import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/carts.controller.js";

const cartsRouter = Router();

cartsRouter.get("/", getCart);
cartsRouter.post("/items", addToCart);
cartsRouter.patch("/items/:productId", updateCartItem);
cartsRouter.delete("/items/:productId", removeCartItem);
cartsRouter.delete("/", clearCart);

export default cartsRouter;
