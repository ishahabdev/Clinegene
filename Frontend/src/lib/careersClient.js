import { supabase } from "./supabase.js";

let careersCache = null;
let careersCacheTime = 0;
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

/**
 * Fetch published job openings from Supabase `jobs` table ordered by sort_order
 */
export async function fetchPublishedJobs(forceRefresh = false) {
  if (!supabase) return [];
  const now = Date.now();
  if (!forceRefresh && careersCache && now - careersCacheTime < CACHE_TTL) {
    return careersCache;
  }

  try {
    let { data, error } = await supabase
      .from("jobs")
      .select("id, title, position, short_description, subtitle, description, department, job_type, type, location, job_status, applicants_count, sort_order, status, created_at")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .limit(30);

    if (error) {
      const fallback = await supabase
        .from("jobs")
        .select("id, title, position, short_description, subtitle, description, department, job_type, type, location, job_status, applicants_count, sort_order, status, created_at")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(30);
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      if (import.meta.env.DEV) {
        console.error("[fetchPublishedJobs] Supabase error:", error);
      }
      return careersCache || [];
    }

    const mapped = (data || []).map((row) => ({
      id: row.id,
      title: row.title || row.position || "",
      shortDescription: row.short_description || row.subtitle || row.description || "",
      short_description: row.short_description || row.subtitle || row.description || "",
      description: row.short_description || row.subtitle || row.description || "",
      department: row.department || "Research",
      type: row.job_type || row.type || "Full Time",
      location: row.location || "Islamabad, Pakistan",
      jobStatus: row.job_status || "Active",
      applicantsCount: Number(row.applicants_count ?? row.applicants) || 0,
      sortOrder: row.sort_order ?? 1,
      createdAt: row.created_at,
    }));

    careersCache = mapped;
    careersCacheTime = now;
    return mapped;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error("[fetchPublishedJobs] Exception:", err);
    }
    return careersCache || [];
  }
}

