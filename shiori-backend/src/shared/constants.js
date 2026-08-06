/**
 * Shared constants for Shiori Backend.
 */

export const SYSTEM_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
  MAINTENANCE: "maintenance",
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_IMPLEMENTED: 501,
  INTERNAL_SERVER_ERROR: 500,
};

export const MODULE_NAMES = {
  AUTH: "auth",
  HEALTH: "health",
  PROFILE: "profile",
  ANIME: "anime",
  INTEGRATION: "integration",
  PROVIDER: "provider",
  DOWNLOAD: "download",
  AUTOMATION: "automation",
};
