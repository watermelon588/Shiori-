import { env } from "./config/env.js";
import app from "./app.js";
import { connectDB } from "./config/database.js";
import { logger } from "./config/logger.js";

// Fail fast on database connection error during bootstrap
await connectDB();

const PORT = env.PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});
