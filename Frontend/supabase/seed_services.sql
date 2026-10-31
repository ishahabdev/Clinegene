-- ClinGene Static Services Seed Data
-- Only INSERT statements into public.services with status 'published'
-- Total services: 20

INSERT INTO public.services (
    title,
    slug,
    subtitle,
    category,
    service_type,
    pricing_display,
    short_description,
    overview,
    features,
    icon,
    image_url,
    sample_type,
    turnaround_time,
    report_format,
    requisition_form_url,
    status,
    sort_order
) VALUES
(
    'Genetic Counseling',
    'genetic-counseling',
    'Professional genetic evaluation, hereditary risk assessment, and family counseling.',
    'Clinical Diagnostics',
    'lab',
    NULL,
    'Professional genetic evaluation, hereditary risk assessment, and family counseling.',
    'Genetic counseling provides individuals, families, and referring healthcare providers with clinical insights into the medical, psychological, and familial implications of genetic conditions.

Our clinical genetics team evaluates family pedigrees, interprets complex molecular and cytogenetic test results, and formulates clear, actionable risk management pathways.',
    ARRAY['Pedigree construction and familial inheritance risk assessment', 'Comprehensive pre-test and post-test genetic consultations', 'Specialized evaluation across prenatal, pediatric, oncology, and adult genetic indications', 'Detailed clinical consultation documentation delivered to referring physicians'],
    'Stethoscope',
    '/assets/services/genetic-counseling-consultation.webp',
    'Clinical referral, medical records, or family pedigree history',
    '3–5 business days',
    'Clinical genetic consultation letter with risk assessment summary',
    NULL,
    'published',
    1
),
(
    'Clinical whole exome/genome sequencing',
    'whole-exome-genome-sequencing',
    'Comprehensive sequencing for genomic research and diagnostics.',
    'Clinical Diagnostics',
    'lab',
    NULL,
    'Comprehensive sequencing for genomic research and diagnostics.',
    'Whole exome sequencing (WES) reads the protein-coding regions of the genome, where most known disease-causing variants are found.

Whole genome sequencing (WGS) reads the entire genome, including non-coding regions and large structural changes.',
    ARRAY['Genome-wide variant discovery', 'SNV, indel and (WGS) structural variant calling', 'Variant annotation and filtering', 'Optional family (trio) analysis'],
    'Dna',
    '/assets/services/cropped/whole-exome-genome-sequencing.webp',
    'High-quality genomic DNA (≥1 µg) or whole blood in EDTA (3–5 mL)',
    '14–21 business days',
    'Full clinical genomic diagnostic report (PDF) & indexed VCF / BAM files',
    NULL,
    'published',
    2
),
(
    'Panel sequencing',
    'panel-sequencing',
    'High-depth targeted next-generation sequencing for focused disease gene panels.',
    'Clinical Diagnostics',
    'lab',
    NULL,
    'High-depth targeted next-generation sequencing for focused disease gene panels.',
    'Targeted panel sequencing enriches curated subsets of clinically relevant genes, providing extraordinary coverage depth and sensitivity for single-nucleotide variants, insertions/deletions, and copy number variations.

By focusing sequencing throughput on actionable loci, gene panels deliver an economical, rapid, and diagnostically targeted solution for clinical diagnostics and cohort screening.',
    ARRAY['Curated gene panels covering established hereditary and somatic disease genes', 'High uniform coverage depth (>100x-500x) for reliable low-frequency variant detection', 'Comprehensive bioinformatic variant calling and ACMG/AMP clinical annotation', 'Compatible with low-input genomic DNA and FFPE tissue samples'],
    'TestTubes',
    '/assets/services/panel-sequencing.webp',
    'Peripheral blood (EDTA), purified DNA, or FFPE tissue',
    '10–14 business days',
    'Comprehensive clinical report (PDF) with ACMG variant classification',
    NULL,
    'published',
    3
),
(
    'Sanger Sequencing',
    'sanger-sequencing',
    'Targeted DNA sequencing and sequence analysis.',
    'Clinical Diagnostics',
    'lab',
    NULL,
    'Targeted DNA sequencing and sequence analysis.',
    'A reliable method for reading a specific stretch of DNA.

Ideal for short, defined targets where accuracy matters.',
    ARRAY['Sequencing of PCR products and plasmids', 'Forward and reverse reads', 'Quality-checked chromatograms', 'Sequence alignment against a reference'],
    'TestTubes',
    '/assets/services/cropped/sanger-sequencing.webp',
    'Purified PCR product (≥10 ng/µL) or plasmid DNA with specific primers',
    '2–3 business days',
    'Standard AB1 electropherogram chromatogram traces and FASTA alignment report',
    NULL,
    'published',
    4
),
(
    'RNA-Sequencing/Transcriptome Sequencing',
    'rna-seq',
    'RNA sequencing for gene expression research.',
    'Genomics & Sequencing',
    'lab',
    NULL,
    'RNA sequencing for gene expression research.',
    'Measures which genes are active and how strongly in a sample.

Compares conditions such as healthy vs diseased or treated vs untreated.',
    ARRAY['Differential gene expression analysis', 'Transcript and isoform analysis', 'Detection of novel transcripts and gene fusions (optional)', 'Pathway and gene-set enrichment'],
    'FlaskConical',
    '/assets/services/rna-sequencing-transcriptome.webp',
    'Total RNA (RIN ≥ 7.0, ≥500 ng), fresh frozen tissue, or cell pellets',
    '15–20 business days',
    'Differential expression counts matrix, PCA clustering & pathway enrichment report',
    NULL,
    'published',
    5
),
(
    'Metagenome Sequencing',
    'whole-genome-metagenome',
    'Whole-genome metagenomic sequencing and analysis.',
    'Genomics & Sequencing',
    'lab',
    NULL,
    'Whole-genome metagenomic sequencing and analysis.',
    'Shotgun sequencing reads all the DNA in a mixed sample, not just one marker gene.

It shows who is there and what genes they carry.',
    ARRAY['Species- and strain-level identification', 'Functional gene profiling', 'Detection of antibiotic resistance genes', 'Assembly of genomes from the mix (MAGs)'],
    'Layers',
    '/assets/services/metagenome-sequencing.webp',
    'Stool, environmental soil, swab, or microbial pellet (OD 260/280 ≥ 1.8)',
    '12–16 business days',
    'Taxonomic profiling heatmap, alpha/beta diversity metrics & functional annotations',
    NULL,
    'published',
    6
),
(
    'Phylogenetic Tree construction & analysis',
    'phylogenetic-tree-construction',
    'Phylogenetic analysis and tree construction.',
    'Bioinformatics & Computational',
    'computational',
    NULL,
    'Phylogenetic analysis and tree construction.',
    'Builds an evolutionary tree showing how organisms or sequences are related to each other.

Provides a robust evolutionary framework for taxonomic and functional analysis.',
    ARRAY['Sequence alignment and trimming', 'Best-fit model selection', 'Tree building (maximum likelihood, Bayesian or neighbour-joining)', 'Support values and clean, publication-ready figures'],
    'GitBranch',
    '/assets/services/cropped/phylogenetic-tree-construction.webp',
    'Multi-FASTA sequence files (nucleotide or amino acid alignments)',
    '3–7 business days',
    'High-resolution Newick tree file, bootstrap support metrics & publication figures',
    NULL,
    'published',
    7
),
(
    'Pangenome Analysis',
    'pangenome-analysis',
    'Comparative analysis across multiple genomes.',
    'Bioinformatics & Computational',
    'computational',
    NULL,
    'Comparative analysis across multiple genomes.',
    'Compares many genomes of the same species to separate genes shared by all (core) from genes found only in some (accessory).

Shows how a species varies and adapts.',
    ARRAY['Core, accessory and unique gene identification', 'Gene presence/absence matrix', 'Pangenome size and openness estimates', 'Links to phylogeny and traits'],
    'Network',
    '/assets/services/pangenome-analysis.webp',
    'Assembled genomes (FASTA) or annotated GFF3 files (≥10 strains)',
    '7–12 business days',
    'Core and accessory genome matrices, gene presence/absence plots & pan-GWAS output',
    NULL,
    'published',
    8
),
(
    'MD Simulation',
    'protein-docking-molecular-dynamics',
    'Computational protein docking and molecular simulation.',
    'Bioinformatics & Computational',
    'computational',
    NULL,
    'Computational protein docking and molecular simulation.',
    'Uses computers to predict how a protein and a small molecule (or another protein) fit together.

Simulates their movement over time to see whether the complex stays stable.',
    ARRAY['Protein-ligand and protein-protein docking', 'Binding pose and score analysis', 'Molecular dynamics simulation', 'Stability analysis (RMSD, RMSF, hydrogen bonds) and optional binding free energy'],
    'Atom',
    '/assets/services/md-simulation-molecular-dynamics.webp',
    'Protein PDB coordinates and small-molecule SMILES/SDF ligand structures',
    '10–15 business days',
    'RMSD/RMSF trajectories, binding free energy (MM-PBSA/GBSA) & 3D interaction maps',
    NULL,
    'published',
    9
),
(
    'Protein modeling',
    'protein-modeling',
    'Accurate 3D protein structure prediction, homology modeling, and structural refinement.',
    'Bioinformatics & Computational',
    'computational',
    NULL,
    'Accurate 3D protein structure prediction, homology modeling, and structural refinement.',
    'Protein modeling generates accurate three-dimensional atomic structures for biological targets lacking experimental X-ray crystallography or cryo-EM coordinates, empowering drug discovery and mechanistic biology.

ClinGene integrates template-based homology modeling, threading, and advanced deep-learning methodologies (AlphaFold, ESMFold) with molecular mechanics energy minimization to produce publication-grade 3D models.',
    ARRAY['Deep learning-driven and template-based tertiary structure prediction', 'Loop refinement, rotamer optimization, and force-field energy minimization', 'Rigorous stereochemical quality validation (PROCHECK, ERRAT, Verify3D, Ramachandran)', 'Active site identification, pocket druggability scoring, and electrostatic surface mapping'],
    'Boxes',
    '/assets/services/cropped/protein-docking-molecular-dynamics.webp',
    'Target amino acid sequence in FASTA format',
    '4–6 business days',
    'Refined 3D PDB structure, Ramachandran plot validation & structural quality scores',
    NULL,
    'published',
    10
),
(
    'Immunogenicity Analysis',
    'immunogenicity-analysis',
    'Epitope prediction, MHC binding affinity profiling, and immunogenicity risk assessment.',
    'Bioinformatics & Computational',
    'computational',
    NULL,
    'Epitope prediction, MHC binding affinity profiling, and immunogenicity risk assessment.',
    'Immunogenicity analysis evaluates the propensity of biotherapeutics, recombinant proteins, and peptide antigens to trigger adaptive immune responses in human populations.

Using validated computational immunoinformatics algorithms, ClinGene predicts linear and conformational B-cell epitopes, MHC Class I and Class II T-cell binding affinities, and global population coverage percentiles.',
    ARRAY['MHC Class I and Class II peptide-binding affinity prediction across global HLA alleles', 'Conformational and linear B-cell epitope prediction and surface accessibility profiling', 'Immunogenic risk scoring and de-immunization hotspot identification', 'Population coverage calculations using curated multi-ethnic HLA frequency databases'],
    'ShieldPlus',
    '/assets/services/immunogenicity-analysis-antibody-antigen.webp',
    'Antigen sequence/structure & target HLA allele panel',
    '5–8 business days',
    'Epitope binding affinity ranks, TCR contact predictions & immunogenicity score sheet',
    NULL,
    'published',
    11
),
(
    'Virtual Screening',
    'virtual-screening',
    'High-throughput in silico screening of compound libraries against macromolecular targets.',
    'Bioinformatics & Computational',
    'computational',
    NULL,
    'High-throughput in silico screening of compound libraries against macromolecular targets.',
    'Virtual screening accelerates early drug discovery by rapidly evaluating thousands to millions of small molecules in silico against validated biological targets, dramatically reducing experimental timelines and reagent costs.

ClinGene utilizes high-performance structure-based molecular docking and ligand-based pharmacophore screening, combined with stringent ADMET and drug-likeness filters, to prioritize lead compounds.',
    ARRAY['Structure-based molecular docking screening against crystallographic or modeled active sites', 'Ligand-based 3D pharmacophore modeling, shape matching, and fingerprint similarity screening', 'Comprehensive physicochemical and ADMET profiling (Lipinski Rule of 5, toxicity filters)', 'Consensus scoring, free energy re-scoring, and binding pose clustering'],
    'Search',
    '/assets/services/virtual-screening-ligand-docking.webp',
    'Target binding pocket coordinates & chemical compound library files',
    '7–14 business days',
    'Rank-ordered docking hit list, 2D/3D interaction schematics & ADMET drug-likeness profile',
    NULL,
    'published',
    12
),
(
    'Library generation',
    'library-generation',
    'High-quality next-generation sequencing library preparation across diverse sample types.',
    'Genomics & Sequencing',
    'lab',
    NULL,
    'High-quality next-generation sequencing library preparation across diverse sample types.',
    'Library generation is the critical prerequisite for high-throughput sequencing. High-efficiency fragmentation, adapter ligation, and low-bias amplification ensure uniform coverage and maximal data fidelity.

ClinGene provides standardized and customized NGS library preparation workflows for Illumina, MGI, and long-read platforms, supporting genomic DNA, total RNA, PCR amplicons, and challenging low-input or degraded samples.',
    ARRAY['Enzymatic and mechanical shearing fragmentation protocols with tight size selection', 'Stranded RNA-Seq library construction with poly-A selection or rRNA depletion', 'Specialized protocols for low-input DNA and cell-free DNA (cfDNA)', 'Comprehensive quality validation using Bioanalyzer, TapeStation, and fluorometric assays'],
    'Library',
    '/assets/services/ngs-library-generation.webp',
    'High molecular weight genomic DNA (≥200 ng) or intact total RNA',
    '5–7 business days',
    'Bioanalyzer / TapeStation fragment sizing profile & molarity quantification certificate',
    NULL,
    'published',
    13
),
(
    'Molecular Biology Services',
    'molecular-biology-services',
    'Comprehensive routine and specialized wet-lab molecular biology services.',
    'Genomics & Sequencing',
    'lab',
    NULL,
    'Comprehensive routine and specialized wet-lab molecular biology services.',
    'ClinGene''s molecular biology services provide biomedical researchers, diagnostic facilities, and academic institutions with dependable bench-level wet-lab capabilities executed under strict quality standards.

From high-purity DNA and RNA extraction across complex biological matrices to qualitative PCR, cloning, vector construction, and quantitative real-time PCR (qPCR), our wet-lab facility delivers reproducible experimental results.',
    ARRAY['High-yield DNA/RNA extraction from blood, tissue, FFPE, plants, microbes, and environmental samples', 'Qualitative PCR amplification and Real-Time quantitative PCR (qPCR) assays', 'Molecular cloning, plasmid vector construction, and bacterial transformation', 'Fluorometric, spectrophotometric, and electrophoretic nucleic acid quality profiling'],
    'Microscope',
    '/assets/services/molecular-biology-pcr-gel.webp',
    'Biological tissue, cell cultures, blood, or plant material',
    '3–5 business days',
    'Nanodrop concentration metrics, agarose gel electropherogram & qPCR amplification curves',
    NULL,
    'published',
    14
),
(
    'Project Design',
    'project-design',
    'Strategic experimental design, statistical power calculation, and platform selection.',
    'Bioinformatics & Computational',
    'computational',
    NULL,
    'Strategic experimental design, statistical power calculation, and platform selection.',
    'Rigorous experimental design is the cornerstone of statistically sound, biologically impactful, and cost-efficient genomic investigations.

ClinGene partners with principal investigators, clinicians, and biotechnology innovators from study conception, providing consultative advisory on cohort sizing, sequencing platform choice, depth optimization, and bioinformatic pipelines.',
    ARRAY['Statistical power analysis and cohort sample size determination', 'Sequencing platform (short-read vs. long-read) and coverage depth optimization', 'Multi-omics integration roadmapping (genomics, transcriptomics, metagenomics)', 'Grant methodology formulation and budget-aligned milestone planning'],
    'Lightbulb',
    '/assets/services/cropped/statistical-data-analysis.webp',
    'Study hypothesis, experimental parameters & preliminary biological data',
    '3–5 business days',
    'Complete experimental study protocol, power analysis calculation & sequencing pipeline roadmap',
    NULL,
    'published',
    15
),
(
    'Clinical Genetic Testing',
    'clinical-genetic-testing',
    'Genetic testing for clinical and research needs.',
    'Clinical Diagnostics',
    'lab',
    NULL,
    'Genetic testing for clinical and research needs.',
    'Identifies changes in a person''s DNA that cause or increase the risk of inherited conditions.

Supports clinicians in confirming a suspected diagnosis, screening family members and guiding follow-up care.',
    ARRAY['Variant detection in disease-related genes', 'Clinician-friendly interpreted report', 'Support for single-gene and multi-gene testing', 'Guidance on result interpretation'],
    'Stethoscope',
    '/assets/services/cropped/clinical-genetic-testing.webp',
    'Peripheral blood (EDTA 3–5 mL), buccal swab, or purified genomic DNA',
    '7–10 business days',
    'Certified molecular diagnostic report (PDF) with board-reviewed clinical interpretation',
    NULL,
    'published',
    16
),
(
    'Single-cell RNA-seq Data Analysis',
    'single-cell-rna-seq-analysis',
    'Analysis of single-cell RNA sequencing datasets.',
    'Bioinformatics & Computational',
    'computational',
    NULL,
    'Analysis of single-cell RNA sequencing datasets.',
    'A data analysis service for datasets you already have.

We process the data, group cells by their expression profiles and help you understand which cell types and states are present.',
    ARRAY['Quality control and filtering', 'Normalisation and batch correction', 'Clustering and UMAP visualisation', 'Marker gene detection and cell-type annotation (optional trajectory analysis)'],
    'Microscope',
    '/assets/services/cropped/single-cell-rna-seq-analysis.webp',
    'Single-cell suspension (>80% viability) or raw 10x Genomics FASTQ files',
    '10–14 business days',
    'Seurat/Scanpy UMAP clustering, cell-type annotation & marker gene expression profiles',
    NULL,
    'published',
    17
),
(
    '16S rRNA Metagenome Sequencing',
    '16s-rrna-metagenome-sequencing',
    'Sequencing and analysis of 16S rRNA metagenomes.',
    'Genomics & Sequencing',
    'lab',
    NULL,
    'Sequencing and analysis of 16S rRNA metagenomes.',
    'Reads the 16S rRNA gene, which acts like a barcode for bacteria, to find out which microbes are present in a sample and in what proportion.

Enables profiling of diverse microbial communities across environmental, industrial and clinical settings.',
    ARRAY['Amplicon sequencing of the 16S rRNA gene', 'Taxonomic classification', 'Alpha and beta diversity analysis', 'Comparison between sample groups'],
    'Bug',
    '/assets/services/cropped/16s-rrna-metagenome-sequencing.webp',
    'Fecal, soil, water filter, or microbial genomic DNA',
    '10–12 business days',
    'QIIME2 OTU/ASV feature tables, taxonomic bar plots & rarefaction curves',
    NULL,
    'published',
    18
),
(
    'Whole Fungal Genome Sequencing',
    'whole-fungal-genome-sequencing',
    'Genome sequencing services for fungal research.',
    'Genomics & Sequencing',
    'lab',
    NULL,
    'Genome sequencing services for fungal research.',
    'Sequences the complete genome of a fungal isolate to study its genes, identity and traits.

Fungal cell walls are tough, so careful DNA extraction is part of the service.',
    ARRAY['De novo assembly or reference-based sequencing', 'Gene prediction and functional annotation', 'Species confirmation', 'Detection of genes linked to pathogenicity or resistance'],
    'Sprout',
    '/assets/services/cropped/whole-fungal-genome-sequencing.webp',
    'Pure fungal mycelial culture or high-molecular-weight fungal DNA',
    '14–20 business days',
    'De novo genome assembly metrics (N50), BUSCO completeness score & secondary metabolite clusters',
    NULL,
    'published',
    19
),
(
    'Plant Genome Sequencing',
    'plant-genome-sequencing',
    'Genome sequencing services for plant research.',
    'Genomics & Sequencing',
    'lab',
    NULL,
    'Genome sequencing services for plant research.',
    'Sequences plant genomes for breeding, conservation and crop research.

Plant tissue often contains compounds that interfere with DNA extraction, so extraction is handled carefully.',
    ARRAY['Whole genome sequencing and resequencing', 'Genome assembly and annotation', 'Variant discovery between varieties', 'Marker development for breeding'],
    'Leaf',
    '/assets/services/cropped/plant genome.webp',
    'Fresh young leaf tissue (dark-treated, flash-frozen) or high-purity plant DNA',
    '20–30 business days',
    'Chromosome-level scaffolding, repeat masking statistics & plant gene model annotations',
    NULL,
    'published',
    20
);
