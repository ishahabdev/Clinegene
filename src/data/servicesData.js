import {
  Atom,
  Boxes,
  Bug,
  Dna,
  FlaskConical,
  GitBranch,
  Layers,
  Leaf,
  Library,
  Lightbulb,
  Microscope,
  Network,
  Search,
  ShieldPlus,
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
import statisticalDataAnalysisImage from "../assets/services/cropped/statistical-data-analysis.webp";

// Optimized high-resolution WebP service assets
import geneticCounselingImage from "../assets/services/genetic-counseling-consultation.webp";
import panelSequencingImage from "../assets/services/panel-sequencing-targeted-gene-panel.webp";
import rnaSequencingNewImage from "../assets/services/rna-sequencing-transcriptome.webp";
import mdSimulationImage from "../assets/services/md-simulation-molecular-dynamics.webp";
import immunogenicityImage from "../assets/services/immunogenicity-analysis-antibody-antigen.webp";
import virtualScreeningImage from "../assets/services/virtual-screening-ligand-docking.webp";
import libraryGenerationImage from "../assets/services/ngs-library-generation.webp";
import molecularBiologyImage from "../assets/services/molecular-biology-pcr-gel.webp";

export const servicesData = [
  {
    number: "01",
    slug: "genetic-counseling",
    name: "Genetic Counseling",
    type: "lab",
    tagline: "Professional genetic evaluation, hereditary risk assessment, and family counseling.",
    Icon: Stethoscope,
    image: geneticCounselingImage,
    imageAlt: "Genetic counselor explaining a family pedigree chart to a couple at ClinGene",
    width: 800,
    height: 800,
    subServices: [
      { id: "prenatal-diagnosis", label: "Prenatal Diagnosis" },
      { id: "newborn-screening", label: "Newborn Screening" },
      { id: "genetic-diseases", label: "Genetic Diseases" },
      { id: "chromosomal-abnormalities", label: "Chromosomal Abnormalities" },
      { id: "hereditary-cancer", label: "Hereditary Cancer" },
    ],
    overview: [
    "Genetic counseling provides individuals, families, and referring healthcare providers with clinical insights into the medical, psychological, and familial implications of genetic conditions.",
    "Our clinical genetics team evaluates family pedigrees, interprets complex molecular and cytogenetic test results, and formulates clear, actionable risk management pathways.",
  ],
  features: [
    "Pedigree construction and familial inheritance risk assessment",
    "Comprehensive pre-test and post-test genetic consultations",
    "Specialized evaluation across prenatal, pediatric, oncology, and adult genetic indications",
    "Detailed clinical consultation documentation delivered to referring physicians",
  ],
  applications: [
    {
      title: "Prenatal & Reproductive Guidance",
      description: "Assisting prospective parents with carrier screening results, advanced maternal age considerations, and diagnostic options.",
    },
    {
      title: "Hereditary Cancer Risk Assessment",
      description: "Evaluating familial clusters of breast, ovarian, colorectal, and endocrine tumors to guide surveillance strategies.",
    },
    {
      title: "Rare & Pediatric Genetic Conditions",
      description: "Guiding diagnostic pathways for developmental delay, dysmorphic features, and suspected inborn errors of metabolism.",
    },
    {
      title: "Cardiogenetics, Neurogenetics & Other Genetic Diseases",
      description: "Interpreting inherited risk profiles for familial cardiomyopathies, channelopathies, ataxias, and early-onset neurodegeneration.",
    },
  ],
  requirementsLabel: "Consultation Prerequisites",
  requirements: [
    "Clinical summary notes or referral letter from attending physician",
    "Detailed family health history and medical background",
    "Prior genetic, cytogenetic, or biochemical test reports if available",
    "Relevant clinical imaging, pathology, or laboratory investigation records",
  ],
  deliverables: [
    "Comprehensive written genetic consultation summary report",
    "Annotated familial pedigree chart",
    "Evidence-based clinical surveillance and management recommendations",
    "Patient educational literature and physician follow-up recommendations",
  ],
  faq: [
    {
      question: "What is genetic counseling and who benefits from it?",
      answer: "Genetic counseling is a specialized clinical consultation that helps individuals understand how genetics impacts health, guiding informed decisions regarding genetic testing and preventive care.",
    },
    {
      question: "Is genetic counseling required before having a genetic test?",
      answer: "Pre-test counseling is strongly recommended to ensure patients understand the clinical scope, benefits, limitations, and potential familial implications of testing before proceeding.",
    },
    {
      question: "Can consultations be conducted via telehealth?",
      answer: "Yes, ClinGene offers secure remote telehealth consultations for patients and clinicians nationwide, as well as in-person appointments at our Islamabad laboratory facility.",
    },
  ],
  relatedSlugs: ["whole-exome-genome-sequencing", "panel-sequencing", "sanger-sequencing"],
},
{
    number: "02",
    slug: "whole-exome-genome-sequencing",
    name: "Clinical whole exome/genome sequencing",
    type: "lab",
    tagline: "Comprehensive sequencing for genomic research and diagnostics.",
    Icon: Dna,
    image: exomeSequencingImage,
    imageAlt: "Next-generation sequencing sequencer and automated flow cell running whole exome and genome sequencing at ClinGene",
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
    number: "03",
    slug: "panel-sequencing",
    name: "Panel sequencing",
    type: "lab",
    tagline: "High-depth targeted next-generation sequencing for focused disease gene panels.",
    Icon: TestTubes,
    image: panelSequencingImage,
    imageAlt: "Scientist loading samples next to a sequencer for targeted gene panel sequencing at ClinGene",
    width: 800,
    height: 754,
    description: "Deep-coverage targeted gene panels for oncology, cardiology, neurology, and rare inherited conditions.",
    overview: [
      "Targeted panel sequencing enriches curated subsets of clinically relevant genes, providing extraordinary coverage depth and sensitivity for single-nucleotide variants, insertions/deletions, and copy number variations.",
      "By focusing sequencing throughput on actionable loci, gene panels deliver an economical, rapid, and diagnostically targeted solution for clinical diagnostics and cohort screening.",
    ],
    features: [
      "Curated gene panels covering established hereditary and somatic disease genes",
      "High uniform coverage depth (>100x-500x) for reliable low-frequency variant detection",
      "Comprehensive bioinformatic variant calling and ACMG/AMP clinical annotation",
      "Compatible with low-input genomic DNA and FFPE tissue samples",
    ],
    applications: [
      {
        title: "Hereditary Oncology Panels",
        description: "Targeted analysis of tumor suppressor and DNA repair genes including BRCA1, BRCA2, TP53, and Lynch syndrome loci.",
      },
      {
        title: "Cardiogenetics Panels",
        description: "Screening nuclear genes implicated in hypertrophic, dilated, and arrhythmogenic right ventricular cardiomyopathies.",
      },
      {
        title: "Neuromuscular & Epilepsy Panels",
        description: "Focused genetic panels for developmental and epileptic encephalopathies, ataxias, and muscular dystrophies.",
      },
      {
        title: "Somatic Actionable Hotspot Panels",
        description: "Profiling key actionable therapeutic mutations in solid tumors and hematological malignancies.",
      },
    ],
    requirementsLabel: "Sample Requirements",
    requirements: [
      "Purified genomic DNA (≥200 ng, OD 260/280: 1.8-2.0)",
      "Whole blood collected in EDTA tubes (3-5 mL, shipped at 4°C)",
      "FFPE tissue curls or unstained slides with verified tumor cell content",
      "Completed requisition form detailing clinical indication and requested panel",
    ],
    deliverables: [
      "Demultiplexed FASTQ sequencing reads (MD5 checksum verified)",
      "Aligned BAM alignment files and indexed VCF variant call files",
      "Clinical variant annotation report with ACMG/AMP classification",
      "Run quality control and targeted region coverage statistics report",
    ],
    faq: [
      {
        question: "How does panel sequencing compare to whole exome sequencing?",
        answer: "Panel sequencing focuses strictly on genes known to cause specific conditions, delivering higher read depth at lower cost, whereas whole exome sequencing captures all ~20,000 coding genes.",
      },
      {
        question: "Can customized gene panels be designed for research studies?",
        answer: "Yes, ClinGene designs bespoke target enrichment panels tailored to specific research cohorts and gene discovery pathways.",
      },
      {
        question: "What turnaround time is typical for panel sequencing?",
        answer: "Standard clinical and research panels are processed within 2 to 4 weeks from sample qualification.",
      },
    ],
    relatedSlugs: ["whole-exome-genome-sequencing", "sanger-sequencing", "genetic-counseling"],
  },
{
    number: "04",
    slug: "sanger-sequencing",
    name: "Sanger Sequencing",
    type: "lab",
    tagline: "Targeted DNA sequencing and sequence analysis.",
    Icon: TestTubes,
    image: sangerImage,
    imageAlt: "Sanger DNA sequencing electropherogram with clean fluorescence chromatogram peaks at ClinGene",
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
    number: "05",
    slug: "rna-seq",
    name: "RNA-Sequencing/Transcriptome Sequencing",
    type: "lab",
    tagline: "RNA sequencing for gene expression research.",
    Icon: FlaskConical,
    image: rnaSequencingNewImage,
    imageAlt: "Gene expression heatmap and volcano plot for RNA sequencing analysis at ClinGene",
    width: 800,
    height: 754,
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
    number: "06",
    slug: "whole-genome-metagenome",
    name: "Metagenome Sequencing",
    type: "lab",
    tagline: "Whole-genome metagenomic sequencing and analysis.",
    Icon: Layers,
    image: wholeGenomeMetagenomeImage,
    imageAlt: "Scientist examining bacterial cultures for metagenome sequencing at ClinGene",
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
    number: "07",
    slug: "phylogenetic-tree-construction",
    name: "Phylogenetic Tree construction & analysis",
    type: "computational",
    tagline: "Phylogenetic analysis and tree construction.",
    Icon: GitBranch,
    image: phylogeneticImage,
    imageAlt: "High-resolution phylogenetic tree diagram with evolutionary branch lengths at ClinGene",
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
    number: "08",
    slug: "pangenome-analysis",
    name: "Pangenome Analysis",
    type: "computational",
    tagline: "Comparative analysis across multiple genomes.",
    Icon: Network,
    image: pangenomeImage,
    imageAlt: "Circular comparative genomic map displaying core and accessory pangenome loci at ClinGene",
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
    number: "09",
    slug: "protein-docking-molecular-dynamics",
    name: "MD Simulation",
    type: "computational",
    tagline: "Computational protein docking and molecular simulation.",
    Icon: Atom,
    image: mdSimulationImage,
    imageAlt: "Molecular dynamics simulation of a membrane protein surrounded by water molecules and ions",
    width: 800,
    height: 756,
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
  {
    number: "10",
    slug: "protein-modeling",
    name: "Protein modeling",
    type: "computational",
    tagline: "Accurate 3D protein structure prediction, homology modeling, and structural refinement.",
    Icon: Boxes,
    image: proteinDockingImage,
    imageAlt: "High-resolution 3D ribbon diagram and secondary structure model of a target protein at ClinGene",
    width: 431,
    height: 291,
    description: "In silico tertiary structure prediction using state-of-the-art homology and deep-learning protocols.",
    overview: [
      "Protein modeling generates accurate three-dimensional atomic structures for biological targets lacking experimental X-ray crystallography or cryo-EM coordinates, empowering drug discovery and mechanistic biology.",
      "ClinGene integrates template-based homology modeling, threading, and advanced deep-learning methodologies (AlphaFold, ESMFold) with molecular mechanics energy minimization to produce publication-grade 3D models.",
    ],
    features: [
      "Deep learning-driven and template-based tertiary structure prediction",
      "Loop refinement, rotamer optimization, and force-field energy minimization",
      "Rigorous stereochemical quality validation (PROCHECK, ERRAT, Verify3D, Ramachandran)",
      "Active site identification, pocket druggability scoring, and electrostatic surface mapping",
    ],
    applications: [
      {
        title: "Target Structure Determination",
        description: "Elucidating 3D conformations of novel viral, bacterial, and human therapeutic proteins.",
      },
      {
        title: "Clinical Mutation Impact Analysis",
        description: "Assessing structural perturbation, thermodynamic stability shifts, and disruption of active residues caused by missense variants.",
      },
      {
        title: "Engineered Biocatalyst Design",
        description: "Guiding rational mutagenesis and active site redesign for industrial enzymes and therapeutic proteins.",
      },
      {
        title: "Structure-Based Drug Design",
        description: "Constructing high-confidence receptor coordinates for virtual screening and docking campaigns.",
      },
    ],
    requirementsLabel: "Input Requirements",
    requirements: [
      "Target amino acid sequence in standard FASTA format",
      "Known homologous template structures (PDB codes) if specific templates are desired",
      "Experimental information regarding cofactors, metal ions, or oligomeric state",
      "Specific missense mutation coordinates or isoform variants of interest",
    ],
    deliverables: [
      "Refined atomic coordinate structure files in PDB and mmCIF formats",
      "Stereochemical validation report (Ramachandran plot, Z-score, ERRAT)",
      "Structural alignment and C-alpha RMSD comparison against homologous templates",
      "High-resolution ray-traced structural figures and binding pocket annotations",
    ],
    faq: [
      {
        question: "What sequence information is needed to begin protein modeling?",
        answer: "Only the primary amino acid sequence in FASTA format is required, along with any known constraints or biological cofactors.",
      },
      {
        question: "How is the reliability of a predicted protein model validated?",
        answer: "We apply rigorous stereochemical and thermodynamic assessment tools including Ramachandran analysis, ERRAT, and Verify3D to ensure biophysical plausibility.",
      },
      {
        question: "Can multimeric protein complexes be modeled?",
        answer: "Yes, we construct homo-multimeric and hetero-multimeric complexes using advanced multimer deep-learning protocols and protein-protein docking.",
      },
    ],
    relatedSlugs: ["protein-docking-molecular-dynamics", "virtual-screening", "immunogenicity-analysis"],
  },
  {
    number: "11",
    slug: "immunogenicity-analysis",
    name: "Immunogenicity Analysis",
    type: "computational",
    tagline: "Epitope prediction, MHC binding affinity profiling, and immunogenicity risk assessment.",
    Icon: ShieldPlus,
    image: immunogenicityImage,
    imageAlt: "Antibodies binding to a virus-like particle for immunogenicity analysis",
    width: 800,
    height: 755,
    description: "In silico computational evaluation of immune reactivity, epitope binding, and antigenicity.",
    overview: [
      "Immunogenicity analysis evaluates the propensity of biotherapeutics, recombinant proteins, and peptide antigens to trigger adaptive immune responses in human populations.",
      "Using validated computational immunoinformatics algorithms, ClinGene predicts linear and conformational B-cell epitopes, MHC Class I and Class II T-cell binding affinities, and global population coverage percentiles.",
    ],
    features: [
      "MHC Class I and Class II peptide-binding affinity prediction across global HLA alleles",
      "Conformational and linear B-cell epitope prediction and surface accessibility profiling",
      "Immunogenic risk scoring and de-immunization hotspot identification",
      "Population coverage calculations using curated multi-ethnic HLA frequency databases",
    ],
    applications: [
      {
        title: "Subunit Vaccine Construct Design",
        description: "Engineering multi-epitope peptide and mRNA vaccine constructs for pathogens and cancer neoantigens.",
      },
      {
        title: "Biotherapeutic De-Immunization",
        description: "Identifying and modifying immunogenic CD4+ T-cell epitopes in therapeutic antibodies and enzymes.",
      },
      {
        title: "Allergenicity Risk Assessment",
        description: "Screening novel food proteins, agricultural traits, and industrial enzymes for cross-reactive allergenicity.",
      },
      {
        title: "Tumor Neoantigen Ranking",
        description: "Prioritizing patient-specific somatic neoepitopes for personalized cancer immunotherapy.",
      },
    ],
    requirementsLabel: "Input Data",
    requirements: [
      "Target protein or peptide sequences in standard FASTA format",
      "Target population demographic profiles or prioritized HLA allele lists",
      "3D structural coordinates (PDB format) for conformational B-cell epitope prediction",
      "Context of application (vaccine engineering vs. biotherapeutic de-immunization)",
    ],
    deliverables: [
      "Tabular epitope binding affinity predictions with IC50 percentiles",
      "Cumulative global and regional HLA population coverage statistics",
      "3D mapped epitope visualizations on target protein structures",
      "Actionable residue mutation recommendations for de-immunization or immunogenicity enhancement",
    ],
    faq: [
      {
        question: "Which HLA alleles are evaluated during immunogenicity screening?",
        answer: "We screen against internationally recognized reference panels of high-frequency HLA Class I and Class II alleles, with custom allele panels available for regional cohorts.",
      },
      {
        question: "Can both T-cell and B-cell epitopes be analyzed?",
        answer: "Yes, our computational pipeline integrates comprehensive algorithms for both T-cell (MHC-I and MHC-II) and B-cell (linear and conformational) epitope discovery.",
      },
      {
        question: "How does in silico immunogenicity assessment save drug development costs?",
        answer: "It flags immunogenic liabilities early in preclinical optimization, allowing targeted protein engineering before expensive in vivo and clinical testing.",
      },
    ],
    relatedSlugs: ["protein-modeling", "virtual-screening", "protein-docking-molecular-dynamics"],
  },
  {
    number: "12",
    slug: "virtual-screening",
    name: "Virtual Screening",
    type: "computational",
    tagline: "High-throughput in silico screening of compound libraries against macromolecular targets.",
    Icon: Search,
    image: virtualScreeningImage,
    imageAlt: "Drug-like molecule docking into a protein binding pocket for virtual screening",
    width: 800,
    height: 754,
    description: "Structure- and ligand-based virtual screening to discover potent bioactive lead molecules.",
    overview: [
      "Virtual screening accelerates early drug discovery by rapidly evaluating thousands to millions of small molecules in silico against validated biological targets, dramatically reducing experimental timelines and reagent costs.",
      "ClinGene utilizes high-performance structure-based molecular docking and ligand-based pharmacophore screening, combined with stringent ADMET and drug-likeness filters, to prioritize lead compounds.",
    ],
    features: [
      "Structure-based molecular docking screening against crystallographic or modeled active sites",
      "Ligand-based 3D pharmacophore modeling, shape matching, and fingerprint similarity screening",
      "Comprehensive physicochemical and ADMET profiling (Lipinski Rule of 5, toxicity filters)",
      "Consensus scoring, free energy re-scoring, and binding pose clustering",
    ],
    applications: [
      {
        title: "Novel Lead Compound Discovery",
        description: "Screening commercial and diverse compound libraries against newly validated drug targets.",
      },
      {
        title: "Drug Repurposing Campaigns",
        description: "Screening approved and clinical-stage pharmacophores against novel therapeutic indications.",
      },
      {
        title: "Natural Product Database Mining",
        description: "Identifying bioactive scaffolds and natural product derivatives with high target selectivity.",
      },
      {
        title: "Fragment-Based Hit Optimization",
        description: "Growing and linking low-molecular-weight chemical fragments within target binding pockets.",
      },
    ],
    requirementsLabel: "Project Inputs",
    requirements: [
      "Target receptor 3D coordinate structure file (PDB or mmCIF)",
      "Binding pocket definition coordinates or reference co-crystallized ligand",
      "Chemical library specifications (custom SDF collection or curated vendor libraries)",
      "Target pharmacokinetic, solubility, or drug-likeness constraint parameters",
    ],
    deliverables: [
      "Ranked list of top candidate lead compounds with binding affinity energy scores",
      "Comprehensive ADMET, toxicity, and physicochemical property profiling data",
      "3D structural interaction visualizations showing critical binding contacts",
      "Procurement-ready chemical IDs and vendor catalog references for wet-lab validation",
    ],
    faq: [
      {
        question: "How large a chemical library can be virtually screened?",
        answer: "Our computational architecture supports screening from focused collections of hundreds of compounds to multi-million commercial chemical libraries.",
      },
      {
        question: "Can virtual screening be conducted if no crystal structure is available?",
        answer: "Yes, high-confidence AlphaFold or homology models can be utilized for structure-based docking, or ligand-based 3D pharmacophore models can be deployed.",
      },
      {
        question: "How are computational false positives filtered out?",
        answer: "We apply consensus scoring across independent scoring functions, desolvation penalty calculations, and post-docking molecular dynamics stability simulations.",
      },
    ],
    relatedSlugs: ["protein-docking-molecular-dynamics", "protein-modeling", "immunogenicity-analysis"],
  },
  {
    number: "13",
    slug: "library-generation",
    name: "Library generation",
    type: "lab",
    tagline: "High-quality next-generation sequencing library preparation across diverse sample types.",
    Icon: Library,
    image: libraryGenerationImage,
    imageAlt: "Multichannel pipette dispensing samples into a 96-well plate for NGS library preparation at ClinGene",
    width: 800,
    height: 754,
    description: "Quality-assured NGS library preparation for genomic, transcriptomic, and targeted applications.",
    overview: [
      "Library generation is the critical prerequisite for high-throughput sequencing. High-efficiency fragmentation, adapter ligation, and low-bias amplification ensure uniform coverage and maximal data fidelity.",
      "ClinGene provides standardized and customized NGS library preparation workflows for Illumina, MGI, and long-read platforms, supporting genomic DNA, total RNA, PCR amplicons, and challenging low-input or degraded samples.",
    ],
    features: [
      "Enzymatic and mechanical shearing fragmentation protocols with tight size selection",
      "Stranded RNA-Seq library construction with poly-A selection or rRNA depletion",
      "Specialized protocols for low-input DNA and cell-free DNA (cfDNA)",
      "Comprehensive quality validation using Bioanalyzer, TapeStation, and fluorometric assays",
    ],
    applications: [
      {
        title: "Whole Genome & Exome Libraries",
        description: "High-yield dual-indexed library generation for microbial, plant, animal, and human genomes.",
      },
      {
        title: "Transcriptome & Gene Expression Libraries",
        description: "Directional RNA-Seq libraries for differential gene expression, novel transcript, and splicing studies.",
      },
      {
        title: "Targeted Amplicon Libraries",
        description: "Multi-amplicon library preparation for molecular epidemiology and disease surveillance.",
      },
      {
        title: "Metagenomic & Environmental Libraries",
        description: "High-complexity metagenomic DNA libraries from clinical microbiomes, soil, and water samples.",
      },
    ],
    requirementsLabel: "Sample Input Requirements",
    requirements: [
      "Genomic DNA (≥50-100 ng recommended; low-input protocols available down to 1 ng)",
      "Total RNA (RIN ≥ 7.0 for standard mRNA; low-RIN protocols available for FFPE/degraded RNA)",
      "Fluorometric quantification (Qubit) and purity ratios (OD 260/280: 1.8-2.0)",
      "Sample buffer in nuclease-free water or 10 mM Tris-HCl (pH 8.0)",
    ],
    deliverables: [
      "Ready-to-sequence dual-indexed NGS library pools",
      "Bioanalyzer / TapeStation electropherogram size distribution profiles",
      "Absolute library concentration measurements via Qubit and qPCR",
      "Quality assurance certificate and adapter index barcode assignment manifest",
    ],
    faq: [
      {
        question: "Can ClinGene prepare libraries from low-yield or degraded specimens?",
        answer: "Yes, we utilize specialized low-input and repair protocols optimized for nanogram-level DNA and degraded RNA from clinical biopsies and FFPE blocks.",
      },
      {
        question: "Which sequencing platform adapters are supported?",
        answer: "We support industry-standard dual-indexed adapters compatible with Illumina, MGI/DNBSEQ, and Oxford Nanopore platforms.",
      },
      {
        question: "Can library preparation be ordered as a standalone service?",
        answer: "Yes, clients can submit nucleic acid samples solely for library generation and receive certified, ready-to-sequence library pools.",
      },
    ],
    relatedSlugs: ["whole-exome-genome-sequencing", "rna-seq", "sanger-sequencing"],
  },
  {
    number: "14",
    slug: "molecular-biology-services",
    name: "Molecular Biology Services",
    type: "lab",
    tagline: "Comprehensive routine and specialized wet-lab molecular biology services.",
    Icon: Microscope,
    image: molecularBiologyImage,
    imageAlt: "Gloved hand holding a PCR tube strip in front of a gel electrophoresis tray at ClinGene",
    width: 800,
    height: 800,
    description: "Bench-level nucleic acid isolation, PCR assays, cloning, and molecular analysis.",
    overview: [
      "ClinGene's molecular biology services provide biomedical researchers, diagnostic facilities, and academic institutions with dependable bench-level wet-lab capabilities executed under strict quality standards.",
      "From high-purity DNA and RNA extraction across complex biological matrices to qualitative PCR, cloning, vector construction, and quantitative real-time PCR (qPCR), our wet-lab facility delivers reproducible experimental results.",
    ],
    features: [
      "High-yield DNA/RNA extraction from blood, tissue, FFPE, plants, microbes, and environmental samples",
      "Qualitative PCR amplification and Real-Time quantitative PCR (qPCR) assays",
      "Molecular cloning, plasmid vector construction, and bacterial transformation",
      "Fluorometric, spectrophotometric, and electrophoretic nucleic acid quality profiling",
    ],
    applications: [
      {
        title: "Gene Expression & Validation",
        description: "Real-time qPCR validation of RNA-Seq findings, biomarker quantification, and pathway analysis.",
      },
      {
        title: "Pathogen Screening & Surveillance",
        description: "Molecular detection of bacterial, viral, and fungal targets in research and clinical specimens.",
      },
      {
        title: "Recombinant DNA Workflows",
        description: "Constructing expression plasmids, site-directed mutagenesis, and recombinant verification.",
      },
      {
        title: "Bio-Sample Archival & Banking",
        description: "Standardized extraction and cryogenic preservation of high-integrity DNA and RNA cohorts.",
      },
    ],
    requirementsLabel: "Specimen Guidelines",
    requirements: [
      "Biological specimens transported under validated cold-chain conditions (ice packs or dry ice)",
      "Tissue samples fresh-frozen or stabilized in RNAlater or 100% molecular-grade ethanol",
      "Whole blood collected in EDTA anticoagulant tubes",
      "Completed sample manifest specifying organism, tissue type, and downstream objectives",
    ],
    deliverables: [
      "Purified DNA or RNA aliquots with documented concentration and purity metrics",
      "qPCR amplification curves, cycle threshold (Ct) values, and normalized fold-change data",
      "Electrophoresis gel documentation and spectrophotometric quality reports",
      "Detailed laboratory bench protocol documentation and methodology summaries",
    ],
    faq: [
      {
        question: "What types of biological samples can be processed?",
        answer: "We process whole blood, buffy coats, human and animal tissues, plant leaves and seeds, fungal mycelia, bacterial pellets, and environmental swabs.",
      },
      {
        question: "Do you offer custom PCR primer design and optimization?",
        answer: "Yes, our molecular biology team designs, synthesizes, and empirically optimizes PCR and qPCR primer/probe sets for specific targets.",
      },
      {
        question: "How are extracted samples returned or stored?",
        answer: "Samples can be securely stored at -80°C in our laboratory, delivered via temperature-monitored courier, or transitioned directly into sequencing pipelines.",
      },
    ],
    relatedSlugs: ["sanger-sequencing", "library-generation", "whole-exome-genome-sequencing"],
  },
  {
    number: "15",
    slug: "project-design",
    name: "Project Design",
    type: "computational",
    tagline: "Strategic experimental design, statistical power calculation, and platform selection.",
    Icon: Lightbulb,
    image: statisticalDataAnalysisImage,
    imageAlt: "Genomic experimental workflow chart, statistical power curves, and project milestones at ClinGene",
    width: 547,
    height: 309,
    description: "Expert scientific consultation to optimize sequencing design, cohort sizing, and analytical strategy.",
    overview: [
      "Rigorous experimental design is the cornerstone of statistically sound, biologically impactful, and cost-efficient genomic investigations.",
      "ClinGene partners with principal investigators, clinicians, and biotechnology innovators from study conception, providing consultative advisory on cohort sizing, sequencing platform choice, depth optimization, and bioinformatic pipelines.",
    ],
    features: [
      "Statistical power analysis and cohort sample size determination",
      "Sequencing platform (short-read vs. long-read) and coverage depth optimization",
      "Multi-omics integration roadmapping (genomics, transcriptomics, metagenomics)",
      "Grant methodology formulation and budget-aligned milestone planning",
    ],
    applications: [
      {
        title: "Grant Proposal Methodology",
        description: "Drafting scientifically robust experimental designs and statistical justifications for major research funding bodies.",
      },
      {
        title: "Clinical Cohort Studies",
        description: "Structuring family trio, case-control, and population cohort studies for inherited and complex diseases.",
      },
      {
        title: "Agricultural & Microbial Programs",
        description: "Establishing sampling frameworks and comparative genomics strategies for plant and microbial research.",
      },
      {
        title: "Translational Biomarker Discovery",
        description: "Designing phased multi-stage discovery and clinical validation pipelines for molecular biomarkers.",
      },
    ],
    requirementsLabel: "Consultation Inputs",
    requirements: [
      "Primary research hypothesis and target biological questions",
      "Organism specifications, available sample types, and known biological constraints",
      "Preliminary data, pilot findings, or reference publications if available",
      "Target timeline, publication objectives, and funding framework",
    ],
    deliverables: [
      "Comprehensive Project Design Document detailing experimental architecture",
      "Statistical power calculations and cohort sample size recommendations",
      "Platform, sequencing depth, and bioinformatics pipeline specifications",
      "Itemized milestone roadmap and budget optimization framework",
    ],
    faq: [
      {
        question: "When should project design consultation be initiated?",
        answer: "Engaging at the project conception or grant drafting stage ensures that sample collection and sizing meet necessary statistical power requirements.",
      },
      {
        question: "Can ClinGene assist with writing grant methodology sections?",
        answer: "Yes, our senior scientists draft detailed technical methodology sections and power analysis justifications tailored for funding applications.",
      },
      {
        question: "Is project design consultation available for industry partners?",
        answer: "Yes, we advise biotechnology and pharmaceutical partners on assay design, preclinical sequencing pipelines, and exploratory biomarker endpoints.",
      },
    ],
    relatedSlugs: ["whole-exome-genome-sequencing", "rna-seq", "pangenome-analysis"],
  },
];

export const legacyServices = [
{
    number: "01",
    slug: "clinical-genetic-testing",
    name: "Clinical Genetic Testing",
    type: "lab",
    tagline: "Genetic testing for clinical and research needs.",
    Icon: Stethoscope,
    image: clinicalTestingImage,
    imageAlt: "Targeted medical genetic testing and diagnostic screening at ClinGene",
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
    deliverablesNote: "Genetic counseling is recommended before and after testing.",
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
    number: "05",
    slug: "single-cell-rna-seq-analysis",
    name: "Single-cell RNA-seq Data Analysis",
    type: "computational",
    tagline: "Analysis of single-cell RNA sequencing datasets.",
    Icon: Microscope,
    image: singleCellImage,
    imageAlt: "Single-cell transcriptomics UMAP cluster plot at ClinGene",
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
    imageAlt: "16S rRNA amplicon sequencing and microbial community taxonomic chart at ClinGene",
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
    number: "08",
    slug: "whole-fungal-genome-sequencing",
    name: "Whole Fungal Genome Sequencing",
    type: "lab",
    tagline: "Genome sequencing services for fungal research.",
    Icon: Sprout,
    image: fungalGenomeImage,
    imageAlt: "Whole fungal genome sequencing assembly and secondary metabolite analysis at ClinGene",
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
    number: "11",
    slug: "plant-genome-sequencing",
    name: "Plant Genome Sequencing",
    type: "lab",
    tagline: "Genome sequencing services for plant research.",
    Icon: Leaf,
    image: plantGenomeImage,
    imageAlt: "Plant genome de novo sequencing and polyploid agricultural genetics at ClinGene",
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
];

export const allServices = [...servicesData, ...legacyServices];

export const servicesBySlug = Object.fromEntries([
  ...servicesData.map((service) => [service.slug, service]),
  ...legacyServices.map((service) => [service.slug, service]),
  // Backward compatibility alias for metagenome-sequencing and genetic counselling
  ["metagenome-sequencing", servicesData.find((s) => s.slug === "whole-genome-metagenome")],
  ["genetic-counselling", servicesData.find((s) => s.slug === "genetic-counseling" || s.slug === "genetic-counselling")],
  ["genetic-counseling", servicesData.find((s) => s.slug === "genetic-counseling" || s.slug === "genetic-counselling")],
]);

export function getServiceBySlug(slug) {
  return servicesBySlug[slug] || null;
}

export default servicesData;
