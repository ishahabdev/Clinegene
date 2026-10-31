import { supabase } from "../../lib/supabase.js";

export function slugify(text) {
  return (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

/**
 * Map blog_posts row from Supabase to unified article object
 */
export function mapBlogFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    type: "blog",
    title: row.title || "",
    slug: row.slug || "",
    category: row.category || "Genomics & Sequencing",
    excerpt: row.excerpt || "",
    content: row.content || "",
    image: row.image_url || "",
    image_url: row.image_url || "",
    imageAlt: row.image_alt || row.title || "",
    date: row.publish_date ? String(row.publish_date) : "",
    publish_date: row.publish_date ? String(row.publish_date) : "",
    author: row.author || "",
    tags: row.tags || "",
    status: row.status && row.status.toLowerCase() === "draft" ? "Draft" : "Published",
    created_at: row.created_at,
  };
}

/**
 * Map news_posts row from Supabase to unified article object
 */
export function mapNewsFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    type: "news",
    title: row.title || "",
    slug: row.slug || "",
    category: row.category || "Press Release",
    excerpt: row.excerpt || "",
    content: row.content || "",
    image: row.image_url || "",
    image_url: row.image_url || "",
    imageAlt: row.image_alt || row.title || "",
    date: row.publish_date ? String(row.publish_date) : "",
    publish_date: row.publish_date ? String(row.publish_date) : "",
    source: row.source || "",
    eventDate: row.event_date ? String(row.event_date) : "",
    status: row.status && row.status.toLowerCase() === "draft" ? "Draft" : "Published",
    created_at: row.created_at,
  };
}

export const STATIC_ARTICLE_SLUGS = new Set([
  "clinical-exome-launch-islamabad",
  "world-dna-day-symposium",
  "cardiomyopathy-variants-study",
  "pakgen-af-population-atlas",
  "crop-pangenomics-platform",
  "ngs-bioinformatics-workshop",
]);

export const STATIC_ARTICLE_TITLES = new Set([
  "ClinGene Launches Advanced Clinical Exome Sequencing in Islamabad",
  "Celebrating World DNA Day: Advancing Precision Genomics in Pakistan",
  "Novel Pathogenic Variants Identified in Hereditary Cardiomyopathies",
  "Building the Pakistani Population Allele Frequency Atlas (PakGen-AF)",
  "Comprehensive Horticultural & Crop Pangenomics Platform Unveiled",
  "Practical Next-Generation Sequencing & Bioinformatics Training Workshop",
]);

export function isStaticArticle(article) {
  if (!article) return false;
  if (article.slug && STATIC_ARTICLE_SLUGS.has(article.slug)) return true;
  if (article.title && STATIC_ARTICLE_TITLES.has(article.title)) return true;
  return false;
}

/**
 * Fetch all articles (blogs and news) strictly from Supabase.
 * Returns empty array if none exist (no static mock fallback).
 */
export async function getArticles() {
  if (!supabase) return [];

  let blogs = [];
  let news = [];

  try {
    const [blogsRes, newsRes] = await Promise.all([
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
      supabase.from("news_posts").select("*").order("created_at", { ascending: false }),
    ]);

    if (!blogsRes.error && blogsRes.data && Array.isArray(blogsRes.data)) {
      blogs = blogsRes.data.map(mapBlogFromDb);
    }
    if (!newsRes.error && newsRes.data && Array.isArray(newsRes.data)) {
      news = newsRes.data.map(mapNewsFromDb);
    }
  } catch (err) {
    console.warn("[getArticles] Failed to fetch from Supabase:", err);
    return [];
  }

  // Filter out any static demo / mock articles
  const userArticles = [...blogs, ...news].filter((a) => !isStaticArticle(a));

  // Purge any static demo rows from Supabase in the background
  try {
    const staticSlugs = Array.from(STATIC_ARTICLE_SLUGS);
    supabase.from("blog_posts").delete().in("slug", staticSlugs).then();
    supabase.from("news_posts").delete().in("slug", staticSlugs).then();
  } catch (_) {}

  userArticles.sort((a, b) => {
    const dateA = new Date(a.date || a.created_at || 0).getTime();
    const dateB = new Date(b.date || b.created_at || 0).getTime();
    return dateB - dateA;
  });

  return userArticles;
}

