import { supabase } from "./supabase.js";

/**
 * Fetch published job openings from Supabase `jobs` table ordered by sort_order
 */
export async function fetchPublishedJobs() {
  if (!supabase) return [];

  try {
    let { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (error) {
      const fallback = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      if (import.meta.env.DEV) {
        console.error("[fetchPublishedJobs] Supabase error:", error);
      }
      return [];
    }

    return (data || []).map((row) => ({
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
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error("[fetchPublishedJobs] Exception:", err);
    }
    return [];
  }
}

