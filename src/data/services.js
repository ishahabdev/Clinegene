import {
  Atom,
  BarChart3,
  Bug,
  Dna,
  FlaskConical,
  GitBranch,
  Layers,
  Leaf,
  Microscope,
  Network,
  Sprout,
  Stethoscope,
  TestTubes,
} from "lucide-react";
import clinicalTestingImage from "../assets/services/cropped/clinical-genetic-testing.webp";
import clinicalSampleImage from "../assets/services/cropped/single-cell-rna-seq-analysis.webp";
import sangerImage from "../assets/services/cropped/rna-seq.webp";
import exomeSequencingImage from "../assets/services/cropped/whole-exome-genome-sequencing.webp";
import wholeGenomeMetagenomeImage from "../assets/services/cropped/whole-genome-metagenome.webp";
import cellCultureImage from "../assets/services/cropped/sanger-sequencing.webp";
import metagenomeImage from "../assets/services/cropped/16s-rrna-metagenome-sequencing.webp";
import fungalGenomeImage from "../assets/services/cropped/whole-fungal-genome-sequencing.webp";
import phylogeneticImage from "../assets/services/cropped/phylogenetic-tree-construction.webp";
import plantGenomeImage from "../assets/services/cropped/plant genome.webp";
import pangenomeImage from "../assets/services/cropped/pangenome-analysis.webp";
import proteinDockingImage from "../assets/services/cropped/protein-docking-molecular-dynamics.webp";
import statisticsImage from "../assets/services/cropped/statistical-data-analysis.webp";

const services = [
  { name: "Clinical Genetic Testing", description: "Genetic testing services for clinical and research needs.", Icon: Stethoscope, image: clinicalTestingImage, width: 322, height: 304 },
  { name: "Sanger Sequencing", description: "Targeted DNA sequencing and sequence analysis.", Icon: TestTubes, image: sangerImage, width: 320, height: 304 },
  { name: "Whole Exome/Genome Sequencing", description: "Comprehensive sequencing for genomic research.", Icon: Dna, image: exomeSequencingImage, width: 338, height: 301 },
  { name: "RNA-Seq", description: "RNA sequencing services for gene expression research.", Icon: FlaskConical, image: clinicalSampleImage, width: 319, height: 304 },
  { name: "Single-cell RNA seq data analysis", description: "Analysis of single-cell RNA sequencing datasets.", Icon: Microscope, image: cellCultureImage, width: 320, height: 302 },
  { name: "16SrRNA Metagenome Sequencing", description: "Sequencing and analysis of 16S rRNA metagenomes.", Icon: Bug, image: metagenomeImage, width: 406, height: 309 },
  { name: "Whole Genome Metagenome", description: "Whole-genome metagenomic sequencing and analysis.", Icon: Layers, image: wholeGenomeMetagenomeImage, width: 310, height: 301 },
  { name: "Whole Fungal Genome Sequencing", description: "Genome sequencing services for fungal research.", Icon: Sprout, image: fungalGenomeImage, width: 403, height: 297 },
  { name: "Pangenome Analysis", description: "Comparative analysis across multiple genomes.", Icon: Network, image: pangenomeImage, width: 387, height: 331 },
  { name: "Phylogenetic Tree Construction", description: "Phylogenetic analysis and tree construction.", Icon: GitBranch, image: phylogeneticImage, width: 405, height: 295 },
  { name: "Plant Genome Sequencing", description: "Genome sequencing services for plant research.", Icon: Leaf, image: plantGenomeImage, width: 406, height: 297 },
  { name: "Protein Docking & Molecular Dynamic Simulation", description: "Computational protein docking and molecular simulation.", Icon: Atom, image: proteinDockingImage, width: 431, height: 291 },
  { name: "Statistical Data Analysis", description: "Statistical analysis to support research data.", Icon: BarChart3, image: statisticsImage, width: 547, height: 309 },
];

export default services;
