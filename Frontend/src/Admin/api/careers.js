import { supabase } from "../../lib/supabase.js";

/**
 * Map database row from `jobs` table to Admin / frontend job model
 */
export function mapJobFromDb(row) {
  if (!row) return null;

  return {
    id: row.id,
    position: row.title || row.position || "",
    title: row.title || row.position || "",
    subtitle: row.short_description || row.subtitle || row.description || "",
    short_description: row.short_description || row.subtitle || row.description || "",
    department: row.department || "Human Genetics",
    type: row.job_type || row.type || "Full Time",
    job_type: row.job_type || row.type || "Full Time",
    status: row.job_status || (row.status === "draft" ? "Closed" : "Active"),
    job_status: row.job_status || (row.status === "draft" ? "Closed" : "Active"),
    applicants: Number(row.applicants_count ?? row.applicants) || 0,
    applicants_count: Number(row.applicants_count ?? row.applicants) || 0,
    sort_order: row.sort_order ?? 1,
    created_at: row.created_at,
  };
}

/**
 * Map Admin job form data to database row for `jobs` table
 */
export function mapJobToDb(item, nextSortOrder) {
  const isClosed = item.status === "Closed" || item.job_status === "Closed";

  const payload = {
    title: (item.position || item.title || "").trim(),
    short_description: (item.subtitle || item.short_description || item.description || "").trim() || null,
    department: (item.department || "Human Genetics").trim(),
    job_type: (item.type || item.job_type || "Full Time").trim(),
    job_status: isClosed ? "Closed" : "Active",
    applicants_count: Number(item.applicants ?? item.applicants_count) || 0,
    status: isClosed ? "draft" : "published",
  };

  if (nextSortOrder !== undefined) {
    payload.sort_order = nextSortOrder;
  } else if (item.sort_order !== undefined) {
    payload.sort_order = Number(item.sort_order) || 1;
  }

  return payload;
}

/**
 * Fetch all jobs from Supabase `jobs` table ordered by `sort_order` or `created_at`
 */
export async function getJobs() {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      return data.map(mapJobFromDb);
    }
  } catch (err) {
    console.warn("[getJobs] sort_order query failed, falling back to created_at:", err);
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getJobs] Supabase error:", error);
    throw error;
  }

  return (data || []).map(mapJobFromDb);
}

/**
 * Insert a new job into Supabase `jobs` table with sort_order = max(sort_order) + 1
 */
export async function createJob(itemData) {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  // Compute next sort order = max(sort_order) + 1
  let nextSortOrder = 1;
  try {
    const { data: maxRow, error: maxErr } = await supabase
      .from("jobs")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!maxErr && maxRow && typeof maxRow.sort_order === "number") {
      nextSortOrder = maxRow.sort_order + 1;
    }
  } catch {
    // ignore
  }

  const payload = mapJobToDb(itemData, nextSortOrder);

  const { data, error } = await supabase
    .from("jobs")
    .insert([payload])
    .select("*")
    .single();

  if (error) {
    console.error("[createJob] Supabase error:", error);
    throw error;
  }

  return mapJobFromDb(data);
}

/**
 * Update an existing job in Supabase `jobs` table
 */
export async function updateJob(id, itemData) {
  if (!supabase) throw new Error("Supabase client is not initialized.");
  if (!id) throw new Error("Job ID is required for update.");

  const payload = mapJobToDb(itemData);

  const { data, error } = await supabase
    .from("jobs")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[updateJob] Supabase error:", error);
    throw error;
  }

  return mapJobFromDb(data);
}

/**
 * Delete a job by ID from Supabase `jobs` table
 */
export async function deleteJob(id) {
  if (!supabase) throw new Error("Supabase client is not initialized.");
  if (!id) throw new Error("Job ID is required for deletion.");

  const { error } = await supabase.from("jobs").delete().eq("id", id);

  if (error) {
    console.error("[deleteJob] Supabase error:", error);
    throw error;
  }

  return true;
}

