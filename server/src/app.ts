import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: env.corsOrigin
  })
);
app.use(express.json());

app.use("/api/v1", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
