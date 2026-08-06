import { Router } from "express";
import * as integrationController from "./integration.controller.js";

const router = Router();

router.get("/status", integrationController.getIntegrationStatus);

export default router;
