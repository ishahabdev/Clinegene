import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const backupDir = path.resolve(rootDir, "assets-original/services");
const servicesDir = path.resolve(rootDir, "src/assets/services");

// List of target service image mappings
const imageTasks = [
  {
    originalFilename: "Genetic Counseling Consultation with Family Chart.png",
    outputFilename: "genetic-counseling-consultation.webp",
    serviceName: "Genetic Counseling",
    serviceNumber: "01",
    serviceSlug: "genetic-counseling",
  },
  {
    originalFilename: "Panel Sequencing.jpeg",
    outputFilename: "panel-sequencing.webp",
    serviceName: "Panel sequencing",
    serviceNumber: "03",
    serviceSlug: "panel-sequencing",
  },
  {
    originalFilename: "Biotech Lab Data Analysis.png",
    outputFilename: "rna-sequencing-transcriptome.webp",
    serviceName: "RNA-Sequencing/Transcriptome Sequencing",
    serviceNumber: "05",
    serviceSlug: "rna-seq",
  },
  {
    originalFilename: "metagenome.jpeg",
    outputFilename: "metagenome-sequencing.webp",
    serviceName: "Metagenome Sequencing",
    serviceNumber: "06",
    serviceSlug: "whole-genome-metagenome",
  },
  {
    originalFilename: "Pangenome.jpeg",
    outputFilename: "pangenome-analysis.webp",
    serviceName: "Pangenome Analysis",
    serviceNumber: "08",
    serviceSlug: "pangenome-analysis",
  },
  {
    originalFilename: "Molecular Membrane Channel in Motion.png",
    outputFilename: "md-simulation-molecular-dynamics.webp",
    serviceName: "MD Simulation",
    serviceNumber: "09",
    serviceSlug: "protein-docking-molecular-dynamics",
  },
  {
    originalFilename: "Antibodies Defending Against Virus.png",
    outputFilename: "immunogenicity-analysis-antibody-antigen.webp",
    serviceName: "Immunogenicity Analysis",
    serviceNumber: "11",
    serviceSlug: "immunogenicity-analysis",
  },
  {
    originalFilename: "Molecular Docking in a Glowing Protein Pocket.png",
    outputFilename: "virtual-screening-ligand-docking.webp",
    serviceName: "Virtual Screening",
    serviceNumber: "12",
    serviceSlug: "virtual-screening",
  },
  {
    originalFilename: "Precision Pipetting into Microplate Wells.png",
    outputFilename: "ngs-library-generation.webp",
    serviceName: "Library generation",
    serviceNumber: "13",
    serviceSlug: "library-generation",
  },
  {
    originalFilename: "Gemini_Generated_Image_31dci131dci131dc.jpeg",
    outputFilename: "molecular-biology-pcr-gel.webp",
    serviceName: "Molecular Biology Services",
    serviceNumber: "14",
    serviceSlug: "molecular-biology-services",
  },

];

async function optimizeImages() {
  console.log("🎨 Starting ClinGene Service Image Optimization with Sharp...\n");

  const results = [];
  let totalBeforeBytes = 0;
  let totalAfterBytes = 0;

  for (const task of imageTasks) {
    // Look in backupDir first, then servicesDir
    let inputPath = path.join(backupDir, task.originalFilename);
    if (!fs.existsSync(inputPath)) {
      inputPath = path.join(servicesDir, task.originalFilename);
    }

    if (!fs.existsSync(inputPath)) {
      if (task.optional) {
        console.log(`ℹ️ Optional image not found: "${task.originalFilename}" (for ${task.serviceName}). Leaving current image unchanged.`);
        results.push({
          ...task,
          status: "NOT_FOUND",
          note: "Source image not found in assets; kept current image",
        });
        continue;
      }
      console.warn(`⚠️ Warning: "${task.originalFilename}" not found!`);
      results.push({
        ...task,
        status: "NOT_FOUND",
        note: "Source file missing",
      });
      continue;
    }

    const beforeStats = fs.statSync(inputPath);
    const beforeBytes = beforeStats.size;
    totalBeforeBytes += beforeBytes;

    const outputPath = path.join(servicesDir, task.outputFilename);

    let quality = 78;
    let buffer;
    let meta;

    // Load image and get original metadata
    const imagePipeline = sharp(inputPath).resize({
      width: 800,
      withoutEnlargement: true,
      fit: "inside",
    });

    // Try converting with target under 100 KB, lowering quality in steps down to 65
    while (quality >= 65) {
      buffer = await imagePipeline.clone().webp({ quality }).toBuffer();
      if (buffer.length <= 100 * 1024 || quality === 65) {
        break;
      }
      quality = Math.max(65, quality - 3);
    }

    // Write final optimized WebP
    fs.writeFileSync(outputPath, buffer);
    meta = await sharp(buffer).metadata();

    const afterBytes = buffer.length;
    totalAfterBytes += afterBytes;

    const beforeKB = (beforeBytes / 1024).toFixed(1);
    const afterKB = (afterBytes / 1024).toFixed(1);
    const reductionPercent = (((beforeBytes - afterBytes) / beforeBytes) * 100).toFixed(1);

    console.log(
      `✓ [${task.serviceNumber}] ${task.serviceName}:` +
      `\n    ${task.originalFilename} (${beforeKB} KB) -> ${task.outputFilename} (${afterKB} KB, ${reductionPercent}% reduction, quality=${quality})` +
      `\n    Dimensions: ${meta.width}x${meta.height} px\n`
    );

    results.push({
      ...task,
      status: "OPTIMIZED",
      beforeKB: parseFloat(beforeKB),
      afterKB: parseFloat(afterKB),
      width: meta.width,
      height: meta.height,
      quality,
      reductionPercent: parseFloat(reductionPercent),
    });
  }

  const totalBeforeMB = (totalBeforeBytes / (1024 * 1024)).toFixed(2);
  const totalAfterMB = (totalAfterBytes / (1024 * 1024)).toFixed(2);
  const totalReduction = totalBeforeBytes > 0
    ? (((totalBeforeBytes - totalAfterBytes) / totalBeforeBytes) * 100).toFixed(1)
    : "0.0";

  console.log("=================================================");
  console.log(`Total Image Weight Before: ${totalBeforeMB} MB`);
  console.log(`Total Image Weight After:  ${totalAfterMB} MB (${(totalAfterBytes / 1024).toFixed(1)} KB)`);
  console.log(`Total Space Saved:        ${totalReduction}%`);
  console.log("=================================================\n");

  return results;
}

optimizeImages().catch((err) => {
  console.error("Optimization failed:", err);
  process.exit(1);
});

