/**
 * Helper to generate optimized Supabase image URLs.
 * NOTE: Supabase Image Transformation (/storage/v1/render/image/public/...) requires
 * the paid Pro plan tier. If called on standard Supabase storage, it returns 403 FeatureNotEnabled.
 * Therefore, we retain the direct public object storage URL (/storage/v1/object/public/...),
 * which delivers the uploaded WebP assets with full HTTP caching and 200 OK responses.
 */
export function getOptimizedImageUrl(url) {
  if (!url || typeof url !== "string") return url || "";
  return url;
}

/**
 * Generate responsive image props.
 */
export function getResponsiveImageProps(url) {
  return { src: url || "" };
}

/**
 * Default SVG data URI avatar placeholder for missing/failed team photos.
 */
export const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3Cg fill='%2394a3b8'%3E%3Ccircle cx='128' cy='96' r='48'/%3E%3Cpath d='M48 216c0-44.18 35.82-80 80-80s80 35.82 80 80z'/%3E%3C/g%3E%3C/svg%3E";
