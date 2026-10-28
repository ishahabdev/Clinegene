import {
  Atom,
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
import sangerImage from "../assets/services/cropped/sanger-sequencing.webp";
import exomeSequencingImage from "../assets/services/cropped/whole-exome-genome-sequencing.webp";
import rnaSeqImage from "../assets/services/cropped/rna-seq.webp";
import singleCellImage from "../assets/services/cropped/single-cell-rna-seq-analysis.webp";
import metagenomeImage from "../assets/services/cropped/16s-rrna-metagenome-sequencing.webp";
import wholeGenomeMetagenomeImage from "../assets/services/cropped/whole-genome-metagenome.webp";
import fungalGenomeImage from "../assets/services/cropped/whole-fungal-genome-sequencing.webp";
import pangenomeImage from "../assets/services/cropped/pangenome-analysis.webp";
import phylogeneticImage from "../assets/services/cropped/phylogenetic-tree-construction.webp";
import plantGenomeImage from "../assets/services/cropped/plant genome.webp";
import proteinDockingImage from "../assets/services/cropped/protein-docking-molecular-dynamics.webp";

export const servicesData = [
  {
    number: "01",
    slug: "clinical-genetic-testing",
    name: "Clinical Genetic Testing",
    type: "lab",
    tagline: "Genetic testing for clinical and research needs.",
    Icon: Stethoscope,
    image: clinicalTestingImage,
    width: 322,
    height: 304,
    description: "Genetic testing services for clinical and research needs.",
    overview: [
      "Identifies changes in a person's DNA that cause or increase the risk of inherited conditions.",
      "Supports clinicians in confirming a suspected diagnosis, screening family members and guiding follow-up care.",
    ],
    features: [
      "Variant detection in disease-related genes",
      "Clinician-friendly interpreted report",
      "Support for single-gene and multi-gene testing",
      "Guidance on result interpretation",
    ],
    applications: [
      {
        title: "Confirming Diagnosis",
        description: "Confirming a suspected genetic disorder in symptomatic individuals.",
      },
      {
        title: "Carrier Screening",
        description: "Identifying carrier status for recessive inherited conditions.",
      },
      {
        title: "Family Testing",
        description: "Family (cascade) testing for at-risk relatives.",
      },
      {
        title: "Research Cohorts",
        description: "Characterizing genetic variants across dedicated research cohorts.",
      },
    ],
    requirementsLabel: "Sample requirements",
    requirements: [
      "Blood (EDTA tube) or extracted DNA.",
      "Completed request form with clinical details.",
      "Patient consent.",
      "Contact us for details regarding exact volumes and storage conditions.",
    ],
    deliverables: [
      "Interpreted report with variants classified by clinical significance.",
      "Comprehensive list of genes tested.",
    ],
    deliverablesNote: "Genetic counselling is recommended before and after testing.",
    faq: [
      {
        question: "What quantity of blood or DNA is required?",
        answer: "Blood collected in an EDTA tube or extracted DNA may be submitted. Contact our team for details regarding exact volume, concentration and storage requirements.",
      },
      {
        question: "How are the test results reported and delivered?",
        answer: "Results are delivered as a clinician-friendly interpreted report detailing detected variants classified according to clinical significance guidelines.",
      },
      {
        question: "How can I obtain a project quote or place an order?",
        answer: "Click 'Request this service' to submit an inquiry through our contact form. Our scientific team will reply promptly to assist with your inquiry.",
      },
    ],
    relatedSlugs: ["sanger-sequencing", "whole-exome-genome-sequencing", "rna-seq"],
  },
  {
    number: "02",
    slug: "sanger-sequencing",
    name: "Sanger Sequencing",
    type: "lab",
    tagline: "Targeted DNA sequencing and sequence analysis.",
    Icon: TestTubes,
    image: sangerImage,
    width: 320,
    height: 302,
    description: "Targeted DNA sequencing and sequence analysis.",
    overview: [
      "A reliable method for reading a specific stretch of DNA.",
      "Ideal for short, defined targets where accuracy matters.",
    ],
    features: [
      "Sequencing of PCR products and plasmids",
      "Forward and reverse reads",
      "Quality-checked chromatograms",
      "Sequence alignment against a reference",
    ],
    applications: [
      {
        title: "Variant Confirmation",
        description: "Confirming variants found by next-generation sequencing or other methods.",
      },
      {
        title: "Clone Verification",
        description: "Checking cloned inserts, plasmids and construct boundaries.",
      },
      {
        title: "Mutation Screening",
        description: "Targeted mutation screening in known candidate genes.",
      },
      {
        title: "Species Identification",
        description: "Species identification and taxonomic classification by marker genes.",
      },
    ],
    requirementsLabel: "Sample requirements",
    requirements: [
      "Purified PCR product or plasmid DNA.",
      "Primers (or request primer design from our team).",
      "Contact us for details regarding concentration and volume specifications.",
    ],
    deliverables: [
      "Chromatogram files (.ab1)",
      "Sequence files (FASTA)",
      "Alignment summary against reference sequence",
    ],
    faq: [
      {
        question: "What sample types can be submitted for Sanger sequencing?",
        answer: "We accept purified PCR products as well as plasmid DNA, accompanied by specific forward and reverse primers or requests for primer design.",
      },
      {
        question: "What data formats are provided upon completion?",
        answer: "You receive raw chromatogram trace files (.ab1), FASTA sequence files, and reference alignment summaries.",
      },
      {
        question: "How do I request a quote for high-throughput plate orders?",
        answer: "Submit your sample count and target details via the 'Request this service' button, and our team will reply promptly to assist with your inquiry.",
      },
    ],
    relatedSlugs: ["clinical-genetic-testing", "whole-exome-genome-sequencing", "phylogenetic-tree-construction"],
  },
  {
    number: "03",
    slug: "whole-exome-genome-sequencing",
    name: "Whole Exome / Genome Sequencing",
    type: "lab",
    tagline: "Comprehensive sequencing for genomic research and diagnostics.",
    Icon: Dna,
    image: exomeSequencingImage,
    width: 317,
    height: 301,
    description: "Comprehensive sequencing for genomic research and diagnostics.",
    overview: [
      "Whole exome sequencing (WES) reads the protein-coding regions of the genome, where most known disease-causing variants are found.",
      "Whole genome sequencing (WGS) reads the entire genome, including non-coding regions and large structural changes.",
    ],
    comparisonTable: {
      headers: ["Metric / Feature", "Whole Exome Sequencing (WES)", "Whole Genome Sequencing (WGS)"],
      rows: [
        ["Region covered", "Protein-coding regions (~1-2% of genome)", "Entire genome (coding and non-coding regions)"],
        ["Best for", "Known disease-causing variants and clinical diagnostics", "Novel variant discovery, structural variants, non-coding variation"],
        ["Data size", "Smaller (~5-10 GB per sample)", "Larger (~60-100 GB per sample)"],
      ],
    },
    features: [
      "Genome-wide variant discovery",
      "SNV, indel and (WGS) structural variant calling",
      "Variant annotation and filtering",
      "Optional family (trio) analysis",
    ],
    applications: [
      {
        title: "Rare Disease Diagnosis",
        description: "Investigating unexplained genetic conditions and rare inherited disorders.",
      },
      {
        title: "Cancer Research",
        description: "Profiling somatic alterations, driver mutations and genomic instability.",
      },
      {
        title: "Population & Ancestry",
        description: "Mapping population variation, ancestry markers and demographic history.",
      },
      {
        title: "Novel Gene Discovery",
        description: "Identifying novel candidate disease genes through family and cohort studies.",
      },
    ],
    requirementsLabel: "Sample requirements",
    requirements: [
      "High-quality genomic DNA or whole blood.",
      "Contact us for details regarding amount and quality thresholds.",
    ],
    deliverables: [
      "Raw reads (FASTQ)",
      "Aligned reads (BAM / CRAM)",
      "Variant calls (VCF)",
      "Annotated variant list",
      "Summary quality control and analytical report",
    ],
    faq: [
      {
        question: "What is the primary difference between WES and WGS?",
        answer: "WES targets the ~1-2% protein-coding regions where over 85% of known disease-causing mutations reside, whereas WGS sequences the complete 3-billion-base genome.",
      },
      {
        question: "Can you analyze parent-child trios or family cohorts?",
        answer: "Yes, family trio and cohort analyses are supported for denovo mutation detection and recessive inheritance pattern identification.",
      },
      {
        question: "How do I initiate a sequencing project?",
        answer: "Click 'Request this service' to provide your study design and sample counts. Our scientific team will contact you with specific guidelines promptly.",
      },
    ],
    relatedSlugs: ["clinical-genetic-testing", "sanger-sequencing", "rna-seq"],
  },
  {
    number: "04",
    slug: "rna-seq",
    name: "RNA-Seq",
    type: "lab",
    tagline: "RNA sequencing for gene expression research.",
    Icon: FlaskConical,
    image: rnaSeqImage,
    width: 320,
    height: 304,
    description: "RNA sequencing services for gene expression research.",
    overview: [
      "Measures which genes are active and how strongly in a sample.",
      "Compares conditions such as healthy vs diseased or treated vs untreated.",
    ],
    features: [
      "Differential gene expression analysis",
      "Transcript and isoform analysis",
      "Detection of novel transcripts and gene fusions (optional)",
      "Pathway and gene-set enrichment",
    ],
    applications: [
      {
        title: "Disease Mechanisms",
        description: "Elucidating molecular pathways involved in pathology and disease progression.",
      },
      {
        title: "Drug Response",
        description: "Quantifying transcriptional changes following pharmacological intervention.",
      },
      {
        title: "Developmental Biology",
        description: "Tracking temporal and spatial gene expression during differentiation.",
      },
      {
        title: "Biomarker Discovery",
        description: "Identifying diagnostic and prognostic transcriptomic biomarkers.",
      },
    ],
    requirementsLabel: "Sample requirements",
    requirements: [
      "Total RNA with good integrity, or tissue/cells preserved in an RNA stabiliser.",
      "Biological replicates recommended (minimum 3 replicates per condition).",
      "Contact us for details regarding sample quantity and RIN thresholds.",
    ],
    deliverables: [
      "Raw reads (FASTQ)",
      "Gene count matrix",
      "List of differentially expressed genes",
      "Visualisation plots (PCA, volcano plots, heatmaps)",
      "Pathway and GO enrichment results",
    ],
    faq: [
      {
        question: "Why are biological replicates recommended for RNA-Seq?",
        answer: "Biological replicates account for natural biological variance, providing the statistical power needed to accurately identify differentially expressed genes.",
      },
      {
        question: "What RNA quality is acceptable for library preparation?",
        answer: "Intact total RNA with high integrity (RIN) is preferred. Exact quantity and RIN thresholds will be confirmed by our lab based on your study specifications.",
      },
      {
        question: "How are bioinformatics and enrichment results shared?",
        answer: "You receive raw sequencing data alongside processed count matrices, publication-ready figures (PCA, volcano, heatmaps), and enrichment reports.",
      },
    ],
    relatedSlugs: ["single-cell-rna-seq-analysis", "whole-exome-genome-sequencing", "pangenome-analysis"],
  },
  {
    number: "05",
    slug: "single-cell-rna-seq-analysis",
    name: "Single-cell RNA-seq Data Analysis",
    type: "computational",
    tagline: "Analysis of single-cell RNA sequencing datasets.",
    Icon: Microscope,
    image: singleCellImage,
    width: 319,
    height: 304,
    description: "Analysis of single-cell RNA sequencing datasets.",
    overview: [
      "A data analysis service for datasets you already have.",
      "We process the data, group cells by their expression profiles and help you understand which cell types and states are present.",
    ],
    features: [
      "Quality control and filtering",
      "Normalisation and batch correction",
      "Clustering and UMAP visualisation",
      "Marker gene detection and cell-type annotation (optional trajectory analysis)",
    ],
    applications: [
      {
        title: "Tumour Microenvironment",
        description: "Deconvoluting cellular heterogeneity and immune infiltration in tumours.",
      },
      {
        title: "Immune Cell Profiling",
        description: "Characterizing distinct immune subsets, activation states and clonal phenotypes.",
      },
      {
        title: "Developmental Trajectories",
        description: "Mapping lineage branching and pseudotime differentiation dynamics.",
      },
      {
        title: "Rare Cell Populations",
        description: "Detecting stem, progenitor or resistant cell subpopulations.",
      },
    ],
    requirementsLabel: "Input data requirements",
    requirements: [
      "Raw reads (FASTQ) or a count matrix.",
      "Metadata describing samples, conditions and experimental batches.",
      "The species and the biological question.",
    ],
    deliverables: [
      "Processed dataset object (e.g. Seurat / SingleCellExperiment / AnnData)",
      "Publication-style figures (UMAP, t-SNE, violin plots, dot plots)",
      "Marker gene tables for annotated clusters",
      "Written methods and analytical results summary",
    ],
    faq: [
      {
        question: "What starting data formats are accepted for single-cell analysis?",
        answer: "We accept raw FASTQ sequencing files or pre-computed gene-cell count matrices (MEX, H5, TSV/CSV) along with comprehensive sample metadata.",
      },
      {
        question: "Can you perform trajectory and pseudotime inference?",
        answer: "Yes, trajectory analysis and pseudotime ordering are available to chart dynamic cellular differentiation transitions.",
      },
      {
        question: "How do I request this computational service?",
        answer: "Submit your dataset dimensions, sequencing chemistry, and study goals using the 'Request this service' button to receive an analytical plan.",
      },
    ],
    relatedSlugs: ["rna-seq", "pangenome-analysis", "whole-exome-genome-sequencing"],
  },
  {
    number: "06",
    slug: "16s-rrna-metagenome-sequencing",
    name: "16S rRNA Metagenome Sequencing",
    type: "lab",
    tagline: "Sequencing and analysis of 16S rRNA metagenomes.",
    Icon: Bug,
    image: metagenomeImage,
    width: 406,
    height: 287,
    description: "Sequencing and analysis of 16S rRNA metagenomes.",
    overview: [
      "Reads the 16S rRNA gene, which acts like a barcode for bacteria, to find out which microbes are present in a sample and in what proportion.",
      "Enables profiling of diverse microbial communities across environmental, industrial and clinical settings.",
    ],
    features: [
      "Amplicon sequencing of the 16S rRNA gene",
      "Taxonomic classification",
      "Alpha and beta diversity analysis",
      "Comparison between sample groups",
    ],
    applications: [
      {
        title: "Gut Microbiome Studies",
        description: "Assessing host-associated microbial communities and dysbiosis.",
      },
      {
        title: "Soil & Water Microbiology",
        description: "Characterizing environmental microbiomes across ecological gradients.",
      },
      {
        title: "Clinical Microbiome Research",
        description: "Correlating microbial diversity shifts with clinical health outcomes.",
      },
      {
        title: "Environmental Monitoring",
        description: "Tracking biological indicators and bioremediation efficacy over time.",
      },
    ],
    requirementsLabel: "Sample requirements",
    requirements: [
      "Extracted DNA or raw samples such as stool, soil, water or swabs.",
      "Contact us for details regarding preservation and amount.",
    ],
    deliverables: [
      "Raw reads (FASTQ)",
      "Feature / taxa abundance table (ASV / OTU table)",
      "Taxonomy bar plots and composition charts",
      "Alpha and beta diversity plots and statistical tests",
    ],
    faq: [
      {
        question: "Which hypervariable regions of the 16S gene can be targeted?",
        answer: "Standard workflows commonly target V3-V4 or V4 regions. Specific amplicon primer combinations can be arranged based on your target taxa.",
      },
      {
        question: "Can raw specimens like stool or soil be sent directly?",
        answer: "Yes, both extracted microbial DNA and properly stabilized raw samples (soil, water filters, stool, swabs) are accepted. Preservation protocols are confirmed upon inquiry.",
      },
      {
        question: "What statistical comparisons are provided?",
        answer: "We provide alpha diversity metrics (Shannon, Simpson, Chao1) and beta diversity ordination (PCoA, NMDS) with PERMANOVA group significance testing.",
      },
    ],
    relatedSlugs: ["whole-genome-metagenome", "whole-fungal-genome-sequencing", "phylogenetic-tree-construction"],
  },
  {
    number: "07",
    slug: "whole-genome-metagenome",
    name: "Whole Genome Metagenome",
    type: "lab",
    tagline: "Whole-genome metagenomic sequencing and analysis.",
    Icon: Layers,
    image: wholeGenomeMetagenomeImage,
    width: 305,
    height: 301,
    description: "Whole-genome metagenomic sequencing and analysis.",
    overview: [
      "Shotgun sequencing reads all the DNA in a mixed sample, not just one marker gene.",
      "It shows who is there and what genes they carry.",
    ],
    features: [
      "Species- and strain-level identification",
      "Functional gene profiling",
      "Detection of antibiotic resistance genes",
      "Assembly of genomes from the mix (MAGs)",
    ],
    applications: [
      {
        title: "Pathogen Detection",
        description: "Unbiased detection of bacterial, viral and eukaryotic pathogens.",
      },
      {
        title: "Resistome Studies",
        description: "Quantifying antimicrobial resistance genes and mobile genetic elements.",
      },
      {
        title: "Environmental Microbiomes",
        description: "Exploring metabolic capacity in agricultural and environmental systems.",
      },
      {
        title: "Microbial Discovery",
        description: "Reconstructing metagenome-assembled genomes (MAGs) of uncultured taxa.",
      },
    ],
    requirementsLabel: "Sample requirements",
    requirements: [
      "High-quality DNA extracted from stool, soil, water or other mixed samples.",
      "Contact us for details regarding required amount.",
    ],
    deliverables: [
      "Raw reads (FASTQ)",
      "Taxonomy and functional gene abundance tables",
      "Assembled contigs and metagenome-assembled genomes (MAGs)",
      "Comprehensive analytical summary report",
    ],
    faq: [
      {
        question: "How does shotgun metagenomics differ from 16S amplicon sequencing?",
        answer: "Shotgun metagenomics sequences all genomic DNA within a sample, providing species/strain resolution, functional metabolic profiling, and antimicrobial resistance detection.",
      },
      {
        question: "Can host DNA be filtered out before analysis?",
        answer: "Yes, computational decontamination is routinely performed to remove human, animal or plant host reads prior to taxonomic and functional profiling.",
      },
      {
        question: "How do I request a study proposal?",
        answer: "Click 'Request this service' with details on sample origins and sequencing depth goals, and our scientific team will reply promptly.",
      },
    ],
    relatedSlugs: ["16s-rrna-metagenome-sequencing", "whole-fungal-genome-sequencing", "pangenome-analysis"],
  },
  {
    number: "08",
    slug: "whole-fungal-genome-sequencing",
    name: "Whole Fungal Genome Sequencing",
    type: "lab",
    tagline: "Genome sequencing services for fungal research.",
    Icon: Sprout,
    image: fungalGenomeImage,
    width: 403,
    height: 297,
    description: "Genome sequencing services for fungal research.",
    overview: [
      "Sequences the complete genome of a fungal isolate to study its genes, identity and traits.",
      "Fungal cell walls are tough, so careful DNA extraction is part of the service.",
    ],
    features: [
      "De novo assembly or reference-based sequencing",
      "Gene prediction and functional annotation",
      "Species confirmation",
      "Detection of genes linked to pathogenicity or resistance",
    ],
    applications: [
      {
        title: "Taxonomic Classification",
        description: "Accurately identifying and classifying fungal species and strains.",
      },
      {
        title: "Pathogen Research",
        description: "Investigating plant and human fungal pathogens and virulence factors.",
      },
      {
        title: "Industrial & Agricultural Fungi",
        description: "Characterizing enzyme pathways and secondary metabolites in industrial strains.",
      },
      {
        title: "Comparative Genomics",
        description: "Synteny and evolutionary analysis across fungal taxonomic groups.",
      },
    ],
    requirementsLabel: "Sample requirements",
    requirements: [
      "Pure fungal culture or mycelium, or extracted DNA.",
      "Contact us for details regarding amount and shipping conditions.",
    ],
    deliverables: [
      "Raw reads (FASTQ)",
      "Assembled genome (FASTA)",
      "Structural and functional annotation files (GFF / GTF)",
      "Assembly quality statistics (N50, BUSCO)",
      "Comprehensive analytical summary report",
    ],
    faq: [
      {
        question: "Can ClinGene perform DNA extraction from difficult fungal mycelia?",
        answer: "Yes, specialized lysis and extraction protocols tailored for tough fungal cell walls are available as part of our laboratory service workflow.",
      },
      {
        question: "What quality metrics are evaluated on the assembled genome?",
        answer: "We assess contiguity (N50, L50), total genome size, GC content, and genome completeness using standard BUSCO benchmarks.",
      },
      {
        question: "How do I ship fungal cultures or extracted DNA?",
        answer: "Please reach out via the 'Request this service' button to receive safe packaging, biosafety compliance, and cold-chain shipping instructions.",
      },
    ],
    relatedSlugs: ["whole-genome-metagenome", "plant-genome-sequencing", "phylogenetic-tree-construction"],
  },
  {
    number: "09",
    slug: "pangenome-analysis",
    name: "Pangenome Analysis",
    type: "computational",
    tagline: "Comparative analysis across multiple genomes.",
    Icon: Network,
    image: pangenomeImage,
    width: 387,
    height: 331,
    description: "Comparative analysis across multiple genomes.",
    overview: [
      "Compares many genomes of the same species to separate genes shared by all (core) from genes found only in some (accessory).",
      "Shows how a species varies and adapts.",
    ],
    features: [
      "Core, accessory and unique gene identification",
      "Gene presence/absence matrix",
      "Pangenome size and openness estimates",
      "Links to phylogeny and traits",
    ],
    applications: [
      {
        title: "Population Studies",
        description: "Bacterial and fungal population structure and lineage differentiation.",
      },
      {
        title: "Virulence & Resistance",
        description: "Tracking the distribution of resistance and virulence genes across isolates.",
      },
      {
        title: "Crop & Plant Diversity",
        description: "Cataloging dispensable and core gene pools across plant accessions.",
      },
      {
        title: "Outbreak Investigation",
        description: "Resolving epidemiological transmission dynamics during disease outbreaks.",
      },
    ],
    requirementsLabel: "Input data requirements",
    requirements: [
      "Genome assemblies or annotation files for each strain (FASTA / GFF).",
      "Sample and strain metadata (isolation source, date, phenotype).",
    ],
    deliverables: [
      "Gene presence/absence matrix table",
      "Pangenome accumulation and distribution plots",
      "Annotated results tables for core, shell and cloud gene families",
      "Written methods and analytical summary",
    ],
    faq: [
      {
        question: "How many genomes are required for a meaningful pangenome analysis?",
        answer: "A pangenome analysis can be initiated with as few as 5-10 strains, though larger isolate collections provide more comprehensive insights into genome openness.",
      },
      {
        question: "What file formats are needed from my sequenced strains?",
        answer: "Assembled FASTA files or pre-annotated GFF files are accepted, along with phenotypic metadata (e.g. host, resistance profile, location).",
      },
      {
        question: "How do I request a consultation on pangenomics?",
        answer: "Submit your cohort size and biological objectives via 'Request this service', and our bioinformatics specialists will contact you promptly.",
      },
    ],
    relatedSlugs: ["phylogenetic-tree-construction", "whole-genome-metagenome", "protein-docking-molecular-dynamics"],
  },
  {
    number: "10",
    slug: "phylogenetic-tree-construction",
    name: "Phylogenetic Tree Construction",
    type: "computational",
    tagline: "Phylogenetic analysis and tree construction.",
    Icon: GitBranch,
    image: phylogeneticImage,
    width: 405,
    height: 295,
    description: "Phylogenetic analysis and tree construction.",
    overview: [
      "Builds an evolutionary tree showing how organisms or sequences are related to each other.",
      "Provides a robust evolutionary framework for taxonomic and functional analysis.",
    ],
    features: [
      "Sequence alignment and trimming",
      "Best-fit model selection",
      "Tree building (maximum likelihood, Bayesian or neighbour-joining)",
      "Support values and clean, publication-ready figures",
    ],
    applications: [
      {
        title: "Taxonomic Classification",
        description: "Species identification, nomenclature and systematic classification.",
      },
      {
        title: "Pathogen Evolution",
        description: "Tracing viral or bacterial mutation trajectories and divergence times.",
      },
      {
        title: "Gene Family Studies",
        description: "Investigating gene duplication, speciation and orthology relationships.",
      },
      {
        title: "Outbreak Analysis",
        description: "Inferring transmission clusters and phylogenetic relationships during outbreaks.",
      },
    ],
    requirementsLabel: "Input data requirements",
    requirements: [
      "Sequences in FASTA format (genes, markers, or genomes).",
      "Optional outgroup and sample metadata.",
    ],
    deliverables: [
      "Multiple sequence alignment file (FASTA / PHYLIP)",
      "Tree files (Newick / Nexus format)",
      "Publication-quality tree figures (circular, radial, or phylogram)",
      "Methods and model selection summary",
    ],
    faq: [
      {
        question: "Which tree construction algorithms are available?",
        answer: "We support Maximum Likelihood (e.g. IQ-TREE, RAxML), Bayesian inference, and Neighbor-Joining methods, chosen according to your dataset size and goals.",
      },
      {
        question: "Are branch support values calculated?",
        answer: "Yes, trees include bootstrap support values (e.g. ultrafast bootstrap) or posterior probabilities to quantify branch confidence.",
      },
      {
        question: "How can I submit my sequences for tree construction?",
        answer: "Click 'Request this service' to send your project details. Our team will coordinate sequence upload and model specifications.",
      },
    ],
    relatedSlugs: ["pangenome-analysis", "16s-rrna-metagenome-sequencing", "whole-fungal-genome-sequencing"],
  },
  {
    number: "11",
    slug: "plant-genome-sequencing",
    name: "Plant Genome Sequencing",
    type: "lab",
    tagline: "Genome sequencing services for plant research.",
    Icon: Leaf,
    image: plantGenomeImage,
    width: 406,
    height: 297,
    description: "Genome sequencing services for plant research.",
    overview: [
      "Sequences plant genomes for breeding, conservation and crop research.",
      "Plant tissue often contains compounds that interfere with DNA extraction, so extraction is handled carefully.",
    ],
    features: [
      "Whole genome sequencing and resequencing",
      "Genome assembly and annotation",
      "Variant discovery between varieties",
      "Marker development for breeding",
    ],
    applications: [
      {
        title: "Crop Improvement",
        description: "Breeding programs targeting yield, nutrition, and agronomic performance.",
      },
      {
        title: "Stress & Resistance Genes",
        description: "Pinpointing loci associated with drought, salinity, and pest resistance.",
      },
      {
        title: "Variety Identification",
        description: "Fingerprinting cultivar lines, landraces, and germplasm accessions.",
      },
      {
        title: "Plant Biodiversity",
        description: "Investigating endangered flora and ecological adaptation mechanisms.",
      },
    ],
    requirementsLabel: "Sample requirements",
    requirements: [
      "Fresh young leaf tissue, frozen or silica-dried tissue, or extracted DNA.",
      "Contact us for details regarding sample amount and shipping requirements.",
    ],
    deliverables: [
      "Raw reads (FASTQ)",
      "De novo assembly or aligned reads (BAM)",
      "Variant calls (VCF)",
      "Structural and functional annotation files",
      "Comprehensive analytical summary report",
    ],
    faq: [
      {
        question: "How do you handle secondary metabolites during plant DNA extraction?",
        answer: "We employ modified CTAB and polysaccharide-clearing protocols specifically optimized to remove polyphenols, tannins, and complex starches from plant tissue.",
      },
      {
        question: "Can resequencing be performed if a reference genome already exists?",
        answer: "Yes, whole-genome resequencing against an existing reference genome is commonly performed for variant calling and marker discovery across varieties.",
      },
      {
        question: "How should plant tissue samples be preserved for shipment?",
        answer: "Fresh young leaves on ice packs, flash-frozen tissue, or silica-gel dried leaf samples are accepted. Specific shipping protocols are confirmed upon inquiry.",
      },
    ],
    relatedSlugs: ["whole-fungal-genome-sequencing", "pangenome-analysis", "whole-genome-metagenome"],
  },
  {
    number: "12",
    slug: "protein-docking-molecular-dynamics",
    name: "Protein Docking & Molecular Dynamic Simulation",
    type: "computational",
    tagline: "Computational protein docking and molecular simulation.",
    Icon: Atom,
    image: proteinDockingImage,
    width: 431,
    height: 291,
    description: "Computational protein docking and molecular simulation.",
    overview: [
      "Uses computers to predict how a protein and a small molecule (or another protein) fit together.",
      "Simulates their movement over time to see whether the complex stays stable.",
    ],
    features: [
      "Protein-ligand and protein-protein docking",
      "Binding pose and score analysis",
      "Molecular dynamics simulation",
      "Stability analysis (RMSD, RMSF, hydrogen bonds) and optional binding free energy",
    ],
    applications: [
      {
        title: "Early Drug Discovery",
        description: "Virtual screening and rational identification of lead compounds.",
      },
      {
        title: "Candidate Screening",
        description: "Evaluating compound libraries against designated therapeutic targets.",
      },
      {
        title: "Mutation Impact Studies",
        description: "Studying how clinical or structural mutations affect drug binding affinities.",
      },
      {
        title: "Protein Function",
        description: "Unraveling allosteric mechanisms and macromolecular interaction dynamics.",
      },
    ],
    requirementsLabel: "Input data requirements",
    requirements: [
      "Protein structure (PDB format) or amino acid sequence.",
      "Ligand structures (SDF / MOL2) or a compound list.",
      "The target binding site, if known.",
    ],
    deliverables: [
      "Docking results with ranked binding poses and affinity scores",
      "Molecular dynamics simulation trajectories and coordinate files",
      "Analysis plots (RMSD, RMSF, Rg, hydrogen-bond timeline)",
      "Written analytical report with high-resolution structural figures",
    ],
    faq: [
      {
        question: "Can simulations be run if an experimental 3D structure is not in the PDB?",
        answer: "Yes, computational homology modeling or AlphaFold structural predictions can be constructed prior to docking and molecular dynamics.",
      },
      {
        question: "What simulation durations are standardly evaluated?",
        answer: "Standard production runs range from 50 ns to 200+ ns depending on the macromolecular system size and research objectives.",
      },
      {
        question: "How do I submit my protein and ligand targets for modeling?",
        answer: "Click 'Request this service' to send your target identifiers and questions. Our computational team will evaluate feasibility promptly.",
      },
    ],
    relatedSlugs: ["pangenome-analysis", "single-cell-rna-seq-analysis", "whole-exome-genome-sequencing"],
  },
];

export const servicesBySlug = Object.fromEntries(
  servicesData.map((service) => [service.slug, service])
);

export function getServiceBySlug(slug) {
  return servicesBySlug[slug] || null;
}

export default servicesData;

