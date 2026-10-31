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

import clinicalTestingImage from "../assets/services/cropped/clinical-genetic-testing.webp";
import sangerImage from "../assets/services/cropped/sanger-sequencing.webp";
import exomeSequencingImage from "../assets/services/cropped/whole-exome-genome-sequencing.webp";
import singleCellImage from "../assets/services/cropped/single-cell-rna-seq-analysis.webp";
import metagenomeImage from "../assets/services/cropped/16s-rrna-metagenome-sequencing.webp";
import fungalGenomeImage from "../assets/services/cropped/whole-fungal-genome-sequencing.webp";
import pangenomeImage from "../assets/services/cropped/pangenome-analysis.webp";
import phylogeneticImage from "../assets/services/cropped/phylogenetic-tree-construction.webp";
import plantGenomeImage from "../assets/services/cropped/plant genome.webp";
import proteinDockingImage from "../assets/services/cropped/protein-docking-molecular-dynamics.webp";
import statisticalDataAnalysisImage from "../assets/services/cropped/statistical-data-analysis.webp";
import geneticCounselingImage from "../assets/services/genetic-counseling-consultation.webp";
import panelSequencingImage from "../assets/services/panel-sequencing.webp";
import rnaSequencingNewImage from "../assets/services/rna-sequencing-transcriptome.webp";
import metagenomeNewImage from "../assets/services/metagenome-sequencing.webp";
import pangenomeNewImage from "../assets/services/pangenome-analysis.webp";
import mdSimulationImage from "../assets/services/md-simulation-molecular-dynamics.webp";
import immunogenicityImage from "../assets/services/immunogenicity-analysis-antibody-antigen.webp";
import virtualScreeningImage from "../assets/services/virtual-screening-ligand-docking.webp";
import libraryGenerationImage from "../assets/services/ngs-library-generation.webp";
import molecularBiologyImage from "../assets/services/molecular-biology-pcr-gel.webp";

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

export const localServiceImageMap = {
  "/assets/services/genetic-counseling-consultation.webp": geneticCounselingImage,
  "/assets/services/cropped/whole-exome-genome-sequencing.webp": exomeSequencingImage,
  "/assets/services/panel-sequencing.webp": panelSequencingImage,
  "/assets/services/cropped/sanger-sequencing.webp": sangerImage,
  "/assets/services/rna-sequencing-transcriptome.webp": rnaSequencingNewImage,
  "/assets/services/metagenome-sequencing.webp": metagenomeNewImage,
  "/assets/services/cropped/phylogenetic-tree-construction.webp": phylogeneticImage,
  "/assets/services/pangenome-analysis.webp": pangenomeNewImage,
  "/assets/services/md-simulation-molecular-dynamics.webp": mdSimulationImage,
  "/assets/services/cropped/protein-docking-molecular-dynamics.webp": proteinDockingImage,
  "/assets/services/immunogenicity-analysis-antibody-antigen.webp": immunogenicityImage,
  "/assets/services/virtual-screening-ligand-docking.webp": virtualScreeningImage,
  "/assets/services/ngs-library-generation.webp": libraryGenerationImage,
  "/assets/services/molecular-biology-pcr-gel.webp": molecularBiologyImage,
  "/assets/services/cropped/statistical-data-analysis.webp": statisticalDataAnalysisImage,
  "/assets/services/cropped/clinical-genetic-testing.webp": clinicalTestingImage,
  "/assets/services/cropped/single-cell-rna-seq-analysis.webp": singleCellImage,
  "/assets/services/cropped/16s-rrna-metagenome-sequencing.webp": metagenomeImage,
  "/assets/services/cropped/whole-fungal-genome-sequencing.webp": fungalGenomeImage,
  "/assets/services/cropped/plant genome.webp": plantGenomeImage,
};

