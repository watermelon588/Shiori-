import * as healthService from "./health.service.js";

export const getHealth = (req, res, next) => {
  try {
    const health = healthService.getHealthStatus();
    res.json(health);
  } catch (error) {
    next(error);
  }
};
