import { supabase } from "../config/supabase.js";
import { AppError } from "../shared/errors/AppError.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Authorization token missing or invalid", 401));
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return next(new AppError("Invalid or expired token", 401));
    }

    req.user = data.user;
    next();
  } catch (error) {
    next(error);
  }
};

export default protect;
