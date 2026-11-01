UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Prenatal & Reproductive Guidance",
    "description": "Assisting prospective parents with carrier screening results, advanced maternal age considerations, and diagnostic options."
  },
  {
    "title": "Hereditary Cancer Risk Assessment",
    "description": "Evaluating familial clusters of breast, ovarian, colorectal, and endocrine tumors to guide surveillance strategies."
  },
  {
    "title": "Rare & Pediatric Genetic Conditions",
    "description": "Guiding diagnostic pathways for developmental delay, dysmorphic features, and suspected inborn errors of metabolism."
  },
  {
    "title": "Cardiogenetics, Neurogenetics & Other Genetic Diseases",
    "description": "Interpreting inherited risk profiles for familial cardiomyopathies, channelopathies, ataxias, and early-onset neurodegeneration."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "What is genetic counseling and who benefits from it?",
    "answer": "Genetic counseling is a specialized clinical consultation that helps individuals understand how genetics impacts health, guiding informed decisions regarding genetic testing and preventive care."
  },
  {
    "question": "Is genetic counseling required before having a genetic test?",
    "answer": "Pre-test counseling is strongly recommended to ensure patients understand the clinical scope, benefits, limitations, and potential familial implications of testing before proceeding."
  },
  {
    "question": "Can consultations be conducted via telehealth?",
    "answer": "Yes, ClinGene offers secure remote telehealth consultations for patients and clinicians nationwide, as well as in-person appointments at our Islamabad laboratory facility."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Comprehensive written genetic consultation summary report',
  'Annotated familial pedigree chart',
  'Evidence-based clinical surveillance and management recommendations',
  'Patient educational literature and physician follow-up recommendations'
]::text[],
    requirements = ARRAY[
  'Clinical summary notes or referral letter from attending physician',
  'Detailed family health history and medical background',
  'Prior genetic, cytogenetic, or biochemical test reports if available',
  'Relevant clinical imaging, pathology, or laboratory investigation records'
]::text[],
    requirements_label = 'Consultation Prerequisites',
    related_slugs = ARRAY[
  'whole-exome-genome-sequencing',
  'panel-sequencing',
  'sanger-sequencing'
]::text[],
    sub_services = $json$[
  {
    "id": "prenatal-diagnosis",
    "label": "Prenatal Diagnosis"
  },
  {
    "id": "newborn-screening",
    "label": "Newborn Screening"
  },
  {
    "id": "genetic-diseases",
    "label": "Genetic Diseases"
  },
  {
    "id": "chromosomal-abnormalities",
    "label": "Chromosomal Abnormalities"
  },
  {
    "id": "hereditary-cancer",
    "label": "Hereditary Cancer"
  }
]$json$::jsonb,
    deliverables_note = NULL,
    image_width = 800,
    image_height = 800
WHERE slug = 'genetic-counseling'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Rare Disease Diagnosis",
    "description": "Investigating unexplained genetic conditions and rare inherited disorders."
  },
  {
    "title": "Cancer Research",
    "description": "Profiling somatic alterations, driver mutations and genomic instability."
  },
  {
    "title": "Population & Ancestry",
    "description": "Mapping population variation, ancestry markers and demographic history."
  },
  {
    "title": "Novel Gene Discovery",
    "description": "Identifying novel candidate disease genes through family and cohort studies."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "What is the primary difference between WES and WGS?",
    "answer": "WES targets the ~1-2% protein-coding regions where over 85% of known disease-causing mutations reside, whereas WGS sequences the complete 3-billion-base genome."
  },
  {
    "question": "Can you analyze parent-child trios or family cohorts?",
    "answer": "Yes, family trio and cohort analyses are supported for denovo mutation detection and recessive inheritance pattern identification."
  },
  {
    "question": "How do I initiate a sequencing project?",
    "answer": "Click 'Request this service' to provide your study design and sample counts. Our scientific team will contact you with specific guidelines promptly."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Raw reads (FASTQ)',
  'Aligned reads (BAM / CRAM)',
  'Variant calls (VCF)',
  'Annotated variant list',
  'Summary quality control and analytical report'
]::text[],
    requirements = ARRAY[
  'High-quality genomic DNA or whole blood.',
  'Contact us for details regarding amount and quality thresholds.'
]::text[],
    requirements_label = 'Sample requirements',
    related_slugs = ARRAY[
  'clinical-genetic-testing',
  'sanger-sequencing',
  'rna-seq'
]::text[],
    comparison_table = $json${
  "headers": [
    "Metric / Feature",
    "Whole Exome Sequencing (WES)",
    "Whole Genome Sequencing (WGS)"
  ],
  "rows": [
    [
      "Region covered",
      "Protein-coding regions (~1-2% of genome)",
      "Entire genome (coding and non-coding regions)"
    ],
    [
      "Best for",
      "Known disease-causing variants and clinical diagnostics",
      "Novel variant discovery, structural variants, non-coding variation"
    ],
    [
      "Data size",
      "Smaller (~5-10 GB per sample)",
      "Larger (~60-100 GB per sample)"
    ]
  ]
}$json$::jsonb,
    deliverables_note = NULL,
    image_width = 317,
    image_height = 301
