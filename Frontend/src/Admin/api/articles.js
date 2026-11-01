import { supabase } from "../../lib/supabase.js";
import { processAndOptimizeImage } from "../../lib/imageOptimizer.js";
import { getIdbItem, setIdbItem } from "../../lib/idbCache.js";

/**
 * Uploads an article image to Supabase Storage bucket 'images' at path articles/<uuid>.webp
 * If unauthenticated or storage fails, safely falls back to a compact WebP DataURL.
 */
export async function uploadArticleImage(file) {
  if (!file) throw new Error("No file selected.");
  const { file: optimizedFile, sizeFormatted, dimensions, blob } = await processAndOptimizeImage(file);

  if (supabase) {
    try {
      const uuid = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const filePath = `articles/${uuid}.webp`;

      const { data, error } = await supabase.storage
        .from("images")
        .upload(filePath, optimizedFile, {
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: false,
        });

      if (!error && data) {
        const { data: pubData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);
        return {
          publicUrl: pubData.publicUrl,
          sizeFormatted,
          dimensions,
        };
      }
    } catch (_) {
      // Fallback
    }
  }

  // Fallback to compact WebP DataURL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        publicUrl: e.target.result,
        sizeFormatted,
        dimensions,
      });
    };
    reader.readAsDataURL(blob || optimizedFile);
  });
}

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
  let tagsList = [];
  if (Array.isArray(row.tags)) {
    tagsList = row.tags;
  } else if (typeof row.tags === "string" && row.tags.trim()) {
    tagsList = row.tags.split(",").map((t) => t.trim()).filter(Boolean);
  }

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
    tags: tagsList,
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
  "novel-cardiomyopathy-variants",
  "cardiomyopathy-variants-study",
  "pakistani-allele-frequency-database",
  "pakgen-af-population-atlas",
  "crop-genomics-pangenome-release",
  "crop-pangenomics-platform",
  "hands-on-ngs-workshop",
  "ngs-bioinformatics-workshop",
]);

export const STATIC_ARTICLE_TITLES = new Set([
  "clingene launches advanced clinical exome sequencing in islamabad",
  "celebrating world dna day: advancing precision genomics in pakistan",
  "novel pathogenic variants identified in hereditary cardiomyopathies",
  "building the pakistani population allele frequency atlas (pakgen-af)",
  "comprehensive horticultural & crop pangenomics platform unveiled",
  "practical next-generation sequencing & bioinformatics training workshop",
]);

export function isStaticArticle(article) {
  if (!article) return false;
  const slug = (article.slug || "").toLowerCase().trim();
  const title = (article.title || "").toLowerCase().trim();

  if (slug && STATIC_ARTICLE_SLUGS.has(slug)) return true;
  if (title && STATIC_ARTICLE_TITLES.has(title)) return true;
  return false;
}

/**
 * Fetch all articles (blogs and news) from Supabase.
 * Supabase is the single source of truth: if an article is deleted in Supabase,
 * it is removed from local cache as well.
 */
export async function getArticles() {
  let blogs = [];
  let news = [];
  let supabaseSuccess = false;

  if (supabase) {
    try {
      const [blogsRes, newsRes] = await Promise.all([
        supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
        supabase.from("news_posts").select("*").order("created_at", { ascending: false }),
      ]);

      if (!blogsRes.error && Array.isArray(blogsRes.data)) {
        blogs = blogsRes.data.map(mapBlogFromDb);
        supabaseSuccess = true;
      }
      if (!newsRes.error && Array.isArray(newsRes.data)) {
        news = newsRes.data.map(mapNewsFromDb);
        supabaseSuccess = true;
      }
    } catch (err) {
      console.warn("[getArticles] Failed to fetch from Supabase:", err);
    }
  }

  let userArticles = [];

  if (supabaseSuccess) {
    // Supabase is the authoritative source of truth
    userArticles = [...blogs, ...news].filter((a) => !isStaticArticle(a));
    // Synchronize local cache with database so deleted items are purged immediately
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("clingene_admin_articles_data", JSON.stringify(userArticles));
      } catch (_) {}
    }
  } else {
    // Only fall back to local cache if Supabase network connection failed
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("clingene_admin_articles_data");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            userArticles = parsed.filter((a) => !isStaticArticle(a));
          }
        }
      } catch (_) {}
    }
  }

  userArticles.sort((a, b) => {
    const dateA = new Date(a.date || a.publish_date || a.created_at || 0).getTime();
    const dateB = new Date(b.date || b.publish_date || b.created_at || 0).getTime();
    return dateB - dateA;
  });

  return userArticles;
}

/**
 * Create an article in Supabase (routes to blog_posts or news_posts based on `type`)
 */
