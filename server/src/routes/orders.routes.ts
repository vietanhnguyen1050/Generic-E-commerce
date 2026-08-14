import { Router } from "express";
import { createOrder, getOrder } from "../controllers/orders.controller.js";

const ordersRouter = Router();

ordersRouter.post("/", createOrder);
ordersRouter.get("/:id", getOrder);
ordersRouter.get("/", getOrder);

export default ordersRouter;