WHERE slug = 'whole-exome-genome-sequencing'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Hereditary Oncology Panels",
    "description": "Targeted analysis of tumor suppressor and DNA repair genes including BRCA1, BRCA2, TP53, and Lynch syndrome loci."
  },
  {
    "title": "Cardiogenetics Panels",
    "description": "Screening nuclear genes implicated in hypertrophic, dilated, and arrhythmogenic right ventricular cardiomyopathies."
  },
  {
    "title": "Neuromuscular & Epilepsy Panels",
    "description": "Focused genetic panels for developmental and epileptic encephalopathies, ataxias, and muscular dystrophies."
  },
  {
    "title": "Somatic Actionable Hotspot Panels",
    "description": "Profiling key actionable therapeutic mutations in solid tumors and hematological malignancies."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "How does panel sequencing compare to whole exome sequencing?",
    "answer": "Panel sequencing focuses strictly on genes known to cause specific conditions, delivering higher read depth at lower cost, whereas whole exome sequencing captures all ~20,000 coding genes."
  },
  {
    "question": "Can customized gene panels be designed for research studies?",
    "answer": "Yes, ClinGene designs bespoke target enrichment panels tailored to specific research cohorts and gene discovery pathways."
  },
  {
    "question": "What turnaround time is typical for panel sequencing?",
    "answer": "Standard clinical and research panels are processed within 2 to 4 weeks from sample qualification."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Demultiplexed FASTQ sequencing reads (MD5 checksum verified)',
  'Aligned BAM alignment files and indexed VCF variant call files',
  'Clinical variant annotation report with ACMG/AMP classification',
  'Run quality control and targeted region coverage statistics report'
]::text[],
    requirements = ARRAY[
  'Purified genomic DNA (≥200 ng, OD 260/280: 1.8-2.0)',
  'Whole blood collected in EDTA tubes (3-5 mL, shipped at 4°C)',
  'FFPE tissue curls or unstained slides with verified tumor cell content',
  'Completed requisition form detailing clinical indication and requested panel'
]::text[],
    requirements_label = 'Sample Requirements',
    related_slugs = ARRAY[
  'whole-exome-genome-sequencing',
  'sanger-sequencing',
  'genetic-counseling'
]::text[],
    deliverables_note = NULL,
    image_width = 800,
    image_height = 597
WHERE slug = 'panel-sequencing'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Variant Confirmation",
    "description": "Confirming variants found by next-generation sequencing or other methods."
  },
  {
    "title": "Clone Verification",
    "description": "Checking cloned inserts, plasmids and construct boundaries."
  },
  {
    "title": "Mutation Screening",
    "description": "Targeted mutation screening in known candidate genes."
  },
  {
    "title": "Species Identification",
    "description": "Species identification and taxonomic classification by marker genes."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "What sample types can be submitted for Sanger sequencing?",
    "answer": "We accept purified PCR products as well as plasmid DNA, accompanied by specific forward and reverse primers or requests for primer design."
  },
  {
    "question": "What data formats are provided upon completion?",
    "answer": "You receive raw chromatogram trace files (.ab1), FASTA sequence files, and reference alignment summaries."
  },
  {
    "question": "How do I request a quote for high-throughput plate orders?",
    "answer": "Submit your sample count and target details via the 'Request this service' button, and our team will reply promptly to assist with your inquiry."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Chromatogram files (.ab1)',
  'Sequence files (FASTA)',
  'Alignment summary against reference sequence'
]::text[],
    requirements = ARRAY[
  'Purified PCR product or plasmid DNA.',
  'Primers (or request primer design from our team).',
  'Contact us for details regarding concentration and volume specifications.'
]::text[],
    requirements_label = 'Sample requirements',
    related_slugs = ARRAY[
  'clinical-genetic-testing',
  'whole-exome-genome-sequencing',
  'phylogenetic-tree-construction'
]::text[],
    deliverables_note = NULL,
    image_width = 320,
    image_height = 302
WHERE slug = 'sanger-sequencing'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Disease Mechanisms",
    "description": "Elucidating molecular pathways involved in pathology and disease progression."
  },
  {
    "title": "Drug Response",
    "description": "Quantifying transcriptional changes following pharmacological intervention."
  },
  {
    "title": "Developmental Biology",
    "description": "Tracking temporal and spatial gene expression during differentiation."
  },
  {
    "title": "Biomarker Discovery",
    "description": "Identifying diagnostic and prognostic transcriptomic biomarkers."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "Why are biological replicates recommended for RNA-Seq?",
    "answer": "Biological replicates account for natural biological variance, providing the statistical power needed to accurately identify differentially expressed genes."
  },
  {
    "question": "What RNA quality is acceptable for library preparation?",
    "answer": "Intact total RNA with high integrity (RIN) is preferred. Exact quantity and RIN thresholds will be confirmed by our lab based on your study specifications."
  },
  {
    "question": "How are bioinformatics and enrichment results shared?",
    "answer": "You receive raw sequencing data alongside processed count matrices, publication-ready figures (PCA, volcano, heatmaps), and enrichment reports."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Raw reads (FASTQ)',
  'Gene count matrix',
  'List of differentially expressed genes',
  'Visualisation plots (PCA, volcano plots, heatmaps)',
  'Pathway and GO enrichment results'
]::text[],
    requirements = ARRAY[
  'Total RNA with good integrity, or tissue/cells preserved in an RNA stabiliser.',
  'Biological replicates recommended (minimum 3 replicates per condition).',
  'Contact us for details regarding sample quantity and RIN thresholds.'
]::text[],
    requirements_label = 'Sample requirements',
    related_slugs = ARRAY[
  'single-cell-rna-seq-analysis',
  'whole-exome-genome-sequencing',
  'pangenome-analysis'
]::text[],
    deliverables_note = NULL,
    image_width = 800,
    image_height = 754
