import * as downloadService from "./download.service.js";

export const createDownload = (req, res, next) => {
  try {
    downloadService.createDownload();
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message || "Download engine has not been implemented.",
    });
  }
};

export const getDownloadStatus = (req, res, next) => {
  try {
    downloadService.getDownloadStatus(req.params.id);
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message || "Download engine has not been implemented.",
    });
  }
};

export const cancelDownload = (req, res, next) => {
  try {
    downloadService.cancelDownload(req.params.id);
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: error.message || "Download engine has not been implemented.",
    });
  }
};
