/**
 * Helper functions for token storage and auth state management.
 */

/**
 * Returns access_token from localStorage if present.
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

/**
 * Clears access and refresh tokens from localStorage and redirects to /login.
 */
export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/login";
}
