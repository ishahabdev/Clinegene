import { supabase } from "../../lib/supabase.js";
import { processAndOptimizeImage } from "../../lib/imageOptimizer.js";

/**
 * Map database row from `gallery` table to the frontend gallery model
 */
export function mapGalleryItemFromDb(row) {
  if (!row) return null;

  return {
    id: row.id,
    title: row.title || "",
    image_url: row.image_url || "",
    src: row.image_url || "",
    image_alt: row.image_alt || row.title || "",
    caption: row.caption || "",
    category: row.category || "ClinGene Genomics Lab",
    album: row.category || "ClinGene Genomics Lab",
    event_date: row.event_date ? String(row.event_date) : "",
    date: row.event_date ? String(row.event_date) : "",
    status: row.status || "published",
    sort_order: row.sort_order ?? 1,
    created_at: row.created_at,
  };
}

/**
 * Map frontend gallery model to database row for `gallery` table
 */
export function mapGalleryItemToDb(item, nextSortOrder) {
  const payload = {
    title: (item.title || "").trim(),
    image_url: (item.image_url || item.src || "").trim(),
    image_alt: (item.image_alt || item.title || "").trim(),
    caption: (item.caption || "").trim() || null,
    category: (item.category || item.album || "ClinGene Genomics Lab").trim(),
    event_date: item.event_date ? String(item.event_date).trim() : null,
    status: item.status || "published",
  };

  if (nextSortOrder !== undefined) {
    payload.sort_order = nextSortOrder;
  } else if (item.sort_order !== undefined) {
    payload.sort_order = Number(item.sort_order) || 1;
  }

  return payload;
}

/**
 * Fetch all gallery items from Supabase `gallery` table ordered by `sort_order` ascending
 */
export async function getGalleryItems() {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  const { data, error } = await supabase
    .from("gallery")
    .select("id, title, image_url, image_alt, caption, category, event_date, status, sort_order, created_at")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getGalleryItems] Supabase error:", error);
    throw error;
  }

  return (data || []).map(mapGalleryItemFromDb);
}

/**
 * Insert a new gallery item into Supabase `gallery` table with sort_order = max(sort_order) + 1
 */
export async function createGalleryItem(itemData) {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  // Compute next sort order = max(sort_order) + 1
  let nextSortOrder = 1;
  const { data: maxRow, error: maxErr } = await supabase
    .from("gallery")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!maxErr && maxRow && typeof maxRow.sort_order === "number") {
    nextSortOrder = maxRow.sort_order + 1;
  }

  const payload = mapGalleryItemToDb(itemData, nextSortOrder);

  const { data, error } = await supabase
    .from("gallery")
    .insert([payload])
    .select("id, title, image_url, image_alt, caption, category, event_date, status, sort_order, created_at")
    .single();

  if (error) {
    console.error("[createGalleryItem] Supabase error:", error);
    throw error;
  }

  return mapGalleryItemFromDb(data);
}

/**
 * Insert multiple gallery items into Supabase `gallery` table
 */
export async function createMultipleGalleryItems(items) {
  if (!supabase) throw new Error("Supabase client is not initialized.");
  if (!Array.isArray(items) || items.length === 0) return [];

  let nextSortOrder = 1;
  const { data: maxRow } = await supabase
    .from("gallery")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (maxRow && typeof maxRow.sort_order === "number") {
    nextSortOrder = maxRow.sort_order + 1;
  }

  const payloads = items.map((item, idx) => mapGalleryItemToDb(item, nextSortOrder + idx));

  const { data, error } = await supabase
    .from("gallery")
    .insert(payloads)
    .select("id, title, image_url, image_alt, caption, category, event_date, status, sort_order, created_at");

  if (error) {
    console.error("[createMultipleGalleryItems] Supabase error:", error);
    throw error;
  }

  return (data || []).map(mapGalleryItemFromDb);
}

/**
 * Update an existing gallery item in Supabase `gallery` table
 */
export async function updateGalleryItem(id, itemData) {
  if (!supabase) throw new Error("Supabase client is not initialized.");
  if (!id) throw new Error("Gallery item ID is required for update.");

  const payload = mapGalleryItemToDb(itemData);

  const { data, error } = await supabase
    .from("gallery")
    .update(payload)
    .eq("id", id)
    .select("id, title, image_url, image_alt, caption, category, event_date, status, sort_order, created_at")
    .single();

  if (error) {
    console.error("[updateGalleryItem] Supabase error:", error);
    throw error;
  }

  return mapGalleryItemFromDb(data);
}

/**
 * Delete a gallery item from Supabase `gallery` table
 */
export async function deleteGalleryItem(id) {
  if (!supabase) throw new Error("Supabase client is not initialized.");
  if (!id) throw new Error("Gallery item ID is required for delete.");

  const { error } = await supabase
    .from("gallery")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[deleteGalleryItem] Supabase error:", error);
    throw error;
  }

  return true;
}

/**
 * Upload an image file to Supabase storage bucket `images` under `gallery/`
 * If Supabase storage fails or is blocked by bucket policy, falls back to optimized WebP data URL.
 */
export async function uploadGalleryImage(file) {
  if (!file) throw new Error("No image file provided.");

  // Resize to max 1600px and compress to WebP under 2MB
  const { file: optimizedFile, blob, ext } = await processAndOptimizeImage(file);
  const uuid =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const filePath = `gallery/${uuid}.${ext || "webp"}`;

  // 1. Try uploading to Supabase Storage bucket 'images'
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
      } else {
        console.warn("[uploadGalleryImage] Storage upload warning:", uploadError.message);
      }
    } catch (storageErr) {
      console.warn("[uploadGalleryImage] Storage upload exception:", storageErr);
    }
  }

  // 2. Fallback: Convert optimized WebP blob to Base64 data URL
  // Since processAndOptimizeImage guarantees the WebP blob is well under 2MB,
  // this fits directly into the Postgres TEXT column and renders immediately.
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to encode compressed image to data URL"));
    reader.readAsDataURL(blob || optimizedFile);
  });
}

