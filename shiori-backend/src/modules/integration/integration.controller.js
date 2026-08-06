import * as integrationService from "./integration.service.js";

export const getIntegrationStatus = (req, res, next) => {
  try {
    const status = integrationService.getIntegrationStatus();
    res.json(status);
  } catch (error) {
    next(error);
  }
};
