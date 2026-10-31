import { supabase } from "../../lib/supabase.js";
import { processAndOptimizeImage } from "../../lib/imageOptimizer.js";

/**
 * Generate URL-friendly slug from text
 */
export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

/**
 * Map database row from `services` table to the frontend service model
 */
export function mapServiceFromDb(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.title || "",
    title: row.title || "",
    slug: row.slug || "",
    subtitle: row.subtitle || "",
    tagline: row.subtitle || "",
    category: row.category || "Clinical Diagnostics",
    type: row.service_type || "lab",
    service_type: row.service_type || "lab",
    pricing: row.pricing_display || "On request",
    pricing_display: row.pricing_display || "On request",
    description: row.short_description || row.overview || "",
    short_description: row.short_description || "",
    overview: row.overview || "",
    overviewText: row.overview || "",
    features: row.features || [],
    featuresText: Array.isArray(row.features)
      ? row.features.join("\n")
      : row.features || "",
    icon: (row.icon || "dna").toLowerCase(),
    image: row.image_url || "",
    image_url: row.image_url || "",
    sampleType: row.sample_type || "",
    sample_type: row.sample_type || "",
    turnaroundTime: row.turnaround_time || "",
    turnaround_time: row.turnaround_time || "",
    reportFormat: row.report_format || "",
    report_format: row.report_format || "",
    requisitionPdf: row.requisition_form_url || null,
    requisition_form_url: row.requisition_form_url || null,
    status:
      row.status?.toLowerCase() === "published" || row.status === "Active"
        ? "Active"
        : "Inactive",
    db_status: row.status || "published",
    sort_order: row.sort_order ?? 1,
    createdAt: row.created_at,
    created_at: row.created_at,
  };
}

/**
 * Map frontend service model to database row for `services` table
 */
export function mapServiceToDb(data, nextSortOrder) {
  const title = (data.name || data.title || "").trim();
  let slug = (data.slug || "").trim();
  if (!slug && title) {
    slug = slugify(title);
  }

  // Parse features list
  let features = [];
  if (Array.isArray(data.features)) {
    features = data.features;
  } else if (typeof data.featuresText === "string") {
    features = data.featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
  } else if (typeof data.features === "string") {
    features = data.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
  }

  // Parse overview text
  let overview = "";
  if (typeof data.overviewText === "string") {
    overview = data.overviewText.trim();
  } else if (Array.isArray(data.overview)) {
    overview = data.overview.join("\n\n");
  } else if (typeof data.overview === "string") {
    overview = data.overview.trim();
  }

  const short_description = (
    data.description ||
    data.short_description ||
    data.tagline ||
    data.subtitle ||
    ""
  ).trim();

  // Status mapping: Active -> published, Inactive/draft -> draft
  const status =
    data.status === "Inactive" || data.status === "draft"
      ? "draft"
      : "published";

  const payload = {
    title,
    slug,
    subtitle: (data.subtitle || data.tagline || "").trim() || null,
    category: data.category || "Clinical Diagnostics",
    service_type: data.type || data.service_type || "lab",
    pricing_display: data.pricing || data.pricing_display || null,
    short_description: short_description || null,
    overview: overview || null,
    features: features.length > 0 ? features : null,
    icon: (data.icon || "dna").toLowerCase(),
    image_url: data.image || data.image_url || null,
    sample_type: (data.sampleType || data.sample_type || "").trim() || null,
    turnaround_time:
      (data.turnaroundTime || data.turnaround_time || "").trim() || null,
    report_format:
      (data.reportFormat || data.report_format || "").trim() || null,
    requisition_form_url:
      typeof data.requisitionPdf === "string"
        ? data.requisitionPdf
        : data.requisitionPdf?.url || data.requisition_form_url || null,
    status,
  };

  if (nextSortOrder !== undefined) {
    payload.sort_order = nextSortOrder;
  }

  return payload;
}

/**
 * Fetch all services from Supabase `services` table ordered by `sort_order`
 */
export async function getServices() {
  if (!supabase) {
    throw new Error(
      "Supabase client is not initialized. Please check your environment variables."
    );
  }

  const { data, error } = await supabase
    .from("services")
    .select(
      "id, title, slug, subtitle, category, service_type, pricing_display, short_description, overview, features, icon, image_url, sample_type, turnaround_time, report_format, requisition_form_url, status, sort_order, created_at"
    )
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map(mapServiceFromDb);
}

/**
 * Fetch a single service by ID
 */
export async function getServiceById(id) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { data, error } = await supabase
    .from("services")
    .select(
      "id, title, slug, subtitle, category, service_type, pricing_display, short_description, overview, features, icon, image_url, sample_type, turnaround_time, report_format, requisition_form_url, status, sort_order, created_at"
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return mapServiceFromDb(data);
}

/**
 * Create a new service in Supabase
 * Sets sort_order to max(sort_order) + 1 and auto-generates slug from title if not set
 */
export async function createService(serviceData) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  // Find max(sort_order)
  let nextSortOrder = 1;
  const { data: maxRow, error: maxErr } = await supabase
    .from("services")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!maxErr && maxRow && typeof maxRow.sort_order === "number") {
    nextSortOrder = maxRow.sort_order + 1;
  }

  const payload = mapServiceToDb(serviceData, nextSortOrder);

  const { data, error } = await supabase
    .from("services")
    .insert([payload])
    .select(
      "id, title, slug, subtitle, category, service_type, pricing_display, short_description, overview, features, icon, image_url, sample_type, turnaround_time, report_format, requisition_form_url, status, sort_order, created_at"
    )
    .single();

  if (error) {
    throw error;
  }

  return mapServiceFromDb(data);
}

/**
 * Update an existing service in Supabase
 */
export async function updateService(id, serviceData) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const payload = mapServiceToDb(serviceData);

  if (serviceData.sort_order !== undefined) {
    payload.sort_order = Number(serviceData.sort_order) || 1;
  }

  const { data, error } = await supabase
    .from("services")
    .update(payload)
    .eq("id", id)
    .select(
      "id, title, slug, subtitle, category, service_type, pricing_display, short_description, overview, features, icon, image_url, sample_type, turnaround_time, report_format, requisition_form_url, status, sort_order, created_at"
    )
    .single();

  if (error) {
    throw error;
  }

  return mapServiceFromDb(data);
}

/**
 * Delete a service from Supabase
 */
export async function deleteService(id) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return { success: true, id };
}

/**
 * Uploads a service image to Supabase Storage bucket 'images' at path services/<uuid>.webp
 */
export async function uploadServiceImage(file) {
  if (!file) throw new Error("No file selected.");

  const { file: optimizedFile, sizeFormatted, dimensions } =
    await processAndOptimizeImage(file);

  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const uuid =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const filePath = `services/${uuid}.webp`;

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(filePath, optimizedFile, {
      contentType: "image/webp",
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(
      uploadError.message || "Failed to upload image to Supabase Storage."
    );
  }

  const { data } = supabase.storage.from("images").getPublicUrl(filePath);

  return {
    publicUrl: data.publicUrl,
    sizeFormatted,
    dimensions,
  };
}

/**
 * Uploads a requisition PDF
 */
export async function uploadRequisitionPdf(file) {
  if (!file) throw new Error("No file selected.");
  if (!supabase) throw new Error("Supabase client is not initialized.");

  const uuid =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `requisitions/${uuid}_${sanitizedName}`;

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      contentType: file.type || "application/pdf",
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(
      uploadError.message || "Failed to upload requisition PDF."
    );
  }

  const { data } = supabase.storage.from("images").getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    name: file.name,
    size: file.size,
  };
}
