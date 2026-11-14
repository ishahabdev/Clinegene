import { supabase } from "../../lib/supabase.js";

const STORAGE_BUCKET = "sub-service-images";
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

/**
 * @typedef {"fixed" | "starting_from" | "on_request"} SubServicePriceType
 * @typedef {Object} SubService
 * @property {string} id
 * @property {string} service_id
 * @property {string} name
 * @property {string | null} slug
 * @property {string | null} description
 * @property {number | null} price
 * @property {SubServicePriceType} price_type
 * @property {string | null} duration
 * @property {string | null} image_url
 * @property {boolean} is_active
 * @property {number} sort_order
 * @property {string} created_at
 * @property {string} updated_at
 */

function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Check the environment variables.");
  }
  return supabase;
}

export function slugifySubService(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getFriendlyError(error) {
  if (error?.code === "23505") {
    return Object.assign(
      new Error("A sub-service with this name or URL slug already exists for the selected service."),
      { code: error.code, details: error.details, hint: error.hint }
    );
  }
  return error;
}

function getStoragePath(imageUrl) {
  if (!imageUrl) return null;
  try {
    const url = new URL(imageUrl);
    const marker = `/object/public/${STORAGE_BUCKET}/`;
    const signedMarker = `/object/sign/${STORAGE_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);
    const signedIndex = url.pathname.indexOf(signedMarker);
    const index =
      markerIndex >= 0
        ? markerIndex + marker.length
        : signedIndex >= 0
          ? signedIndex + signedMarker.length
          : -1;
    if (index < 0) return null;
    return decodeURIComponent(url.pathname.slice(index));
  } catch {
    return null;
  }
}

async function removeStoredImage(imageUrl) {
  return removeSubServiceImages([imageUrl]);
}

export async function removeSubServiceImages(imageUrls) {
  const paths = [
    ...new Set(
      imageUrls.filter(Boolean).map((imageUrl) => {
        const path = getStoragePath(imageUrl);
        if (!path) {
          throw new Error("A stored image URL does not belong to the sub-service images bucket.");
        }
        return path;
      })
    ),
  ];
  if (paths.length === 0) return;
  const { error } = await requireSupabase().storage.from(STORAGE_BUCKET).remove(paths);
  if (error) throw error;
}

export function validateSubServiceImage(file) {
  if (!file) return;
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Choose a JPG, PNG, or WebP image.");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("The image must be 2 MB or smaller.");
  }
}

export async function uploadSubServiceImage(file) {
  validateSubServiceImage(file);
  const client = requireSupabase();
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();
  if (userError) throw userError;
  if (!user?.id) throw new Error("Sign in as an admin before uploading an image.");

  const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage.from(STORAGE_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function getSubServiceServices() {
  const { data, error } = await requireSupabase()
    .from("services")
    .select("id, title")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getSubServices({
  page = 1,
  pageSize = 10,
  search = "",
  serviceId = "",
} = {}) {
  let query = requireSupabase()
    .from("sub_services")
    .select(
      "id, service_id, name, slug, description, price, price_type, duration, image_url, is_active, sort_order, created_at, updated_at, services(id, title)",
      { count: "exact" }
    )
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (serviceId) query = query.eq("service_id", serviceId);
  if (search.trim()) {
    const escapedSearch = search.trim().replace(/[\\%_]/g, "\\$&");
    query = query.ilike("name", `%${escapedSearch}%`);
  }

  const from = (page - 1) * pageSize;
  const { data, error, count } = await query.range(from, from + pageSize - 1);
  if (error) throw error;
  return { items: data || [], count: count || 0 };
}

export async function getActiveSubServicesForService(serviceId) {
  const { data, error } = await requireSupabase()
    .from("sub_services")
    .select("*")
    .eq("service_id", serviceId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function saveSubService({
  id,
  service_id,
  name,
  slug,
  description,
  price,
  price_type,
  duration,
  image_url,
  imageFile,
  clearImage = false,
  is_active,
  sort_order,
}) {
  const client = requireSupabase();
  const cleanName = name.trim();
  if (!service_id) throw new Error("Select a parent service.");
  if (!cleanName) throw new Error("Enter a sub-service name.");
  if (price !== "" && price != null && (!Number.isFinite(Number(price)) || Number(price) < 0)) {
    throw new Error("Enter a valid non-negative price.");
  }
  if (imageFile) validateSubServiceImage(imageFile);

  const generatedSlug = slugifySubService(slug || cleanName);
  const uploaded = imageFile ? await uploadSubServiceImage(imageFile) : null;
  const nextImageUrl = uploaded?.publicUrl || (clearImage ? null : image_url || null);
  const payload = {
    service_id,
    name: cleanName,
    slug: generatedSlug || null,
    description: description.trim() || null,
    price: price === "" || price == null ? null : Number(price),
    price_type,
    duration: duration.trim() || null,
    image_url: nextImageUrl,
    is_active: Boolean(is_active),
    sort_order: Number.isInteger(Number(sort_order)) ? Number(sort_order) : 0,
  };

  let uploadedImageCleanupFailed = false;
  try {
    const request = id
      ? client.from("sub_services").update(payload).eq("id", id)
      : client.from("sub_services").insert(payload);
    const { data, error } = await request.select("*").single();
    if (error) throw error;

    let cleanupWarning = "";
    if (image_url && image_url !== nextImageUrl) {
      try {
        await removeStoredImage(image_url);
      } catch (cleanupError) {
        console.error("[SubServices] Failed to remove replaced image:", cleanupError);
        cleanupWarning = "The sub-service was saved, but its previous image could not be removed.";
      }
    }

    return { ...data, cleanupWarning };
  } catch (error) {
    if (uploaded) {
      try {
        await removeStoredImage(uploaded.publicUrl);
      } catch (cleanupError) {
        console.error("[SubServices] Failed to clean up an unused uploaded image:", cleanupError);
        uploadedImageCleanupFailed = true;
      }
    }
    const friendlyError = getFriendlyError(error);
    if (uploadedImageCleanupFailed) {
      friendlyError.message = `${friendlyError.message} The uploaded image also could not be cleaned up.`;
    }
    throw friendlyError;
  }
}

export async function setSubServiceActive(id, isActive) {
  const { data, error } = await requireSupabase()
    .from("sub_services")
    .update({ is_active: isActive })
    .eq("id", id)
    .select("id, is_active")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSubService(subService) {
  const { error } = await requireSupabase()
    .from("sub_services")
    .delete()
    .eq("id", subService.id);
  if (error) throw error;

  if (subService.image_url) {
    try {
      await removeStoredImage(subService.image_url);
    } catch (cleanupError) {
      console.error("[SubServices] Failed to remove deleted sub-service image:", cleanupError);
      return {
        cleanupWarning: "The sub-service was deleted, but its image could not be removed.",
      };
    }
  }
  return { cleanupWarning: "" };
}
