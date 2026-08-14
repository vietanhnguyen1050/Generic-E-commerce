import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import apiRouter from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || origin === env.corsOrigin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// /api/v1  — legacy prefix
app.use("/api/v1", apiRouter);
// /api     — prefix mà FE dùng (e.g. /api/products)
app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
