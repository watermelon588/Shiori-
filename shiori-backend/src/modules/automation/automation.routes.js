import { Router } from "express";
import * as automationController from "./automation.controller.js";

const router = Router();

router.post("/execute", automationController.executeAutomation);

export default router;
