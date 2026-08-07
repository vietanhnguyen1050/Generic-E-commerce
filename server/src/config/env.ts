import dotenv from "dotenv";

dotenv.config();

const parsedPort = Number(process.env.PORT ?? "5000");

if (!Number.isFinite(parsedPort) || parsedPort <= 0) {
  throw new Error("Invalid PORT value. Expected a positive number.");
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsedPort,
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173"
};
