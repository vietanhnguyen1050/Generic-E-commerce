import { Router } from "express";
import { listProducts, getProductById } from "../controllers/products.controller.js";

const productsRouter = Router();

productsRouter.get("/", listProducts);
productsRouter.get("/:id", getProductById);

export default productsRouter;
