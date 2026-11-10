/**
 * Admin Configuration
 *
 * Single source of truth for the admin base URL.
 * Read strictly from VITE_ADMIN_BASE with NO fallback default.
 * If VITE_ADMIN_BASE is missing or empty, admin routes are disabled completely.
 */

const rawBase = import.meta.env.VITE_ADMIN_BASE;

export const ADMIN_BASE = (() => {
  if (!rawBase || typeof rawBase !== "string") return "";
  const trimmed = rawBase.trim();
  if (!trimmed) return "";
  // Ensure single leading slash and remove all trailing slashes
  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeading.replace(/\/+$/, "");
})();

export const IS_ADMIN_ENABLED = Boolean(ADMIN_BASE);

/**
 * Helper to construct an admin sub-path.
 * e.g. adminPath("/team") -> "/opclin-23410/team"
 * If admin is disabled, returns an empty string.
 */
export function adminPath(subPath = "") {
  if (!ADMIN_BASE) return "";
  if (!subPath) return ADMIN_BASE;
  const cleanSub = subPath.startsWith("/") ? subPath : `/${subPath}`;
  return `${ADMIN_BASE}${cleanSub}`.replace(/\/+$/, "");
}

