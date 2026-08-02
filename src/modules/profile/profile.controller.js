import * as profileService from "./profile.service.js";
import { z } from "zod";

const updateProfileSchema = z.object({
  preferences: z.record(z.any()).optional(),
  downloadPath: z.string().optional(),
}).strict();

export const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getOrCreateProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    const profile = await profileService.updateProfile(req.user.id, validatedData);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};
