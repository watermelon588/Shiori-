import { Router } from "express";
import * as providerController from "./provider.controller.js";

const router = Router();

router.get("/status", providerController.getProviderStatus);
router.get("/providers", providerController.getProviders);
router.post("/resolve", providerController.resolveProvider);

export default router;