WHERE slug = 'rna-seq'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Pathogen Detection",
    "description": "Unbiased detection of bacterial, viral and eukaryotic pathogens."
  },
  {
    "title": "Resistome Studies",
    "description": "Quantifying antimicrobial resistance genes and mobile genetic elements."
  },
  {
    "title": "Environmental Microbiomes",
    "description": "Exploring metabolic capacity in agricultural and environmental systems."
  },
  {
    "title": "Microbial Discovery",
    "description": "Reconstructing metagenome-assembled genomes (MAGs) of uncultured taxa."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "How does shotgun metagenomics differ from 16S amplicon sequencing?",
    "answer": "Shotgun metagenomics sequences all genomic DNA within a sample, providing species/strain resolution, functional metabolic profiling, and antimicrobial resistance detection."
  },
  {
    "question": "Can host DNA be filtered out before analysis?",
    "answer": "Yes, computational decontamination is routinely performed to remove human, animal or plant host reads prior to taxonomic and functional profiling."
  },
  {
    "question": "How do I request a study proposal?",
    "answer": "Click 'Request this service' with details on sample origins and sequencing depth goals, and our scientific team will reply promptly."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Raw reads (FASTQ)',
  'Taxonomy and functional gene abundance tables',
  'Assembled contigs and metagenome-assembled genomes (MAGs)',
  'Comprehensive analytical summary report'
]::text[],
    requirements = ARRAY[
  'High-quality DNA extracted from stool, soil, water or other mixed samples.',
  'Contact us for details regarding required amount.'
]::text[],
    requirements_label = 'Sample requirements',
    related_slugs = ARRAY[
  '16s-rrna-metagenome-sequencing',
  'whole-fungal-genome-sequencing',
  'pangenome-analysis'
]::text[],
    deliverables_note = NULL,
    image_width = 800,
    image_height = 597
WHERE slug = 'whole-genome-metagenome'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Taxonomic Classification",
    "description": "Species identification, nomenclature and systematic classification."
  },
  {
    "title": "Pathogen Evolution",
    "description": "Tracing viral or bacterial mutation trajectories and divergence times."
  },
  {
    "title": "Gene Family Studies",
    "description": "Investigating gene duplication, speciation and orthology relationships."
  },
  {
    "title": "Outbreak Analysis",
    "description": "Inferring transmission clusters and phylogenetic relationships during outbreaks."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "Which tree construction algorithms are available?",
    "answer": "We support Maximum Likelihood (e.g. IQ-TREE, RAxML), Bayesian inference, and Neighbor-Joining methods, chosen according to your dataset size and goals."
  },
  {
    "question": "Are branch support values calculated?",
    "answer": "Yes, trees include bootstrap support values (e.g. ultrafast bootstrap) or posterior probabilities to quantify branch confidence."
  },
  {
    "question": "How can I submit my sequences for tree construction?",
    "answer": "Click 'Request this service' to send your project details. Our team will coordinate sequence upload and model specifications."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Multiple sequence alignment file (FASTA / PHYLIP)',
  'Tree files (Newick / Nexus format)',
  'Publication-quality tree figures (circular, radial, or phylogram)',
  'Methods and model selection summary'
]::text[],
    requirements = ARRAY[
  'Sequences in FASTA format (genes, markers, or genomes).',
  'Optional outgroup and sample metadata.'
]::text[],
    requirements_label = 'Input data requirements',
    related_slugs = ARRAY[
  'pangenome-analysis',
  '16s-rrna-metagenome-sequencing',
  'whole-fungal-genome-sequencing'
]::text[],
    deliverables_note = NULL,
    image_width = 405,
    image_height = 295
