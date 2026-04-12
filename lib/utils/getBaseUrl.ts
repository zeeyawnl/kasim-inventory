/**
 * Returns the absolute base URL for API calls.
 * In Electron production, relative fetch("/api/...") can fail silently.
 * This ensures all fetch calls use an absolute URL.
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3000";
}
