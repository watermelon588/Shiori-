import { AppError } from "./errors/AppError.js";

export { AppError };

export class NotImplementedError extends AppError {
  constructor(message = "Feature not implemented") {
    super(message, 501);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}