export async function createArticle(itemData) {
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
    let eventDateVal = itemData.eventDate ? String(itemData.eventDate).trim() : null;
    if (eventDateVal && /^[A-Za-z]+ \d+, \d{4}$/.test(eventDateVal)) {
      const d = new Date(eventDateVal);
      if (!isNaN(d.getTime())) {
        eventDateVal = d.toISOString().split("T")[0];
      }
    }
    payload.source = (itemData.source || "ClinGene Press Office").trim() || null;
    payload.event_date = eventDateVal || dateVal || null;
  } else {
    let tagsArray = [];
    if (Array.isArray(itemData.tags)) {
      tagsArray = itemData.tags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof itemData.tags === "string" && itemData.tags.trim()) {
      tagsArray = itemData.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
    payload.author = (itemData.author || "Dr. Amjad Ali Tanoli Ph.D").trim() || null;
    payload.tags = tagsArray.length > 0 ? tagsArray.join(", ") : (typeof itemData.tags === "string" ? itemData.tags.trim() : null);
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(targetTable)
        .insert([payload])
        .select("*")
        .single();

      if (!error && data) {
        return isNews ? mapNewsFromDb(data) : mapBlogFromDb(data);
      }
      if (error) {
        console.warn(`[createArticle] Supabase insert warning for ${targetTable}:`, error);
      }
    } catch (err) {
      console.warn(`[createArticle] Exception querying Supabase:`, err);
    }
  }

  // Fallback local return if Supabase is offline or RLS blocks
  return {
    id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: itemData.type || "blog",
    title: itemData.title,
    slug: payload.slug,
    category: payload.category,
    excerpt: payload.excerpt,
    content: payload.content,
    image: payload.image_url,
    image_url: payload.image_url,
    imageAlt: payload.image_alt,
    date: payload.publish_date,
    publish_date: payload.publish_date,
    status: itemData.status || "Published",
    author: payload.author,
    tags: payload.tags,
    source: payload.source,
    eventDate: payload.event_date,
    created_at: new Date().toISOString(),
  };
}

/**
 * Update an article in Supabase
 */
export async function updateArticle(id, itemData) {
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

  if (itemData.slug) {
    payload.slug = slugify(itemData.slug);
  }

  if (isNews) {
    let eventDateVal = itemData.eventDate ? String(itemData.eventDate).trim() : null;
    if (eventDateVal && /^[A-Za-z]+ \d+, \d{4}$/.test(eventDateVal)) {
      const d = new Date(eventDateVal);
      if (!isNaN(d.getTime())) {
        eventDateVal = d.toISOString().split("T")[0];
      }
    }
    payload.source = (itemData.source || "ClinGene Press Office").trim() || null;
    payload.event_date = eventDateVal || dateVal || null;
  } else {
    let tagsArray = [];
    if (Array.isArray(itemData.tags)) {
      tagsArray = itemData.tags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof itemData.tags === "string" && itemData.tags.trim()) {
      tagsArray = itemData.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
    payload.author = (itemData.author || "Dr. Amjad Ali Tanoli Ph.D").trim() || null;
    payload.tags = tagsArray.length > 0 ? tagsArray.join(", ") : (typeof itemData.tags === "string" ? itemData.tags.trim() : null);
  }

  if (supabase && id && !String(id).startsWith("local-")) {
    try {
      const { data, error } = await supabase
        .from(targetTable)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

      if (!error && data) {
        return isNews ? mapNewsFromDb(data) : mapBlogFromDb(data);
      }
      if (error) {
        console.warn(`[updateArticle] Supabase update warning for ${targetTable}:`, error);
      }
    } catch (err) {
      console.warn(`[updateArticle] Exception querying Supabase:`, err);
    }
  }

  return {
    id,
    ...itemData,
    status: itemData.status || "Published",
  };
}

/**
 * Delete an article by ID from Supabase and clear all local and public caches
 */
export async function deleteArticle(id, type) {
  if (!id) return false;

  // 1. Delete from Supabase
  if (supabase && !String(id).startsWith("local-")) {
    try {
      if (type === "blog") {
        const { error } = await supabase.from("blog_posts").delete().eq("id", id);
        if (error) console.warn("[deleteArticle] Error deleting from blog_posts:", error);
      } else if (type === "news") {
        const { error } = await supabase.from("news_posts").delete().eq("id", id);
        if (error) console.warn("[deleteArticle] Error deleting from news_posts:", error);
      } else {
        await Promise.allSettled([
          supabase.from("blog_posts").delete().eq("id", id),
          supabase.from("news_posts").delete().eq("id", id),
        ]);
      }
    } catch (err) {
      console.warn("[deleteArticle] Error deleting from Supabase:", err);
    }
  }

  // 2. Remove from Admin LocalStorage cache
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("clingene_admin_articles_data");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((a) => a && a.id !== id && a.slug !== id);
          localStorage.setItem("clingene_admin_articles_data", JSON.stringify(filtered));
        }
      }
    } catch (_) {}

    // 3. Remove from Public Caches (sessionStorage and localStorage)
    const purgeStorage = (key) => {
      try {
        const sRaw = sessionStorage.getItem(key);
        if (sRaw) {
          const list = JSON.parse(sRaw);
          if (Array.isArray(list)) {
            sessionStorage.setItem(key, JSON.stringify(list.filter((a) => a && a.id !== id && a.slug !== id)));
          }
        }
        const lRaw = localStorage.getItem(key);
        if (lRaw) {
          const list = JSON.parse(lRaw);
          if (Array.isArray(list)) {
            localStorage.setItem(key, JSON.stringify(list.filter((a) => a && a.id !== id && a.slug !== id)));
          }
        }
      } catch (_) {}
    };

    purgeStorage("clingene_public_blogs_v2");
    purgeStorage("clingene_public_news_v2");

    // 4. Remove from IndexedDB
    try {
      const purgeIdb = async (key) => {
        const cached = await getIdbItem(key);
        if (Array.isArray(cached)) {
          await setIdbItem(key, cached.filter((a) => a && a.id !== id && a.slug !== id));
        }
      };
      purgeIdb("clingene_public_blogs_v2").catch(() => {});
      purgeIdb("clingene_public_news_v2").catch(() => {});
    } catch (_) {}
  }

  return true;
}