WHERE slug = 'phylogenetic-tree-construction'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Population Studies",
    "description": "Bacterial and fungal population structure and lineage differentiation."
  },
  {
    "title": "Virulence & Resistance",
    "description": "Tracking the distribution of resistance and virulence genes across isolates."
  },
  {
    "title": "Crop & Plant Diversity",
    "description": "Cataloging dispensable and core gene pools across plant accessions."
  },
  {
    "title": "Outbreak Investigation",
    "description": "Resolving epidemiological transmission dynamics during disease outbreaks."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "How many genomes are required for a meaningful pangenome analysis?",
    "answer": "A pangenome analysis can be initiated with as few as 5-10 strains, though larger isolate collections provide more comprehensive insights into genome openness."
  },
  {
    "question": "What file formats are needed from my sequenced strains?",
    "answer": "Assembled FASTA files or pre-annotated GFF files are accepted, along with phenotypic metadata (e.g. host, resistance profile, location)."
  },
  {
    "question": "How do I request a consultation on pangenomics?",
    "answer": "Submit your cohort size and biological objectives via 'Request this service', and our bioinformatics specialists will contact you promptly."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Gene presence/absence matrix table',
  'Pangenome accumulation and distribution plots',
  'Annotated results tables for core, shell and cloud gene families',
  'Written methods and analytical summary'
]::text[],
    requirements = ARRAY[
  'Genome assemblies or annotation files for each strain (FASTA / GFF).',
  'Sample and strain metadata (isolation source, date, phenotype).'
]::text[],
    requirements_label = 'Input data requirements',
    related_slugs = ARRAY[
  'phylogenetic-tree-construction',
  'whole-genome-metagenome',
  'protein-docking-molecular-dynamics'
]::text[],
    deliverables_note = NULL,
    image_width = 800,
    image_height = 597
WHERE slug = 'pangenome-analysis'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Early Drug Discovery",
    "description": "Virtual screening and rational identification of lead compounds."
  },
  {
    "title": "Candidate Screening",
    "description": "Evaluating compound libraries against designated therapeutic targets."
  },
  {
    "title": "Mutation Impact Studies",
    "description": "Studying how clinical or structural mutations affect drug binding affinities."
  },
  {
    "title": "Protein Function",
    "description": "Unraveling allosteric mechanisms and macromolecular interaction dynamics."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "Can simulations be run if an experimental 3D structure is not in the PDB?",
    "answer": "Yes, computational homology modeling or AlphaFold structural predictions can be constructed prior to docking and molecular dynamics."
  },
  {
    "question": "What simulation durations are standardly evaluated?",
    "answer": "Standard production runs range from 50 ns to 200+ ns depending on the macromolecular system size and research objectives."
  },
  {
    "question": "How do I submit my protein and ligand targets for modeling?",
    "answer": "Click 'Request this service' to send your target identifiers and questions. Our computational team will evaluate feasibility promptly."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Docking results with ranked binding poses and affinity scores',
  'Molecular dynamics simulation trajectories and coordinate files',
  'Analysis plots (RMSD, RMSF, Rg, hydrogen-bond timeline)',
  'Written analytical report with high-resolution structural figures'
]::text[],
    requirements = ARRAY[
  'Protein structure (PDB format) or amino acid sequence.',
  'Ligand structures (SDF / MOL2) or a compound list.',
  'The target binding site, if known.'
]::text[],
    requirements_label = 'Input data requirements',
    related_slugs = ARRAY[
  'pangenome-analysis',
  'single-cell-rna-seq-analysis',
  'whole-exome-genome-sequencing'
]::text[],
    deliverables_note = NULL,
    image_width = 800,
    image_height = 756
WHERE slug = 'protein-docking-molecular-dynamics'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Target Structure Determination",
    "description": "Elucidating 3D conformations of novel viral, bacterial, and human therapeutic proteins."
  },
  {
    "title": "Clinical Mutation Impact Analysis",
    "description": "Assessing structural perturbation, thermodynamic stability shifts, and disruption of active residues caused by missense variants."
  },
  {
    "title": "Engineered Biocatalyst Design",
    "description": "Guiding rational mutagenesis and active site redesign for industrial enzymes and therapeutic proteins."
  },
  {
    "title": "Structure-Based Drug Design",
    "description": "Constructing high-confidence receptor coordinates for virtual screening and docking campaigns."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "What sequence information is needed to begin protein modeling?",
    "answer": "Only the primary amino acid sequence in FASTA format is required, along with any known constraints or biological cofactors."
  },
  {
    "question": "How is the reliability of a predicted protein model validated?",
    "answer": "We apply rigorous stereochemical and thermodynamic assessment tools including Ramachandran analysis, ERRAT, and Verify3D to ensure biophysical plausibility."
  },
  {
    "question": "Can multimeric protein complexes be modeled?",
    "answer": "Yes, we construct homo-multimeric and hetero-multimeric complexes using advanced multimer deep-learning protocols and protein-protein docking."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Refined atomic coordinate structure files in PDB and mmCIF formats',
  'Stereochemical validation report (Ramachandran plot, Z-score, ERRAT)',
  'Structural alignment and C-alpha RMSD comparison against homologous templates',
  'High-resolution ray-traced structural figures and binding pocket annotations'
]::text[],
    requirements = ARRAY[
  'Target amino acid sequence in standard FASTA format',
  'Known homologous template structures (PDB codes) if specific templates are desired',
  'Experimental information regarding cofactors, metal ions, or oligomeric state',
  'Specific missense mutation coordinates or isoform variants of interest'
]::text[],
    requirements_label = 'Input Requirements',
    related_slugs = ARRAY[
  'protein-docking-molecular-dynamics',
  'virtual-screening',
  'immunogenicity-analysis'
]::text[],
    deliverables_note = NULL,
    image_width = 431,
    image_height = 291
