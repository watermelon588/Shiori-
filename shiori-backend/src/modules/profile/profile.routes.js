import { Router } from "express";
import * as profileController from "./profile.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, profileController.getProfile);
router.patch("/", protect, profileController.updateProfile);

export default router;