export const GENETIC_COUNSELING_SUBSERVICES = [
  { id: "prenatal-diagnosis", label: "Prenatal Diagnosis" },
  { id: "newborn-screening", label: "Newborn Screening" },
  { id: "genetic-diseases", label: "Genetic Diseases" },
  { id: "chromosomal-abnormalities", label: "Chromosomal Abnormalities" },
  { id: "hereditary-cancer", label: "Hereditary Cancer" },
];

const WES_WGS_COMPARISON = {
  headers: ["Feature / Metric", "Whole Exome Sequencing (WES)", "Whole Genome Sequencing (WGS)"],
  rows: [
    ["Target Region", "Protein-coding regions (~1-2% of genome)", "Entire nuclear & mitochondrial genome (~100%)"],
    ["Typical Depth", "100x – 200x average coverage", "30x – 60x average coverage"],
    ["Variant Detection", "SNVs and Indels in coding exons", "SNVs, Indels, SVs, CNVs, non-coding & regulatory regions"],
    ["Recommended Scope", "Mendelian diseases, targeted diagnostics", "Unsolved rare diseases, novel discoveries, structural variants"],
  ],
};

export function getServiceIcon(iconName) {
  if (typeof iconName === "function") return iconName;
  if (typeof iconName === "string" && ICON_MAP[iconName]) {
    return ICON_MAP[iconName];
  }
  return FlaskConical;
}

function defaultApplications(row) {
  const title = row.title || "Clinical & Research";
  const desc = row.short_description || row.subtitle || "Advanced genomic analysis and diagnostics.";
  return [
    {
      title: "Clinical Diagnostics & Screening",
      description: desc,
    },
    {
      title: "Precision Medicine Guidance",
      description: `Targeted molecular and functional insights for ${title}.`,
    },
    {
      title: "Academic & Translational Research",
      description: "Comprehensive experimental design and reproducible bioinformatic pipelines.",
    },
    {
      title: "Quality Controlled Reporting",
      description: "Rigorous analytical validation aligned with international molecular standards.",
    },
  ];
}

function defaultRequirements(row) {
  const reqs = [];
  if (row.sample_type) {
    reqs.push(`Sample Type: ${row.sample_type}`);
  } else {
    reqs.push("Biological sample (EDTA whole blood, gDNA, tissue, or raw sequencing files)");
  }
  reqs.push("Completed test requisition form with clinical summary or research aims");
  reqs.push("Adequate sample concentration and transport under recommended temperature controls");
  return reqs;
}

function defaultDeliverables(row) {
  const delivs = [];
  if (row.report_format) {
    delivs.push(row.report_format);
  } else {
    delivs.push("Comprehensive diagnostic/analytical report with clinical interpretation");
  }
  if (row.turnaround_time) {
    delivs.push(`Estimated turnaround time: ${row.turnaround_time}`);
  }
  delivs.push("Quality metrics report, methodology summary, and variant/data annotations");
  delivs.push("Raw FASTQ/BAM/VCF data files provided securely upon completion");
  return delivs;
}

function defaultFaq(row) {
  const title = row.title || "this service";
  return [
    {
      question: `How do I request or schedule ${title}?`,
      answer: `Click the 'Request this service' button or reach out to our team at info@clingene.co. Our team will review your project requirements or patient referral and guide you through the process.`,
    },
    {
      question: "What is the expected turnaround time?",
      answer: row.turnaround_time
        ? `The typical turnaround time is ${row.turnaround_time} from receipt of verified samples at our laboratory.`
        : "Turnaround times vary based on sample batching and scope. Contact our team for an exact timeline for your project.",
    },
    {
      question: "What sample requirements and transport conditions are needed?",
      answer: row.sample_type
        ? `This test utilizes ${row.sample_type}. Samples should be collected following standard clinical protocol and shipped using appropriate cold-chain transport.`
        : "Our laboratory accepts standard biological specimens. We provide detailed collection and shipping guidelines upon test requisition.",
    },
    {
      question: "How will the results and reports be delivered?",
      answer: row.report_format
        ? `Results are delivered as a ${row.report_format}. Secure digital delivery is available for clinicians and researchers.`
        : "A comprehensive digital report is delivered securely via encrypted email or download portal.",
    },
  ];
}