WHERE slug = 'protein-modeling'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Subunit Vaccine Construct Design",
    "description": "Engineering multi-epitope peptide and mRNA vaccine constructs for pathogens and cancer neoantigens."
  },
  {
    "title": "Biotherapeutic De-Immunization",
    "description": "Identifying and modifying immunogenic CD4+ T-cell epitopes in therapeutic antibodies and enzymes."
  },
  {
    "title": "Allergenicity Risk Assessment",
    "description": "Screening novel food proteins, agricultural traits, and industrial enzymes for cross-reactive allergenicity."
  },
  {
    "title": "Tumor Neoantigen Ranking",
    "description": "Prioritizing patient-specific somatic neoepitopes for personalized cancer immunotherapy."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "Which HLA alleles are evaluated during immunogenicity screening?",
    "answer": "We screen against internationally recognized reference panels of high-frequency HLA Class I and Class II alleles, with custom allele panels available for regional cohorts."
  },
  {
    "question": "Can both T-cell and B-cell epitopes be analyzed?",
    "answer": "Yes, our computational pipeline integrates comprehensive algorithms for both T-cell (MHC-I and MHC-II) and B-cell (linear and conformational) epitope discovery."
  },
  {
    "question": "How does in silico immunogenicity assessment save drug development costs?",
    "answer": "It flags immunogenic liabilities early in preclinical optimization, allowing targeted protein engineering before expensive in vivo and clinical testing."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Tabular epitope binding affinity predictions with IC50 percentiles',
  'Cumulative global and regional HLA population coverage statistics',
  '3D mapped epitope visualizations on target protein structures',
  'Actionable residue mutation recommendations for de-immunization or immunogenicity enhancement'
]::text[],
    requirements = ARRAY[
  'Target protein or peptide sequences in standard FASTA format',
  'Target population demographic profiles or prioritized HLA allele lists',
  '3D structural coordinates (PDB format) for conformational B-cell epitope prediction',
  'Context of application (vaccine engineering vs. biotherapeutic de-immunization)'
]::text[],
    requirements_label = 'Input Data',
    related_slugs = ARRAY[
  'protein-modeling',
  'virtual-screening',
  'protein-docking-molecular-dynamics'
]::text[],
    deliverables_note = NULL,
    image_width = 800,
    image_height = 755
WHERE slug = 'immunogenicity-analysis'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Novel Lead Compound Discovery",
    "description": "Screening commercial and diverse compound libraries against newly validated drug targets."
  },
  {
    "title": "Drug Repurposing Campaigns",
    "description": "Screening approved and clinical-stage pharmacophores against novel therapeutic indications."
  },
  {
    "title": "Natural Product Database Mining",
    "description": "Identifying bioactive scaffolds and natural product derivatives with high target selectivity."
  },
  {
    "title": "Fragment-Based Hit Optimization",
    "description": "Growing and linking low-molecular-weight chemical fragments within target binding pockets."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "How large a chemical library can be virtually screened?",
    "answer": "Our computational architecture supports screening from focused collections of hundreds of compounds to multi-million commercial chemical libraries."
  },
  {
    "question": "Can virtual screening be conducted if no crystal structure is available?",
    "answer": "Yes, high-confidence AlphaFold or homology models can be utilized for structure-based docking, or ligand-based 3D pharmacophore models can be deployed."
  },
  {
    "question": "How are computational false positives filtered out?",
    "answer": "We apply consensus scoring across independent scoring functions, desolvation penalty calculations, and post-docking molecular dynamics stability simulations."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Ranked list of top candidate lead compounds with binding affinity energy scores',
  'Comprehensive ADMET, toxicity, and physicochemical property profiling data',
  '3D structural interaction visualizations showing critical binding contacts',
  'Procurement-ready chemical IDs and vendor catalog references for wet-lab validation'
]::text[],
    requirements = ARRAY[
  'Target receptor 3D coordinate structure file (PDB or mmCIF)',
  'Binding pocket definition coordinates or reference co-crystallized ligand',
  'Chemical library specifications (custom SDF collection or curated vendor libraries)',
  'Target pharmacokinetic, solubility, or drug-likeness constraint parameters'
]::text[],
    requirements_label = 'Project Inputs',
    related_slugs = ARRAY[
  'protein-docking-molecular-dynamics',
  'protein-modeling',
  'immunogenicity-analysis'
]::text[],
    deliverables_note = NULL,
    image_width = 800,
    image_height = 754
