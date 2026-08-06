export const getAuthStatus = () => {
  return {
    success: true,
    service: "auth",
    provider: "supabase",
    status: "configured",
    message: "Supabase Authentication is active. JWT validation handled via protect middleware.",
  };
};
