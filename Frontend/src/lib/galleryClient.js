import { supabase } from "./supabase.js";

/**
 * Fetch published gallery items directly from Supabase `gallery` table.
 * Returns only live database items (NO static mock fallback).
 */
export async function fetchPublishedGallery() {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      if (import.meta.env.DEV) {
        console.error("[fetchPublishedGallery] Supabase query error:", error);
      }
      return [];
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Filter out items explicitly marked as draft
    return data
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
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error("[fetchPublishedGallery] Unexpected exception:", err);
    }
    return [];
  }
}