WHERE slug = 'virtual-screening'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Whole Genome & Exome Libraries",
    "description": "High-yield dual-indexed library generation for microbial, plant, animal, and human genomes."
  },
  {
    "title": "Transcriptome & Gene Expression Libraries",
    "description": "Directional RNA-Seq libraries for differential gene expression, novel transcript, and splicing studies."
  },
  {
    "title": "Targeted Amplicon Libraries",
    "description": "Multi-amplicon library preparation for molecular epidemiology and disease surveillance."
  },
  {
    "title": "Metagenomic & Environmental Libraries",
    "description": "High-complexity metagenomic DNA libraries from clinical microbiomes, soil, and water samples."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "Can ClinGene prepare libraries from low-yield or degraded specimens?",
    "answer": "Yes, we utilize specialized low-input and repair protocols optimized for nanogram-level DNA and degraded RNA from clinical biopsies and FFPE blocks."
  },
  {
    "question": "Which sequencing platform adapters are supported?",
    "answer": "We support industry-standard dual-indexed adapters compatible with Illumina, MGI/DNBSEQ, and Oxford Nanopore platforms."
  },
  {
    "question": "Can library preparation be ordered as a standalone service?",
    "answer": "Yes, clients can submit nucleic acid samples solely for library generation and receive certified, ready-to-sequence library pools."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Ready-to-sequence dual-indexed NGS library pools',
  'Bioanalyzer / TapeStation electropherogram size distribution profiles',
  'Absolute library concentration measurements via Qubit and qPCR',
  'Quality assurance certificate and adapter index barcode assignment manifest'
]::text[],
    requirements = ARRAY[
  'Genomic DNA (≥50-100 ng recommended; low-input protocols available down to 1 ng)',
  'Total RNA (RIN ≥ 7.0 for standard mRNA; low-RIN protocols available for FFPE/degraded RNA)',
  'Fluorometric quantification (Qubit) and purity ratios (OD 260/280: 1.8-2.0)',
  'Sample buffer in nuclease-free water or 10 mM Tris-HCl (pH 8.0)'
]::text[],
    requirements_label = 'Sample Input Requirements',
    related_slugs = ARRAY[
  'whole-exome-genome-sequencing',
  'rna-seq',
  'sanger-sequencing'
]::text[],
    deliverables_note = NULL,
    image_width = 800,
    image_height = 754
WHERE slug = 'library-generation'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Gene Expression & Validation",
    "description": "Real-time qPCR validation of RNA-Seq findings, biomarker quantification, and pathway analysis."
  },
  {
    "title": "Pathogen Screening & Surveillance",
    "description": "Molecular detection of bacterial, viral, and fungal targets in research and clinical specimens."
  },
  {
    "title": "Recombinant DNA Workflows",
    "description": "Constructing expression plasmids, site-directed mutagenesis, and recombinant verification."
  },
  {
    "title": "Bio-Sample Archival & Banking",
    "description": "Standardized extraction and cryogenic preservation of high-integrity DNA and RNA cohorts."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "What types of biological samples can be processed?",
    "answer": "We process whole blood, buffy coats, human and animal tissues, plant leaves and seeds, fungal mycelia, bacterial pellets, and environmental swabs."
  },
  {
    "question": "Do you offer custom PCR primer design and optimization?",
    "answer": "Yes, our molecular biology team designs, synthesizes, and empirically optimizes PCR and qPCR primer/probe sets for specific targets."
  },
  {
    "question": "How are extracted samples returned or stored?",
    "answer": "Samples can be securely stored at -80°C in our laboratory, delivered via temperature-monitored courier, or transitioned directly into sequencing pipelines."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Purified DNA or RNA aliquots with documented concentration and purity metrics',
  'qPCR amplification curves, cycle threshold (Ct) values, and normalized fold-change data',
  'Electrophoresis gel documentation and spectrophotometric quality reports',
  'Detailed laboratory bench protocol documentation and methodology summaries'
]::text[],
    requirements = ARRAY[
  'Biological specimens transported under validated cold-chain conditions (ice packs or dry ice)',
  'Tissue samples fresh-frozen or stabilized in RNAlater or 100% molecular-grade ethanol',
  'Whole blood collected in EDTA anticoagulant tubes',
  'Completed sample manifest specifying organism, tissue type, and downstream objectives'
]::text[],
    requirements_label = 'Specimen Guidelines',
    related_slugs = ARRAY[
  'sanger-sequencing',
  'library-generation',
  'whole-exome-genome-sequencing'
]::text[],
    deliverables_note = NULL,
    image_width = 800,
    image_height = 800
WHERE slug = 'molecular-biology-services'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Grant Proposal Methodology",
    "description": "Drafting scientifically robust experimental designs and statistical justifications for major research funding bodies."
  },
  {
    "title": "Clinical Cohort Studies",
    "description": "Structuring family trio, case-control, and population cohort studies for inherited and complex diseases."
  },
  {
    "title": "Agricultural & Microbial Programs",
    "description": "Establishing sampling frameworks and comparative genomics strategies for plant and microbial research."
  },
  {
    "title": "Translational Biomarker Discovery",
    "description": "Designing phased multi-stage discovery and clinical validation pipelines for molecular biomarkers."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "When should project design consultation be initiated?",
    "answer": "Engaging at the project conception or grant drafting stage ensures that sample collection and sizing meet necessary statistical power requirements."
  },
  {
    "question": "Can ClinGene assist with writing grant methodology sections?",
    "answer": "Yes, our senior scientists draft detailed technical methodology sections and power analysis justifications tailored for funding applications."
  },
  {
    "question": "Is project design consultation available for industry partners?",
    "answer": "Yes, we advise biotechnology and pharmaceutical partners on assay design, preclinical sequencing pipelines, and exploratory biomarker endpoints."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Comprehensive Project Design Document detailing experimental architecture',
  'Statistical power calculations and cohort sample size recommendations',
  'Platform, sequencing depth, and bioinformatics pipeline specifications',
  'Itemized milestone roadmap and budget optimization framework'
]::text[],
    requirements = ARRAY[
  'Primary research hypothesis and target biological questions',
  'Organism specifications, available sample types, and known biological constraints',
  'Preliminary data, pilot findings, or reference publications if available',
  'Target timeline, publication objectives, and funding framework'
]::text[],
    requirements_label = 'Consultation Inputs',
    related_slugs = ARRAY[
  'whole-exome-genome-sequencing',
  'rna-seq',
  'pangenome-analysis'
]::text[],
    deliverables_note = NULL,
    image_width = 547,
    image_height = 309
