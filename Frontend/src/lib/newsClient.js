import { supabase } from "./supabase.js";
import {
  mapBlogFromDb,
  mapNewsFromDb,
  isStaticArticle,
} from "../Admin/api/articles.js";

/**
 * Fetch all published articles (both blogs and news) strictly from Supabase.
 * Returns only live database items (NO static mock fallback).
 */
export async function fetchPublishedArticles() {
  if (!supabase) return [];

  let blogs = [];
  let news = [];

  try {
    const [blogsRes, newsRes] = await Promise.all([
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("news_posts").select("*").order("created_at", { ascending: false }),
    ]);

    if (!blogsRes.error && blogsRes.data && Array.isArray(blogsRes.data)) {
      blogs = blogsRes.data
        .filter((row) => !row.status || String(row.status).toLowerCase() !== "draft")
        .map(mapBlogFromDb);
    }
    if (!newsRes.error && newsRes.data && Array.isArray(newsRes.data)) {
      news = newsRes.data
        .filter((row) => !row.status || String(row.status).toLowerCase() !== "draft")
        .map(mapNewsFromDb);
    }
  } catch (err) {
    console.warn("[fetchPublishedArticles] Exception querying Supabase:", err);
    return [];
  }

  const combined = [...blogs, ...news].filter((a) => !isStaticArticle(a));
  combined.sort((a, b) => {
    const dateA = new Date(a.date || a.created_at || 0).getTime();
    const dateB = new Date(b.date || b.created_at || 0).getTime();
    return dateB - dateA;
  });

  return combined;
}
