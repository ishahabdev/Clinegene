import { supabase } from "./supabase.js";

let galleryCache = null;
let galleryCacheTime = 0;
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

/**
 * Fetch published gallery items directly from Supabase `gallery` table.
 * Returns only live database items (NO static mock fallback).
 */
export async function fetchPublishedGallery(forceRefresh = false) {
  if (!supabase) return [];
  const now = Date.now();
  if (!forceRefresh && galleryCache && now - galleryCacheTime < CACHE_TTL) {
    return galleryCache;
  }

  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("id, title, image_url, image_alt, caption, category, event_date, sort_order, status, created_at")
      .order("sort_order", { ascending: true })
      .limit(60);

    if (error) {
      if (import.meta.env.DEV) {
        console.error("[fetchPublishedGallery] Supabase query error:", error);
      }
      return galleryCache || [];
    }

    if (!data || !Array.isArray(data)) {
      return galleryCache || [];
    }

    // Filter out items explicitly marked as draft
    const mapped = data
      .filter((row) => !row.status || String(row.status).toLowerCase() !== "draft")
      .map((row) => ({
        id: row.id,
        title: row.title || "ClinGene Photo",
        src: row.image_url || "",
        image_url: row.image_url || "",
        image_alt: row.image_alt || row.title || "ClinGene Gallery Photo",
        caption: row.caption || "",
        category: row.category || "General",
        folder: row.category || "General",
        albumName: row.category || "General",
        date: row.event_date ? String(row.event_date) : "",
        event_date: row.event_date ? String(row.event_date) : "",
        sortOrder: row.sort_order ?? 1,
        createdAt: row.created_at,
      }));

    galleryCache = mapped;
    galleryCacheTime = now;
    return mapped;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error("[fetchPublishedGallery] Unexpected exception:", err);
    }
    return galleryCache || [];
  }
}