WHERE slug = 'project-design'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Confirming Diagnosis",
    "description": "Confirming a suspected genetic disorder in symptomatic individuals."
  },
  {
    "title": "Carrier Screening",
    "description": "Identifying carrier status for recessive inherited conditions."
  },
  {
    "title": "Family Testing",
    "description": "Family (cascade) testing for at-risk relatives."
  },
  {
    "title": "Research Cohorts",
    "description": "Characterizing genetic variants across dedicated research cohorts."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "What quantity of blood or DNA is required?",
    "answer": "Blood collected in an EDTA tube or extracted DNA may be submitted. Contact our team for details regarding exact volume, concentration and storage requirements."
  },
  {
    "question": "How are the test results reported and delivered?",
    "answer": "Results are delivered as a clinician-friendly interpreted report detailing detected variants classified according to clinical significance guidelines."
  },
  {
    "question": "How can I obtain a project quote or place an order?",
    "answer": "Click 'Request this service' to submit an inquiry through our contact form. Our scientific team will reply promptly to assist with your inquiry."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Interpreted report with variants classified by clinical significance.',
  'Comprehensive list of genes tested.'
]::text[],
    requirements = ARRAY[
  'Blood (EDTA tube) or extracted DNA.',
  'Completed request form with clinical details.',
  'Patient consent.',
  'Contact us for details regarding exact volumes and storage conditions.'
]::text[],
    requirements_label = 'Sample requirements',
    related_slugs = ARRAY[
  'sanger-sequencing',
  'whole-exome-genome-sequencing',
  'rna-seq'
]::text[],
    deliverables_note = 'Genetic counseling is recommended before and after testing.',
    image_width = 322,
    image_height = 304
WHERE slug = 'clinical-genetic-testing'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Tumour Microenvironment",
    "description": "Deconvoluting cellular heterogeneity and immune infiltration in tumours."
  },
  {
    "title": "Immune Cell Profiling",
    "description": "Characterizing distinct immune subsets, activation states and clonal phenotypes."
  },
  {
    "title": "Developmental Trajectories",
    "description": "Mapping lineage branching and pseudotime differentiation dynamics."
  },
  {
    "title": "Rare Cell Populations",
    "description": "Detecting stem, progenitor or resistant cell subpopulations."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "What starting data formats are accepted for single-cell analysis?",
    "answer": "We accept raw FASTQ sequencing files or pre-computed gene-cell count matrices (MEX, H5, TSV/CSV) along with comprehensive sample metadata."
  },
  {
    "question": "Can you perform trajectory and pseudotime inference?",
    "answer": "Yes, trajectory analysis and pseudotime ordering are available to chart dynamic cellular differentiation transitions."
  },
  {
    "question": "How do I request this computational service?",
    "answer": "Submit your dataset dimensions, sequencing chemistry, and study goals using the 'Request this service' button to receive an analytical plan."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Processed dataset object (e.g. Seurat / SingleCellExperiment / AnnData)',
  'Publication-style figures (UMAP, t-SNE, violin plots, dot plots)',
  'Marker gene tables for annotated clusters',
  'Written methods and analytical results summary'
]::text[],
    requirements = ARRAY[
  'Raw reads (FASTQ) or a count matrix.',
  'Metadata describing samples, conditions and experimental batches.',
  'The species and the biological question.'
]::text[],
    requirements_label = 'Input data requirements',
    related_slugs = ARRAY[
  'rna-seq',
  'pangenome-analysis',
  'whole-exome-genome-sequencing'
]::text[],
    deliverables_note = NULL,
    image_width = 319,
    image_height = 304