/**
 * Create an article in Supabase (routes to blog_posts or news_posts based on `type`)
 */
export async function createArticle(itemData) {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  const isNews = itemData.type === "news";
  const targetTable = isNews ? "news_posts" : "blog_posts";
  const statusStr = (itemData.status || "Published").toLowerCase() === "draft" ? "draft" : "published";

  let slug = itemData.slug ? slugify(itemData.slug) : slugify(itemData.title);
  if (!slug) slug = `post-${Date.now()}`;

  slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;

  let dateVal = itemData.date || itemData.publish_date || new Date().toISOString().split("T")[0];
  if (/^[A-Za-z]+ \d+, \d{4}$/.test(dateVal)) {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      dateVal = d.toISOString().split("T")[0];
    }
  }

  const payload = {
    title: (itemData.title || "").trim(),
    slug,
    category: itemData.category || (isNews ? "Press Release" : "Genomics & Sequencing"),
    excerpt: (itemData.excerpt || "").trim() || null,
    content: (itemData.content || "").trim() || null,
    image_url: itemData.image || itemData.image_url || null,
    image_alt: itemData.imageAlt || itemData.image_alt || itemData.title || null,
    publish_date: dateVal,
    status: statusStr,
  };

  if (isNews) {
    payload.source = (itemData.source || "ClinGene Press Office").trim();
    payload.event_date = itemData.eventDate || dateVal;
  } else {
    payload.author = (itemData.author || "Dr. Amjad Ali Tanoli Ph.D").trim();
    payload.tags = typeof itemData.tags === "string" ? itemData.tags.trim() : (itemData.tags || []).join(", ");
  }

  const { data, error } = await supabase
    .from(targetTable)
    .insert([payload])
    .select("*")
    .single();

  if (error) {
    console.error(`[createArticle] Failed to insert into ${targetTable}:`, error);
    throw error;
  }

  return isNews ? mapNewsFromDb(data) : mapBlogFromDb(data);
}

/**
 * Update an article in Supabase
 */
export async function updateArticle(id, itemData) {
  if (!supabase) throw new Error("Supabase client is not initialized.");
  if (!id) throw new Error("Article ID is required for update.");

  const isNews = itemData.type === "news";
  const targetTable = isNews ? "news_posts" : "blog_posts";
  const statusStr = (itemData.status || "Published").toLowerCase() === "draft" ? "draft" : "published";

  let dateVal = itemData.date || itemData.publish_date;
  if (dateVal && /^[A-Za-z]+ \d+, \d{4}$/.test(dateVal)) {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      dateVal = d.toISOString().split("T")[0];
    }
  }

  const payload = {
    title: (itemData.title || "").trim(),
    category: itemData.category,
    excerpt: (itemData.excerpt || "").trim() || null,
    content: (itemData.content || "").trim() || null,
    image_url: itemData.image || itemData.image_url || null,
    image_alt: itemData.imageAlt || itemData.image_alt || itemData.title || null,
    publish_date: dateVal,
    status: statusStr,
  };

  if (isNews) {
    payload.source = (itemData.source || "ClinGene Press Office").trim();
    payload.event_date = itemData.eventDate || dateVal;
  } else {
    payload.author = (itemData.author || "Dr. Amjad Ali Tanoli Ph.D").trim();
    payload.tags = typeof itemData.tags === "string" ? itemData.tags.trim() : (itemData.tags || []).join(", ");
  }

  const { data, error } = await supabase
    .from(targetTable)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error(`[updateArticle] Failed to update ${targetTable}:`, error);
    throw error;
  }

  return isNews ? mapNewsFromDb(data) : mapBlogFromDb(data);
}

/**
 * Delete an article by ID from Supabase
 */
export async function deleteArticle(id, type) {
  if (!supabase || !id) return true;

  if (type === "blog") {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) throw error;
    return true;
  } else if (type === "news") {
    const { error } = await supabase.from("news_posts").delete().eq("id", id);
    if (error) throw error;
    return true;
  }

  // If type wasn't provided, attempt deleting from both
  await Promise.allSettled([
    supabase.from("blog_posts").delete().eq("id", id),
    supabase.from("news_posts").delete().eq("id", id),
  ]);

  return true;
}
