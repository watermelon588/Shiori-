export const getHealthStatus = () => {
  return {
    status: "healthy",
    service: "Shiori (栞)-backend",
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    backend: "online",
    database: "online",
    supabase: "online",
    integration: "offline",
    provider: "offline",
    automation: "offline",
  };
};

