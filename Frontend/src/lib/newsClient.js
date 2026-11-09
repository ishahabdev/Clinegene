import { supabase } from "./supabase.js";
import {
  mapBlogFromDb,
  mapNewsFromDb,
  isStaticArticle,
} from "../Admin/api/articles.js";
import { getIdbItem, setIdbItem } from "./idbCache.js";

const NEWS_CACHE_KEY = "clingene_public_news_v2";
const BLOGS_CACHE_KEY = "clingene_public_blogs_v2";

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
      supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, content, image_url, image_alt, author, category, tags, read_time, published_at, created_at, status, is_featured")
        .order("created_at", { ascending: false })
        .limit(40),
      supabase
        .from("news_posts")
        .select("id, title, slug, excerpt, content, image_url, image_alt, author, category, tags, read_time, published_at, created_at, status, is_featured")
        .order("created_at", { ascending: false })
        .limit(40),
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

let inMemoryNewsCache = null;
let inMemoryBlogsCache = null;

/**
 * Downscale large base64 data URLs to ~60KB WebP client-side so they fit in localStorage and render instantly.
 */
export async function downscaleBase64Image(dataUrl, maxDim = 800, quality = 0.75) {
  if (
    typeof window === "undefined" ||
    !dataUrl ||
    typeof dataUrl !== "string" ||
    !dataUrl.startsWith("data:image/") ||
    dataUrl.length < 100000
  ) {
    return dataUrl;
  }
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        try {
          let w = img.naturalWidth || img.width;
          let h = img.naturalHeight || img.height;
          if (!w || !h) return resolve(dataUrl);
          if (w > maxDim || h > maxDim) {
            if (w >= h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(dataUrl);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "medium";
          ctx.drawImage(img, 0, 0, w, h);
          const webp = canvas.toDataURL("image/webp", quality);
          resolve(webp && webp.length < dataUrl.length ? webp : dataUrl);
        } catch (_) {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    } catch (_) {
      resolve(dataUrl);
    }
  });
}

async function optimizeItemForCache(item) {
  if (!item) return item;
  const img = item.image || item.image_url;
  if (img && typeof img === "string" && img.startsWith("data:image/") && img.length > 100000) {
    const compactImg = await downscaleBase64Image(img, 800, 0.75);
    return { ...item, image: compactImg, image_url: compactImg };
  }
  return item;
}

/**
 * Safely persist items to storage and IndexedDB.
 * Compresses oversized base64 strings so browser storage quota (5MB) is never exceeded.
 */
async function safeSetStorage(key, data) {
  if (typeof window === "undefined" || !data) return;

  // Persist to IndexedDB first (no 5MB storage quota limit)
  setIdbItem(key, data).catch(() => {});

  try {
    const json = JSON.stringify(data);
    sessionStorage.setItem(key, json);
    localStorage.setItem(key, json);
  } catch (_) {
    // If quota exceeded, ensure all items are compact and retry
    try {
      const optimized = await Promise.all(data.map(optimizeItemForCache));
      const json = JSON.stringify(optimized);
      sessionStorage.setItem(key, json);
      localStorage.setItem(key, json);
    } catch (_) {}
  }
}

/**
 * Parse articles from a raw localStorage/sessionStorage string.
 * Strictly requires real images so default logo placeholder never flashes.
 */
function parseCachedList(raw, expectedType) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const filtered = parsed
        .filter((a) => {
          if (!a || isStaticArticle(a)) return false;
          if (expectedType === "blog" && a.type && a.type !== "blog") return false;
          if (expectedType === "news" && a.type && a.type !== "news") return false;
          // Must have an image to prevent flashing the ClinGene logo fallback
          const hasImage = (a.image && a.image.trim()) || (a.image_url && a.image_url.trim());
          if (!hasImage) return false;
          return !a.status || String(a.status).toLowerCase() !== "draft";
        })
        .map((a) => ({
          ...a,
          id: a.id || a.slug,
          image: a.image || a.image_url || "",
          date: a.date || a.publish_date,
        }));
      if (filtered.length > 0) return filtered;
    }
  } catch (_) {}
  return null;
}

/**
 * Synchronous initial news getter for instant render on refresh (only if real images exist)
 */
export function getInitialCachedNews() {
  if (inMemoryNewsCache && inMemoryNewsCache.length > 0) {
    // Ensure items have images
    const hasImages = inMemoryNewsCache.some((item) => item.image || item.image_url);
    if (hasImages) return inMemoryNewsCache;
  }
  if (typeof window === "undefined") return [];

  // Clean up legacy v1 caches that had hollow images
  try {
    sessionStorage.removeItem("clingene_public_news_cache");
    localStorage.removeItem("clingene_public_news_cache");
  } catch (_) {}

  const session = parseCachedList(sessionStorage.getItem(NEWS_CACHE_KEY), "news");
  if (session) {
    inMemoryNewsCache = session;
    return session;
  }

  const local = parseCachedList(localStorage.getItem(NEWS_CACHE_KEY), "news");
  if (local) {
    inMemoryNewsCache = local;
    return local;
  }

  return [];
}

