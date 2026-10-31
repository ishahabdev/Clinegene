import { supabase } from "./supabase.js";
import { mapResearchFromDb } from "../Admin/api/research.js";

/**
 * Fetch published research entries directly from Supabase `research` table.
 * Returns only live database items (NO static mock fallback).
 */
export async function fetchPublishedResearch() {
  if (!supabase) return [];

  try {
    let { data, error } = await supabase
      .from("research")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      const fallback = await supabase
        .from("research")
        .select("*")
        .order("created_at", { ascending: false });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.warn("[fetchPublishedResearch] Supabase query error:", error.message);
      return [];
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data
      .filter((row) => !row.status || String(row.status).toLowerCase() !== "draft")
      .map(mapResearchFromDb);
  } catch (err) {
    console.error("[fetchPublishedResearch] Exception:", err);
    return [];
  }
}