WHERE slug = 'single-cell-rna-seq-analysis'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Gut Microbiome Studies",
    "description": "Assessing host-associated microbial communities and dysbiosis."
  },
  {
    "title": "Soil & Water Microbiology",
    "description": "Characterizing environmental microbiomes across ecological gradients."
  },
  {
    "title": "Clinical Microbiome Research",
    "description": "Correlating microbial diversity shifts with clinical health outcomes."
  },
  {
    "title": "Environmental Monitoring",
    "description": "Tracking biological indicators and bioremediation efficacy over time."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "Which hypervariable regions of the 16S gene can be targeted?",
    "answer": "Standard workflows commonly target V3-V4 or V4 regions. Specific amplicon primer combinations can be arranged based on your target taxa."
  },
  {
    "question": "Can raw specimens like stool or soil be sent directly?",
    "answer": "Yes, both extracted microbial DNA and properly stabilized raw samples (soil, water filters, stool, swabs) are accepted. Preservation protocols are confirmed upon inquiry."
  },
  {
    "question": "What statistical comparisons are provided?",
    "answer": "We provide alpha diversity metrics (Shannon, Simpson, Chao1) and beta diversity ordination (PCoA, NMDS) with PERMANOVA group significance testing."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Raw reads (FASTQ)',
  'Feature / taxa abundance table (ASV / OTU table)',
  'Taxonomy bar plots and composition charts',
  'Alpha and beta diversity plots and statistical tests'
]::text[],
    requirements = ARRAY[
  'Extracted DNA or raw samples such as stool, soil, water or swabs.',
  'Contact us for details regarding preservation and amount.'
]::text[],
    requirements_label = 'Sample requirements',
    related_slugs = ARRAY[
  'whole-genome-metagenome',
  'whole-fungal-genome-sequencing',
  'phylogenetic-tree-construction'
]::text[],
    deliverables_note = NULL,
    image_width = 406,
    image_height = 287
WHERE slug = '16s-rrna-metagenome-sequencing'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Taxonomic Classification",
    "description": "Accurately identifying and classifying fungal species and strains."
  },
  {
    "title": "Pathogen Research",
    "description": "Investigating plant and human fungal pathogens and virulence factors."
  },
  {
    "title": "Industrial & Agricultural Fungi",
    "description": "Characterizing enzyme pathways and secondary metabolites in industrial strains."
  },
  {
    "title": "Comparative Genomics",
    "description": "Synteny and evolutionary analysis across fungal taxonomic groups."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "Can ClinGene perform DNA extraction from difficult fungal mycelia?",
    "answer": "Yes, specialized lysis and extraction protocols tailored for tough fungal cell walls are available as part of our laboratory service workflow."
  },
  {
    "question": "What quality metrics are evaluated on the assembled genome?",
    "answer": "We assess contiguity (N50, L50), total genome size, GC content, and genome completeness using standard BUSCO benchmarks."
  },
  {
    "question": "How do I ship fungal cultures or extracted DNA?",
    "answer": "Please reach out via the 'Request this service' button to receive safe packaging, biosafety compliance, and cold-chain shipping instructions."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Raw reads (FASTQ)',
  'Assembled genome (FASTA)',
  'Structural and functional annotation files (GFF / GTF)',
  'Assembly quality statistics (N50, BUSCO)',
  'Comprehensive analytical summary report'
]::text[],
    requirements = ARRAY[
  'Pure fungal culture or mycelium, or extracted DNA.',
  'Contact us for details regarding amount and shipping conditions.'
]::text[],
    requirements_label = 'Sample requirements',
    related_slugs = ARRAY[
  'whole-genome-metagenome',
  'plant-genome-sequencing',
  'phylogenetic-tree-construction'
]::text[],
    deliverables_note = NULL,
    image_width = 403,
    image_height = 297
WHERE slug = 'whole-fungal-genome-sequencing'
RETURNING slug;

UPDATE public.services
SET
    applications = $json$[
  {
    "title": "Crop Improvement",
    "description": "Breeding programs targeting yield, nutrition, and agronomic performance."
  },
  {
    "title": "Stress & Resistance Genes",
    "description": "Pinpointing loci associated with drought, salinity, and pest resistance."
  },
  {
    "title": "Variety Identification",
    "description": "Fingerprinting cultivar lines, landraces, and germplasm accessions."
  },
  {
    "title": "Plant Biodiversity",
    "description": "Investigating endangered flora and ecological adaptation mechanisms."
  }
]$json$::jsonb,
    faq = $json$[
  {
    "question": "How do you handle secondary metabolites during plant DNA extraction?",
    "answer": "We employ modified CTAB and polysaccharide-clearing protocols specifically optimized to remove polyphenols, tannins, and complex starches from plant tissue."
  },
  {
    "question": "Can resequencing be performed if a reference genome already exists?",
    "answer": "Yes, whole-genome resequencing against an existing reference genome is commonly performed for variant calling and marker discovery across varieties."
  },
  {
    "question": "How should plant tissue samples be preserved for shipment?",
    "answer": "Fresh young leaves on ice packs, flash-frozen tissue, or silica-gel dried leaf samples are accepted. Specific shipping protocols are confirmed upon inquiry."
  }
]$json$::jsonb,
    deliverables = ARRAY[
  'Raw reads (FASTQ)',
  'De novo assembly or aligned reads (BAM)',
  'Variant calls (VCF)',
  'Structural and functional annotation files',
  'Comprehensive analytical summary report'
]::text[],
    requirements = ARRAY[
  'Fresh young leaf tissue, frozen or silica-dried tissue, or extracted DNA.',
  'Contact us for details regarding sample amount and shipping requirements.'
]::text[],
    requirements_label = 'Sample requirements',
    related_slugs = ARRAY[
  'whole-fungal-genome-sequencing',
  'pangenome-analysis',
  'whole-genome-metagenome'
]::text[],
    deliverables_note = NULL,
    image_width = 406,
    image_height = 297
WHERE slug = 'plant-genome-sequencing'
RETURNING slug;
