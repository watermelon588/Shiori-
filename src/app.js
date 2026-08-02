import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import rateLimit from "express-rate-limit";
import { logger } from "./config/logger.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFound } from "./middleware/notFound.middleware.js";

import healthRoutes from "./modules/health/health.routes.js";
import profileRoutes from "./modules/profile/profile.routes.js";

const app = express();

// Security middlewares
app.use(helmet());
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Pino HTTP middleware for request logging
app.use(pinoHttp({ logger }));

// Rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// API routes
app.use("/api/health", healthRoutes);
app.use("/api/profile", profileRoutes);

// Catch-all 404 and global error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
