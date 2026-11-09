import { supabase } from "./supabase.js";
import { mapResearchFromDb } from "../Admin/api/research.js";

let researchCache = null;
let researchCacheTime = 0;
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

/**
 * Fetch published research entries directly from Supabase `research` table.
 * Returns only live database items (NO static mock fallback).
 */
export async function fetchPublishedResearch(forceRefresh = false) {
  if (!supabase) return [];
  const now = Date.now();
  if (!forceRefresh && researchCache && now - researchCacheTime < CACHE_TTL) {
    return researchCache;
  }

  try {
    let { data, error } = await supabase
      .from("research")
      .select("id, title, category, abstract, authors, journal, publication_date, doi, pdf_url, sort_order, status, created_at")
      .order("sort_order", { ascending: true })
      .limit(60);

    if (error) {
      const fallback = await supabase
        .from("research")
        .select("id, title, category, abstract, authors, journal, publication_date, doi, pdf_url, sort_order, status, created_at")
        .order("created_at", { ascending: false })
        .limit(60);
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.warn("[fetchPublishedResearch] Supabase query error:", error.message);
      return researchCache || [];
    }

    if (!data || !Array.isArray(data)) {
      return researchCache || [];
    }

    const mapped = data
      .filter((row) => !row.status || String(row.status).toLowerCase() !== "draft")
      .map(mapResearchFromDb);

    researchCache = mapped;
    researchCacheTime = now;
    return mapped;
  } catch (err) {
    console.error("[fetchPublishedResearch] Exception:", err);
    return researchCache || [];
  }
}
