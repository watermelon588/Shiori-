import * as providerService from "./provider.service.js";

export const getProviderStatus = (req, res, next) => {
  try {
    providerService.getProviderStatus();
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message || "Provider engine has not been implemented.",
    });
  }
};

export const getProviders = (req, res, next) => {
  try {
    providerService.getProviders();
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message || "Provider engine has not been implemented.",
    });
  }
};

export const resolveProvider = (req, res, next) => {
  try {
    providerService.resolveProvider();
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message || "Provider engine has not been implemented.",
    });
  }
};
