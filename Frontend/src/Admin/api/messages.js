import { supabase } from "../../lib/supabase.js";

/**
 * Fetch messages with server-side pagination and search
 * @param {Object} params
 * @param {number} params.page - 1-based page number
 * @param {number} params.pageSize - Number of items per page
 * @param {string} params.search - Search term (name or email)
 * @param {string} params.status - "all" | "unread" | "read"
 */
export async function getMessages({
  page = 1,
  pageSize = 10,
  search = "",
  status = "all",
} = {}) {
  if (!supabase) {
    return { data: [], count: 0, error: new Error("Supabase client not configured") };
  }

  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("contact_messages")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    // Status filter
    if (status === "unread") {
      query = query.eq("is_read", false);
    } else if (status === "read") {
      query = query.eq("is_read", true);
    }

    // Search filter across name and email
    const trimmedSearch = (search || "").trim();
    if (trimmedSearch) {
      query = query.or(
        `name.ilike.%${trimmedSearch}%,email.ilike.%${trimmedSearch}%,subject.ilike.%${trimmedSearch}%`
      );
    }

    const { data, count, error } = await query;

    if (error) {
      console.error("[getMessages] Error querying contact_messages:", error);
      return { data: [], count: 0, error };
    }

    return { data: data || [], count: count || 0, error: null };
  } catch (err) {
    console.error("[getMessages] Exception:", err);
    return { data: [], count: 0, error: err };
  }
}

/**
 * Get total unread messages count for badges
 */
export async function getUnreadCount() {
  if (!supabase) return { count: 0, error: null };

  try {
    const { count, error } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);

    if (error) {
      console.warn("[getUnreadCount] Error querying count:", error.message);
      return { count: 0, error };
    }

    return { count: count || 0, error: null };
  } catch (err) {
    console.warn("[getUnreadCount] Exception:", err);
    return { count: 0, error: err };
  }
}

/**
 * Mark a message as read or unread
 */
export async function markMessageReadStatus(id, is_read) {
  if (!supabase) throw new Error("Supabase client not configured");

  const { data, error } = await supabase
    .from("contact_messages")
    .update({ is_read })
    .eq("id", id);

  if (error) {
    console.error("[markMessageReadStatus] Error updating message:", error);
    throw error;
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("messages:updated"));
  }

  return data;
}

/**
 * Delete a message by ID
 */
export async function deleteMessage(id) {
  if (!supabase) throw new Error("Supabase client not configured");

  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[deleteMessage] Error deleting message:", error);
    throw error;
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("messages:updated"));
  }

  return true;
}

