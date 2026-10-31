import { supabase } from "../../lib/supabase.js";
import { processAndOptimizeImage } from "../../lib/imageOptimizer.js";

/**
 * Map database row from `research` table to Admin & frontend research model
 */
export function mapResearchFromDb(row) {
  if (!row) return null;

  return {
    id: row.id,
    title: row.title || "",
    subtitle: row.subtitle || "",
    leadInvestigator: row.lead_investigator || "",
    category: row.category || "Genomics",
    type: row.research_type || row.type || "Research Project",
    status: row.research_status || row.status || "Ongoing",
    date: row.research_date ? String(row.research_date) : "",
    journal: row.journal || "",
    doi: row.doi || "",
    keywords: Array.isArray(row.keywords)
      ? row.keywords
      : typeof row.keywords === "string"
      ? row.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [],
    summary: row.abstract || row.summary || "",
    abstract: row.abstract || row.summary || "",
    image: row.image_url || "",
    image_url: row.image_url || "",
    publicationStatus: row.status || "published",
    sort_order: row.sort_order ?? 1,
    created_at: row.created_at,
  };
}

/**
 * Map Admin form data to database row for `research` table
 */
export function mapResearchToDb(item, nextSortOrder) {
  const keywordsArray = Array.isArray(item.keywords)
    ? item.keywords
    : typeof item.keywords === "string"
    ? item.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [];

  const payload = {
    title: (item.title || "").trim(),
    subtitle: (item.subtitle || "").trim() || null,
    lead_investigator: (item.leadInvestigator || item.lead_investigator || "").trim() || null,
    category: (item.category || "Genomics").trim(),
    research_type: (item.type || item.research_type || "Research Project").trim(),
    research_status: (item.status || item.research_status || "Ongoing").trim(),
    research_date: item.date ? String(item.date).trim() : null,
    journal: (item.journal || "").trim() || null,
    doi: (item.doi || "").trim() || null,
    keywords: keywordsArray,
    abstract: (item.summary || item.abstract || "").trim() || null,
    image_url: item.image || item.image_url || null,
    status: item.publicationStatus || "published",
  };

  if (nextSortOrder !== undefined) {
    payload.sort_order = nextSortOrder;
  } else if (item.sort_order !== undefined) {
    payload.sort_order = Number(item.sort_order) || 1;
  }

  return payload;
}

/**
 * Fetch all research entries strictly from Supabase `research` table.
 * Returns empty array if none exist (no static mock fallback).
 */
export async function getResearchList() {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("research")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn("[getResearchList] Supabase query error:", error.message);
      return [];
    }

    return (data || []).map(mapResearchFromDb);
  } catch (err) {
    console.error("[getResearchList] Exception:", err);
    return [];
  }
}

/**
 * Insert a new research entry into Supabase `research` table
 */
export async function createResearch(itemData) {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  let nextSortOrder = 1;
  try {
    const { data: maxRow } = await supabase
      .from("research")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (maxRow && typeof maxRow.sort_order === "number") {
      nextSortOrder = maxRow.sort_order + 1;
    }
  } catch {
    // ignore
  }

  const payload = mapResearchToDb(itemData, nextSortOrder);

  const { data, error } = await supabase
    .from("research")
    .insert([payload])
    .select("*")
    .single();

  if (error) {
    console.error("[createResearch] Supabase insert error:", error);
    throw error;
  }

  return mapResearchFromDb(data);
}

/**
 * Update an existing research entry in Supabase `research` table
 */
export async function updateResearch(id, itemData) {
  if (!supabase) throw new Error("Supabase client is not initialized.");
  if (!id) throw new Error("Research ID is required for update.");

  const payload = mapResearchToDb(itemData);

  const { data, error } = await supabase
    .from("research")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[updateResearch] Supabase update error:", error);
    throw error;
  }

  return mapResearchFromDb(data);
}

/**
 * Delete a research entry by ID from Supabase `research` table
 */
export async function deleteResearch(id) {
  if (!supabase) throw new Error("Supabase client is not initialized.");
  if (!id) throw new Error("Research ID is required for deletion.");

  const { error } = await supabase.from("research").delete().eq("id", id);
  if (error) {
    console.error("[deleteResearch] Supabase delete error:", error);
    throw error;
  }

  return true;
}

/**
 * Upload an image file for a research project or publication
 */
export async function uploadResearchImage(file) {
  if (!file) throw new Error("No image file provided.");

  const { file: optimizedFile, blob, ext } = await processAndOptimizeImage(file);
  const uuid =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const filePath = `research/${uuid}.${ext || "webp"}`;

  if (supabase?.storage) {
    try {
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, optimizedFile || blob, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: true,
        });

      if (!uploadError) {
        const { data } = supabase.storage.from("images").getPublicUrl(filePath);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }
    } catch {
      // ignore
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to encode compressed image to data URL"));
    reader.readAsDataURL(blob || optimizedFile);
  });
}
