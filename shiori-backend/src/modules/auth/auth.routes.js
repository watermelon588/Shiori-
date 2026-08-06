import { Router } from "express";
import * as authController from "./auth.controller.js";

const router = Router();

router.get("/status", authController.getAuthStatus);

export default router;
