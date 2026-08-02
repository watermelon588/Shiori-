import { ZodError } from "zod";
import { logger } from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let status = err.status || "error";
  let message = err.message;
  let errors = undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    status = "fail";
    message = "Validation failed";
    errors = err.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
    errors,
  });

  res.status(statusCode).json({
    status,
    message,
    ...(errors && { errors }),
  });
};