/**
 * Synchronous initial blogs getter for instant render on refresh (only if real images exist)
 */
export function getInitialCachedBlogs() {
  if (inMemoryBlogsCache && inMemoryBlogsCache.length > 0) {
    const hasImages = inMemoryBlogsCache.some((item) => item.image || item.image_url);
    if (hasImages) return inMemoryBlogsCache;
  }
  if (typeof window === "undefined") return [];

  // Clean up legacy v1 caches that had hollow images
  try {
    sessionStorage.removeItem("clingene_public_blogs_cache");
    localStorage.removeItem("clingene_public_blogs_cache");
  } catch (_) {}

  const session = parseCachedList(sessionStorage.getItem(BLOGS_CACHE_KEY), "blog");
  if (session) {
    inMemoryBlogsCache = session;
    return session;
  }

  const local = parseCachedList(localStorage.getItem(BLOGS_CACHE_KEY), "blog");
  if (local) {
    inMemoryBlogsCache = local;
    return local;
  }

  return [];
}

/**
 * Helper to merge and sort article collections with deduplication
 */
function mergeArticleLists(primaryList, fallbackList) {
  const map = new Map();
  primaryList.forEach((item) => {
    if (item && !isStaticArticle(item)) {
      map.set(item.slug || item.id, item);
    }
  });
  fallbackList.forEach((item) => {
    if (item && !isStaticArticle(item)) {
      const key = item.slug || item.id;
      if (!map.has(key)) {
        map.set(key, item);
      } else {
        const existing = map.get(key);
        if (!existing.image && item.image) {
          map.set(key, { ...existing, image: item.image, image_url: item.image });
        }
      }
    }
  });

  const list = Array.from(map.values());
  list.sort((a, b) => {
    const dateA = new Date(a.date || a.publish_date || a.created_at || 0).getTime();
    const dateB = new Date(b.date || b.publish_date || b.created_at || 0).getTime();
    return dateB - dateA;
  });
  return list;
}

/**
 * Fetch published news announcements from Supabase news_posts table directly.
 * Supabase is the single source of truth: deleted items are purged from cache immediately.
 */
export async function fetchPublishedNews() {
  let dbNews = [];
  let supabaseSuccess = false;

  if (supabase) {
    try {
      const res = await supabase
        .from("news_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (res && !res.error && Array.isArray(res.data)) {
        dbNews = res.data
          .filter((row) => !row.status || String(row.status).toLowerCase() !== "draft")
          .map(mapNewsFromDb);
        supabaseSuccess = true;
      }
    } catch (err) {
      // Fallback
    }
  }

  let finalNews = [];
  if (supabaseSuccess) {
    finalNews = dbNews.filter((a) => !isStaticArticle(a));
  } else {
    // Only fall back to local storage if Supabase query failed
    let localNews = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("clingene_admin_articles_data");
        const parsed = parseCachedList(raw, "news");
        if (parsed) localNews = parsed;
      } catch (_) {}
    }
    finalNews = localNews;
  }

  const compactList = await Promise.all(finalNews.map(optimizeItemForCache));
  inMemoryNewsCache = compactList;
  await safeSetStorage(NEWS_CACHE_KEY, compactList);

  return compactList;
}

/**
 * Fetch published blog articles from Supabase blog_posts table directly.
 * Supabase is the single source of truth: deleted items are purged from cache immediately.
 */
export async function fetchPublishedBlogs() {
  let dbBlogs = [];
  let supabaseSuccess = false;

  if (supabase) {
    try {
      const res = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (res && !res.error && Array.isArray(res.data)) {
        dbBlogs = res.data
          .filter((row) => !row.status || String(row.status).toLowerCase() !== "draft")
          .map(mapBlogFromDb);
        supabaseSuccess = true;
      }
    } catch (err) {
      // Fallback
    }
  }

  let finalBlogs = [];
  if (supabaseSuccess) {
    finalBlogs = dbBlogs.filter((a) => !isStaticArticle(a));
  } else {
    // Only fall back to local storage if Supabase query failed
    let localBlogs = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("clingene_admin_articles_data");
        const parsed = parseCachedList(raw, "blog");
        if (parsed) localBlogs = parsed;
      } catch (_) {}
    }
    finalBlogs = localBlogs;
  }

  const compactList = await Promise.all(finalBlogs.map(optimizeItemForCache));
  inMemoryBlogsCache = compactList;
  await safeSetStorage(BLOGS_CACHE_KEY, compactList);

  return compactList;
}
