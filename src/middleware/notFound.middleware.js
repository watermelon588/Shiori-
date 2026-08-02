import { AppError } from "../shared/errors/AppError.js";

export const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};
