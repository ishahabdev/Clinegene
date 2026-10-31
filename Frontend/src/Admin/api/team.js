import { supabase } from "../../lib/supabase.js";
import { processAndOptimizeImage } from "../../lib/imageOptimizer.js";

/**
 * Uploads a team image to Supabase Storage bucket 'images' at path team/<uuid>.webp
 * - Rejects files > 10 MB upfront.
 * - Resizes image in-browser (max 1600px on the longest side).
 * - Converts to WebP format (~0.8 quality).
 * - If still > 2 MB, iteratively lowers quality until <= 2 MB or throws a clear error.
 * - Returns public URL and formatted final size.
 */
export async function uploadTeamImage(file) {
  if (!file) throw new Error("No file selected.");

  // Requirement 2b: Browser resize (max 1600px), WebP conversion (~0.8), 10MB reject, iterative 2MB enforcement
  const { file: optimizedFile, sizeFormatted, dimensions } = await processAndOptimizeImage(file);

  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const uuid = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const filePath = `team/${uuid}.webp`;

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(filePath, optimizedFile, {
      contentType: "image/webp",
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Failed to upload image to Supabase Storage.");
  }

  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  return {
    publicUrl: data.publicUrl,
    sizeFormatted,
    dimensions,
  };
}

/**
 * Fetch team members from Supabase `team` table ordered by `sort_order`.
 */
export async function getTeamMembers() {
  if (!supabase) {
    throw new Error("Supabase client is not initialized. Please verify environment configuration.");
  }

  const { data, error } = await supabase
    .from("team")
    .select("id, name, role, department, qualification, email, bio, image_url, status, sort_order, created_at")
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

/**
 * Insert a new team member into the `team` table.
 */
export async function createTeamMember(memberData) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const payload = {
    name: memberData.name.trim(),
    role: memberData.role.trim(),
    department: memberData.department || null,
    qualification: memberData.qualification ? memberData.qualification.trim() : null,
    email: memberData.email ? memberData.email.trim() : null,
    bio: memberData.bio ? memberData.bio.trim() : null,
    image_url: memberData.image_url ? memberData.image_url.trim() : null,
    status: memberData.status || "published",
    sort_order: Number(memberData.sort_order) || 1,
  };

  const { data, error } = await supabase
    .from("team")
    .insert([payload])
    .select("id, name, role, department, qualification, email, bio, image_url, status, sort_order, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update an existing team member in the `team` table.
 */
export async function updateTeamMember(id, memberData) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const payload = {
    name: memberData.name.trim(),
    role: memberData.role.trim(),
    department: memberData.department || null,
    qualification: memberData.qualification ? memberData.qualification.trim() : null,
    email: memberData.email ? memberData.email.trim() : null,
    bio: memberData.bio ? memberData.bio.trim() : null,
    image_url: memberData.image_url ? memberData.image_url.trim() : null,
    status: memberData.status || "published",
    sort_order: Number(memberData.sort_order) || 1,
  };

  const { data, error } = await supabase
    .from("team")
    .update(payload)
    .eq("id", id)
    .select("id, name, role, department, qualification, email, bio, image_url, status, sort_order, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Delete a team member by id from the `team` table.
 */
export async function deleteTeamMember(id) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const { error } = await supabase
    .from("team")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return { success: true, id };
}

/**
 * Update sort_order for reordered team members.
 */
export async function reorderTeamMembers(reorderedList) {
  if (!supabase) {
    throw new Error("Supabase client is not initialized.");
  }

  const updates = reorderedList.map((m, index) =>
    supabase
      .from("team")
      .update({ sort_order: index + 1 })
      .eq("id", m.id)
  );

  await Promise.all(updates);
  return reorderedList.map((m, index) => ({ ...m, sort_order: index + 1 }));
}
