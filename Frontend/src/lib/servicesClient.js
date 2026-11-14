import {
  Activity,
  Atom,
  Boxes,
  Bug,
  Clock,
  Dna,
  FileCheck,
  FileDown,
  FileText,
  FlaskConical,
  GitBranch,
  Layers,
  LayoutGrid,
  Leaf,
  Library,
  Lightbulb,
  Microscope,
  Network,
  Search,
  ShieldCheck,
  ShieldPlus,
  Sparkles,
  Sprout,
  Stethoscope,
  TestTubes,
} from "lucide-react";

import { supabase } from "./supabase.js";

export const ICON_MAP = {
  Activity,
  Atom,
  Boxes,
  Bug,
  Clock,
  Dna,
  FileCheck,
  FileDown,
  FileText,
  FlaskConical,
  GitBranch,
  Layers,
  LayoutGrid,
  Leaf,
  Library,
  Lightbulb,
  Microscope,
  Network,
  Search,
  ShieldCheck,
  ShieldPlus,
  Sparkles,
  Sprout,
  Stethoscope,
  TestTubes,
};

export const GENETIC_COUNSELING_SUBSERVICES = [
  { id: "prenatal-diagnosis", label: "Prenatal Diagnosis" },
  { id: "newborn-screening", label: "Newborn Screening" },
  { id: "genetic-diseases", label: "Genetic Diseases" },
  { id: "chromosomal-abnormalities", label: "Chromosomal Abnormalities" },
  { id: "hereditary-cancer", label: "Hereditary Cancer" },
];

export function getServiceIcon(iconName) {
  if (typeof iconName === "function") return iconName;
  if (typeof iconName === "string" && iconName.trim()) {
    const trimmed = iconName.trim();
    if (ICON_MAP[trimmed]) return ICON_MAP[trimmed];
    const lower = trimmed.toLowerCase();
    const foundKey = Object.keys(ICON_MAP).find((k) => k.toLowerCase() === lower);
    if (foundKey) return ICON_MAP[foundKey];
  }
  return FlaskConical;
}

/**
 * Map Supabase services row to frontend service object
 */
export function mapServiceFromDb(row) {
  if (!row) return null;

  // overview: text, split on blank lines into an array
  const rawOverview = row.overview;
  let overviewArray = [];
  if (Array.isArray(rawOverview)) {
    overviewArray = rawOverview;
  } else if (typeof rawOverview === "string" && rawOverview.trim()) {
    overviewArray = rawOverview.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  }
  if (overviewArray.length === 0 && (row.short_description || row.subtitle || row.title)) {
    overviewArray = [row.short_description || row.subtitle || row.title];
  }

  // features: array or newline-separated string
  let featuresArray = [];
  if (Array.isArray(row.features)) {
    featuresArray = row.features;
  } else if (typeof row.features === "string" && row.features.trim()) {
    featuresArray = row.features.split("\n").map((f) => f.trim()).filter(Boolean);
  }

  const isGeneticCounseling =
    row.slug === "genetic-counseling" || row.slug === "genetic-counselling";
  const subServices = Array.isArray(row.sub_services)
    ? row.sub_services
        .filter((item) => item.is_active !== false)
        .map((item) => ({
          ...item,
          id: item.slug || item.id,
          label: item.name || "",
        }))
    : isGeneticCounseling
      ? GENETIC_COUNSELING_SUBSERVICES
      : null;

  // Requisition form / PDF
  let requisitionPdf = row.requisition_form_url || null;
  if (requisitionPdf && typeof requisitionPdf === "string") {
    requisitionPdf = {
      url: requisitionPdf,
      name: requisitionPdf.split("/").pop() || "requisition.pdf",
    };
  }

  return {
    id: row.id,
    title: row.title || "",
    name: row.title || "",
    slug: row.slug || "",
    subtitle: row.subtitle || "",
    tagline: row.short_description || row.subtitle || "",
    category: row.category || "Clinical Diagnostics",
    service_type: row.service_type || "lab",
    type: row.service_type || "lab",
    pricing_display: row.pricing_display || "",
    pricing: row.pricing_display || "",
    short_description: row.short_description || "",
    description: row.short_description || row.subtitle || "",
    overview: overviewArray,
    features: featuresArray,
    icon: row.icon || "FlaskConical",
    Icon: getServiceIcon(row.icon),
    image_url: row.image_url || "",
    image: row.image_url || "/images/clingene-logo.webp",
    imageAlt: `${row.title || "ClinGene Service"} at ClinGene Pakistan`,
    width: Number(row.image_width) || 800,
    height: Number(row.image_height) || 800,
    sample_type: row.sample_type || "",
    sampleType: row.sample_type || "",
    turnaround_time: row.turnaround_time || "",
    turnaroundTime: row.turnaround_time || "",
    report_format: row.report_format || "",
    reportFormat: row.report_format || "",
    requisition_form_url: row.requisition_form_url || null,
    requisitionPdf: requisitionPdf,
    status: row.status || "published",
    sort_order: row.sort_order ?? 0,
    applications: Array.isArray(row.applications) ? row.applications : [],
    requirements: Array.isArray(row.requirements) ? row.requirements : [],
    requirementsLabel:
      row.requirements_label ||
      (row.service_type === "lab" ? "Sample requirements" : "Input data requirements"),
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    deliverablesNote: row.deliverables_note || null,
    comparisonTable: row.comparison_table || null,
    subServices,
    relatedSlugs: Array.isArray(row.related_slugs) ? row.related_slugs : (row.relatedSlugs || []),
    faq: Array.isArray(row.faq) ? row.faq : [],
  };
}

/**
 * Fetch all published services from Supabase ordered by sort_order
 */
export async function fetchPublishedServices() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("services")
    .select("*, sub_services(*)")
    .eq("status", "published")
    .eq("sub_services.is_active", true)
    .order("sort_order", { ascending: true, referencedTable: "sub_services" })
    .order("sort_order", { ascending: true });

  if (error) {
    if (import.meta.env.DEV) {
      console.error("[fetchPublishedServices] Error:", error);
    }
    throw error;
  }
  return (data || []).map(mapServiceFromDb);
}

/**
 * Fetch single published service by slug from Supabase
 */
export async function fetchServiceBySlug(slug) {
  if (!supabase || !slug) return null;
  const cleanSlug = slug.trim().toLowerCase();
  const normalized = cleanSlug === "genetic-counselling" ? "genetic-counseling" : cleanSlug;

  const { data, error } = await supabase
    .from("services")
    .select("*, sub_services(*)")
    .eq("status", "published")
    .eq("sub_services.is_active", true)
    .order("sort_order", { ascending: true, referencedTable: "sub_services" })
    .eq("slug", normalized)
    .maybeSingle();

  if (error) {
    if (import.meta.env.DEV) {
      console.error("[fetchServiceBySlug] Error:", error);
    }
    throw error;
  }

  if (data) {
    return mapServiceFromDb(data);
  }

  // Fallback to exact slug if normalized differed
  if (normalized !== cleanSlug) {
    const { data: fallbackData } = await supabase
      .from("services")
      .select("*, sub_services(*)")
      .eq("status", "published")
      .eq("sub_services.is_active", true)
      .order("sort_order", { ascending: true, referencedTable: "sub_services" })
      .eq("slug", cleanSlug)
      .maybeSingle();

    if (fallbackData) {
      return mapServiceFromDb(fallbackData);
    }
  }

  return null;
}
