import { Router } from "express";
import healthRouter from "./health.routes.js";
import itemsRouter from "./items.routes.js";
import productsRouter from "./products.routes.js";
import ordersRouter from "./orders.routes.js";
import cartsRouter from "./carts.routes.js";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/items", itemsRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/cart", cartsRouter);

export default apiRouter;
