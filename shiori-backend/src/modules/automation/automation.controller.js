import * as automationService from "./automation.service.js";

export const executeAutomation = (req, res, next) => {
  try {
    automationService.executeAutomation();
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message || "Automation pipeline has not been implemented.",
    });
  }
};
