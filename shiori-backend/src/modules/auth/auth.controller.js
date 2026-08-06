import * as authService from "./auth.service.js";

export const getAuthStatus = (req, res, next) => {
  try {
    const status = authService.getAuthStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
};
