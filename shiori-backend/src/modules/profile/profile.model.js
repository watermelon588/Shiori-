import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    supabaseId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    preferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    downloadPath: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", profileSchema);
