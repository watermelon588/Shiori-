import { Router } from "express";
import * as downloadController from "./download.controller.js";

const router = Router();

router.post("/", downloadController.createDownload);
router.get("/:id", downloadController.getDownloadStatus);
router.delete("/:id", downloadController.cancelDownload);

export default router;
