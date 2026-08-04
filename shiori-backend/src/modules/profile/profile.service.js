import Profile from "./profile.model.js";
import { AppError } from "../../shared/errors/AppError.js";

/**
 * Gets a user profile by Supabase ID, creating it if it does not exist.
 * @param {string} supabaseId
 * @returns {Promise<Object>} The user profile document
 */
export const getOrCreateProfile = async (supabaseId) => {
  let profile = await Profile.findOne({ supabaseId });
  if (!profile) {
    profile = await Profile.create({ supabaseId });
  }
  return profile;
};

/**
 * Updates a user profile.
 * @param {string} supabaseId
 * @param {Object} updateData
 * @returns {Promise<Object>} The updated user profile document
 */
export const updateProfile = async (supabaseId, updateData) => {
  const profile = await Profile.findOneAndUpdate(
    { supabaseId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  return profile;
};