export function mapServiceFromDb(row) {
  if (!row) return null;

  const rawOverview = row.overview;
  let overviewArray = [];
  if (Array.isArray(rawOverview)) {
    overviewArray = rawOverview;
  } else if (typeof rawOverview === "string" && rawOverview.trim()) {
    overviewArray = rawOverview.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  }
  if (overviewArray.length === 0) {
    overviewArray = [row.short_description || row.subtitle || row.title || ""];
  }

  let featuresArray = [];
  if (Array.isArray(row.features)) {
    featuresArray = row.features;
  } else if (typeof row.features === "string" && row.features.trim()) {
    featuresArray = row.features.split("\n").map((f) => f.trim()).filter(Boolean);
  }

  const isGeneticCounseling =
    row.slug === "genetic-counseling" || row.slug === "genetic-counselling";

  const resolvedImage = localServiceImageMap[row.image_url] || row.image_url || "/images/clingene-logo.webp";

  return {
    id: row.id,
    title: row.title || "",
    name: row.title || "",
    slug: row.slug || "",
    subtitle: row.subtitle || "",
    tagline: row.subtitle || row.short_description || "",
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
    image: resolvedImage,
    imageAlt: `${row.title || "ClinGene Service"} at ClinGene Pakistan`,
    width: 800,
    height: 800,
    sample_type: row.sample_type || "",
    sampleType: row.sample_type || "",
    turnaround_time: row.turnaround_time || "",
    turnaroundTime: row.turnaround_time || "",
    report_format: row.report_format || "",
    reportFormat: row.report_format || "",
    requisition_form_url: row.requisition_form_url || null,
    requisitionPdf: row.requisition_form_url || null,
    status: row.status || "published",
    sort_order: row.sort_order ?? 0,
    subServices: isGeneticCounseling ? GENETIC_COUNSELING_SUBSERVICES : undefined,
    applications: defaultApplications(row),
    requirements: defaultRequirements(row),
    requirementsLabel: row.service_type === "lab" ? "Sample & Clinical Requirements" : "Computational Prerequisites",
    deliverables: defaultDeliverables(row),
    deliverablesNote: "Raw sequencing files and custom annotations are preserved in secure cloud storage for 90 days following report issuance.",
    comparisonTable: row.slug === "whole-exome-genome-sequencing" ? WES_WGS_COMPARISON : undefined,
    faq: defaultFaq(row),
  };
}

export async function fetchPublishedServices() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("services")
    .select(
      "id, title, slug, subtitle, category, service_type, pricing_display, short_description, overview, features, icon, image_url, sample_type, turnaround_time, report_format, requisition_form_url, status, sort_order"
    )
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) {
    if (import.meta.env.DEV) {
      console.error("[fetchPublishedServices] Error:", error);
    }
    throw error;
  }
  return (data || []).map(mapServiceFromDb);
}

export async function fetchServiceBySlug(slug) {
  if (!supabase || !slug) return null;
  const cleanSlug = slug.trim().toLowerCase();
  const normalized = cleanSlug === "genetic-counselling" ? "genetic-counseling" : cleanSlug;

  const { data, error } = await supabase
    .from("services")
    .select(
      "id, title, slug, subtitle, category, service_type, pricing_display, short_description, overview, features, icon, image_url, sample_type, turnaround_time, report_format, requisition_form_url, status, sort_order"
    )
    .eq("status", "published")
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
      .select(
        "id, title, slug, subtitle, category, service_type, pricing_display, short_description, overview, features, icon, image_url, sample_type, turnaround_time, report_format, requisition_form_url, status, sort_order"
      )
      .eq("status", "published")
      .eq("slug", cleanSlug)
      .maybeSingle();

    if (fallbackData) {
      return mapServiceFromDb(fallbackData);
    }
  }

  return null;
}

