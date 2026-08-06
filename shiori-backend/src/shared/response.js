/**
 * Standard API response helper utilities for Shiori Backend.
 */

export const successResponse = (res, data = {}, statusCode = 200, message = null) => {
  return res.status(statusCode).json({
    success: true,
    ...(message && { message }),
    ...data,
  });
};

export const errorResponse = (res, message = "An error occurred", statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};
