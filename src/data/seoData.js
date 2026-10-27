/**
 * ClinGene Pakistan — Centralized SEO & Structured Data Registry
 * Contains unique titles, meta descriptions, canonical URLs, and JSON-LD schemas
 * for every public route on https://clingene.co.
 */

export const BASE_URL = "https://clingene.co";
export const DEFAULT_OG_IMAGE = `${BASE_URL}/images/og-image.jpg`;

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "@id": `${BASE_URL}/#organization`,
  name: "ClinGene (Pvt.) Ltd.",
  alternateName: ["ClinGene Pakistan", "ClinGene Genomics", "ClinGene"],
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/images/clingene-logo.webp`,
    width: 450,
    height: 189,
  },
  image: DEFAULT_OG_IMAGE,
  description:
    "ClinGene is Pakistan's premier human genetics and precision genomics laboratory, providing clinical genetic testing, next-generation sequencing, and computational biology services.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Street 13, Lane 10, Hostel City, Chatta Bakhtawar, Chak Shahzad, Park Road",
    addressLocality: "Islamabad",
    addressRegion: "Federal Capital",
    postalCode: "45550",
    addressCountry: "PK",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+92-3485607051",
      contactType: "customer service",
      areaServed: "PK",
      availableLanguage: ["English", "Urdu"],
    },
  ],
  sameAs: [
    "https://linkedin.com/company/clingene",
    "https://x.com/clingene",
    "https://facebook.com/clingene",
  ],
};

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "ClinGene Pakistan",
  description: "Advancing precision medicine, genetic testing and genomic research in Pakistan.",
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
  inLanguage: "en",
};

export const seoRoutes = {
  "/": {
    title: "ClinGene (Pvt) Ltd. — Genetic Testing & Genomics in Pakistan",
    description:
      "ClinGene is Pakistan's premier human genetics platform providing clinical genetic testing, Sanger sequencing, whole exome/genome sequencing, and bioinformatics.",
    canonical: `${BASE_URL}/`,
    ogType: "website",
    keywords:
      "genetic testing Pakistan, Sanger sequencing Pakistan, whole genome sequencing Pakistan, bioinformatics services Islamabad, exome sequencing Pakistan",
    schema: [
      ORGANIZATION_SCHEMA,
      WEBSITE_SCHEMA,
    ],
  },

  "/about": {
    title: "About Us — ClinGene (Pvt) Ltd.",
    description:
      "Learn about ClinGene's mission to advance life sciences in Pakistan through precision genetic testing, applied research, and world-class laboratory facilities.",
    canonical: `${BASE_URL}/about`,
    ogType: "website",
    keywords:
      "about ClinGene, genomics laboratory Islamabad, life sciences Pakistan, human genetics research Pakistan",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "About Us", item: `${BASE_URL}/about` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        url: `${BASE_URL}/about`,
        name: "About ClinGene Pakistan",
        publisher: { "@id": `${BASE_URL}/#organization` },
      },
    ],
  },

  "/services": {
    title: "Services — ClinGene (Pvt) Ltd.",
    description:
      "Explore 12 specialized genomic services in Pakistan: clinical genetic testing, Sanger sequencing, WES/WGS, RNA-seq, metagenomics, and molecular dynamics.",
    canonical: `${BASE_URL}/services`,
    ogType: "website",
    keywords:
      "genomics services Pakistan, DNA sequencing Pakistan, NGS Pakistan, clinical exome sequencing Islamabad",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
        ],
      },
    ],
  },

  "/team": {
    title: "Our Team — ClinGene (Pvt) Ltd.",
    description:
      "Meet ClinGene's board of directors, clinical geneticists, molecular biologists, and bioinformaticians advancing genomic science in Islamabad, Pakistan.",
    canonical: `${BASE_URL}/team`,
    ogType: "website",
    keywords:
      "ClinGene team, geneticists Pakistan, Dr Amjad Ali Tanoli, molecular biology researchers Islamabad",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Team", item: `${BASE_URL}/team` },
        ],
      },
    ],
  },

  "/ceo-message": {
    title: "CEO Message — ClinGene (Pvt) Ltd.",
    description:
      "Read the CEO message from Dr. Amjad Ali Tanoli on building Pakistan's genomic medicine ecosystem and training the next generation of researchers.",
    canonical: `${BASE_URL}/ceo-message`,
    ogType: "article",
    keywords: "CEO message ClinGene, Dr Amjad Ali Tanoli, precision medicine Pakistan",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "CEO Message", item: `${BASE_URL}/ceo-message` },
        ],
      },
    ],
  },

  "/contact": {
    title: "Contact Us — ClinGene (Pvt) Ltd.",
    description:
      "Get in touch with ClinGene's scientific directors in Islamabad. Requisitions, sample shipments, quotes, research inquiries, and careers.",
    canonical: `${BASE_URL}/contact`,
    ogType: "website",
    keywords:
      "contact ClinGene, sample shipments Islamabad, genetic testing inquiry Pakistan, ClinGene address",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Contact", item: `${BASE_URL}/contact` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        url: `${BASE_URL}/contact`,
        name: "Contact ClinGene Pakistan",
      },
    ],
  },

  "/careers": {
    title: "Careers — ClinGene (Pvt) Ltd.",
    description:
      "Join ClinGene's research community. Explore job openings, research fellowships, and internship opportunities in molecular biology and bioinformatics.",
    canonical: `${BASE_URL}/careers`,
    ogType: "website",
    keywords:
      "genomics jobs Pakistan, bioinformatics careers Islamabad, molecular biology internships, ClinGene hiring",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Careers", item: `${BASE_URL}/careers` },
        ],
      },
    ],
  },

  "/open-positions": {
    title: "Open Positions — ClinGene (Pvt) Ltd.",
    description:
      "Join ClinGene's research community. Explore job openings, research fellowships, and internship opportunities in molecular biology and bioinformatics.",
    canonical: `${BASE_URL}/careers`,
    ogType: "website",
    keywords: "ClinGene careers, open positions, scientific jobs Pakistan",
    schema: [],
  },

  "/research": {
    title: "Research — ClinGene (Pvt) Ltd.",
    description:
      "Discover ClinGene's research initiatives in population genomics, rare genetic disorders, and academic-industry scientific partnerships in Pakistan.",
    canonical: `${BASE_URL}/research`,
    ogType: "website",
    keywords: "genetics research Pakistan, human genomics Islamabad, academic collaboration",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Research", item: `${BASE_URL}/research` },
        ],
      },
    ],
  },

  "/gallery": {
    title: "Gallery — ClinGene (Pvt) Ltd.",
    description:
      "Take a look inside ClinGene's laboratory facilities, advanced sequencing hardware, research training workshops, and scientific events in Islamabad.",
    canonical: `${BASE_URL}/gallery`,
    ogType: "website",
    keywords: "ClinGene lab gallery, genomics facilities Islamabad, laboratory photos",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Gallery", item: `${BASE_URL}/gallery` },
        ],
      },
    ],
  },

  "/news": {
    title: "News — ClinGene (Pvt) Ltd.",
    description:
      "Stay informed on the latest genomics research milestones, laboratory service announcements, and scientific publications from ClinGene Pakistan.",
    canonical: `${BASE_URL}/news`,
    ogType: "website",
    keywords: "ClinGene news, genetics announcements Pakistan, genomics updates",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "News", item: `${BASE_URL}/news` },
        ],
      },
    ],
  },

  "404": {
    title: "Page Not Found — ClinGene (Pvt) Ltd.",
    description: "The page you are looking for does not exist on ClinGene Pakistan. Return to our homepage to explore our genomic testing and sequencing services.",
    canonical: `${BASE_URL}/404`,
    ogType: "website",
    schema: [],
  },

  // ─── 12 Service Detail Pages ───
  "/services/clinical-genetic-testing": {
    title: "Clinical Genetic Testing — ClinGene (Pvt) Ltd.",
    description:
      "Diagnostic and carrier genetic testing in Pakistan for inherited disorders. Interpreted reports with variant classification by certified geneticists.",
    canonical: `${BASE_URL}/services/clinical-genetic-testing`,
    ogType: "service",
    keywords: "clinical genetic testing Pakistan, diagnostic DNA testing Islamabad, inherited disorder screening",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
          { "@type": "ListItem", position: 3, name: "Clinical Genetic Testing", item: `${BASE_URL}/services/clinical-genetic-testing` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Clinical Genetic Testing",
        provider: { "@id": `${BASE_URL}/#organization` },
        url: `${BASE_URL}/services/clinical-genetic-testing`,
        serviceType: "Medical Genetic Testing",
        description: "Targeted and panel-based genetic testing to detect disease-causing variants in inherited disorders.",
        areaServed: "Pakistan",
      },
    ],
  },

  "/services/sanger-sequencing": {
    title: "Sanger Sequencing — ClinGene (Pvt) Ltd.",
    description:
      "High-accuracy Sanger DNA sequencing in Pakistan for PCR products and plasmids. Forward and reverse reads with quality-checked chromatograms (.ab1).",
    canonical: `${BASE_URL}/services/sanger-sequencing`,
    ogType: "service",
    keywords: "Sanger sequencing Pakistan, capillary sequencing Islamabad, plasmid sequencing, PCR sequencing",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
          { "@type": "ListItem", position: 3, name: "Sanger Sequencing", item: `${BASE_URL}/services/sanger-sequencing` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Sanger Sequencing",
        provider: { "@id": `${BASE_URL}/#organization` },
        url: `${BASE_URL}/services/sanger-sequencing`,
        serviceType: "DNA Sequencing",
        description: "Capillary electrophoresis Sanger sequencing of PCR products, plasmids, and targeted mutations.",
        areaServed: "Pakistan",
      },
    ],
  },

  "/services/whole-exome-genome-sequencing": {
    title: "Whole Exome / Genome Sequencing — ClinGene (Pvt) Ltd.",
    description:
      "Comprehensive Whole Exome and Whole Genome Sequencing in Pakistan. FASTQ, BAM, VCF variant calling, and clinical trio annotation for rare diseases.",
    canonical: `${BASE_URL}/services/whole-exome-genome-sequencing`,
    ogType: "service",
    keywords: "whole exome sequencing Pakistan, WGS Pakistan, WES sequencing Islamabad, clinical exome Pakistan",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
          { "@type": "ListItem", position: 3, name: "Whole Exome / Genome Sequencing", item: `${BASE_URL}/services/whole-exome-genome-sequencing` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Whole Exome and Whole Genome Sequencing",
        provider: { "@id": `${BASE_URL}/#organization` },
        url: `${BASE_URL}/services/whole-exome-genome-sequencing`,
        serviceType: "Next-Generation Sequencing",
        description: "High-throughput exome and whole genome sequencing for rare disease genetics, oncology, and discovery.",
        areaServed: "Pakistan",
      },
    ],
  },

  "/services/rna-seq": {
    title: "RNA-Seq — ClinGene (Pvt) Ltd.",
    description:
      "RNA sequencing and differential gene expression analysis in Pakistan. mRNA and total RNA-seq with PCA, volcano plots, and pathway enrichment.",
    canonical: `${BASE_URL}/services/rna-seq`,
    ogType: "service",
    keywords: "RNA-Seq Pakistan, transcriptome sequencing Islamabad, differential gene expression, RNA sequencing lab",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
          { "@type": "ListItem", position: 3, name: "RNA-Seq", item: `${BASE_URL}/services/rna-seq` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "RNA-Seq (Transcriptome Sequencing)",
        provider: { "@id": `${BASE_URL}/#organization` },
        url: `${BASE_URL}/services/rna-seq`,
        serviceType: "Transcriptomics",
        description: "Illumina-based RNA sequencing for gene expression profiling, isoform discovery, and pathway enrichment.",
        areaServed: "Pakistan",
      },
    ],
  },

  "/services/single-cell-rna-seq-analysis": {
    title: "Single-cell RNA-seq Analysis — ClinGene (Pvt) Ltd.",
    description:
      "Bioinformatics analysis for 10x Genomics scRNA-seq datasets in Pakistan. Quality control, UMAP clustering, cell-type annotation, and trajectory inference.",
    canonical: `${BASE_URL}/services/single-cell-rna-seq-analysis`,
    ogType: "service",
    keywords: "single cell RNA seq Pakistan, scRNA-seq bioinformatics Islamabad, 10x Genomics analysis, UMAP clustering",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
          { "@type": "ListItem", position: 3, name: "Single-cell RNA-seq Data Analysis", item: `${BASE_URL}/services/single-cell-rna-seq-analysis` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Single-cell RNA-seq Data Analysis",
        provider: { "@id": `${BASE_URL}/#organization` },
        url: `${BASE_URL}/services/single-cell-rna-seq-analysis`,
        serviceType: "Computational Biology",
        description: "Comprehensive computational workflow for single-cell transcriptomics data analysis.",
        areaServed: "Pakistan",
      },
    ],
  },

  "/services/16s-rrna-metagenome-sequencing": {
    title: "16S rRNA Metagenome Sequencing — ClinGene (Pvt) Ltd.",
    description:
      "Microbiome profiling using 16S/18S/ITS amplicon sequencing in Pakistan. OTU/ASV clustering, alpha/beta diversity metrics, and taxonomic classification.",
    canonical: `${BASE_URL}/services/16s-rrna-metagenome-sequencing`,
    ogType: "service",
    keywords: "16S rRNA sequencing Pakistan, microbiome sequencing Islamabad, amplicon metagenomics, gut microbiome test",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
          { "@type": "ListItem", position: 3, name: "16S rRNA Metagenome Sequencing", item: `${BASE_URL}/services/16s-rrna-metagenome-sequencing` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "16S rRNA Metagenome Sequencing",
        provider: { "@id": `${BASE_URL}/#organization` },
        url: `${BASE_URL}/services/16s-rrna-metagenome-sequencing`,
        serviceType: "Metagenomics",
        description: "Targeted hypervariable region amplicon sequencing for bacterial and fungal community identification.",
        areaServed: "Pakistan",
      },
    ],
  },

  "/services/whole-genome-metagenome": {
    title: "Whole Genome Metagenome — ClinGene (Pvt) Ltd.",
    description:
      "Shotgun metagenomic sequencing and functional gene profiling in Pakistan. Metagenome assembly, MAG binning, and metabolic pathway reconstruction.",
    canonical: `${BASE_URL}/services/whole-genome-metagenome`,
    ogType: "service",
    keywords: "shotgun metagenomics Pakistan, metagenome assembly Islamabad, MAG binning, microbial functional profiling",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
          { "@type": "ListItem", position: 3, name: "Whole Genome Metagenome", item: `${BASE_URL}/services/whole-genome-metagenome` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Whole Genome Metagenomics",
        provider: { "@id": `${BASE_URL}/#organization` },
        url: `${BASE_URL}/services/whole-genome-metagenome`,
        serviceType: "Metagenomics",
        description: "Untargeted shotgun sequencing of environmental and clinical microbial communities.",
        areaServed: "Pakistan",
      },
    ],
  },

  "/services/whole-fungal-genome-sequencing": {
    title: "Whole Fungal Genome Sequencing — ClinGene (Pvt) Ltd.",
    description:
      "De novo sequencing and annotation for fungal pathogens and industrial strains in Pakistan. High-accuracy assemblies and secondary metabolite profiling.",
    canonical: `${BASE_URL}/services/whole-fungal-genome-sequencing`,
    ogType: "service",
    keywords: "fungal genome sequencing Pakistan, mycology genomics Islamabad, de novo fungal assembly",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
          { "@type": "ListItem", position: 3, name: "Whole Fungal Genome Sequencing", item: `${BASE_URL}/services/whole-fungal-genome-sequencing` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Whole Fungal Genome Sequencing",
        provider: { "@id": `${BASE_URL}/#organization` },
        url: `${BASE_URL}/services/whole-fungal-genome-sequencing`,
        serviceType: "Genome Sequencing",
        description: "Comprehensive fungal genome sequencing, assembly, and gene annotation.",
        areaServed: "Pakistan",
      },
    ],
  },

  "/services/pangenome-analysis": {
    title: "Pangenome Analysis — ClinGene (Pvt) Ltd.",
    description:
      "Multi-strain pangenome construction and comparative genomics in Pakistan. Characterize core, dispensable, and strain-specific accessory genes.",
    canonical: `${BASE_URL}/services/pangenome-analysis`,
    ogType: "service",
    keywords: "pangenome analysis Pakistan, comparative genomics Islamabad, core genome analysis, gene presence absence",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
          { "@type": "ListItem", position: 3, name: "Pangenome Analysis", item: `${BASE_URL}/services/pangenome-analysis` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Pangenome Analysis",
        provider: { "@id": `${BASE_URL}/#organization` },
        url: `${BASE_URL}/services/pangenome-analysis`,
        serviceType: "Bioinformatics",
        description: "High-resolution comparative genomics across microbial, plant, and animal cohorts.",
        areaServed: "Pakistan",
      },
    ],
  },

  "/services/phylogenetic-tree-construction": {
    title: "Phylogenetic Tree Construction — ClinGene (Pvt) Ltd.",
    description:
      "Phylogenetic analysis and evolutionary tree construction in Pakistan using Maximum Likelihood, Bayesian, and Neighbor-Joining algorithms.",
    canonical: `${BASE_URL}/services/phylogenetic-tree-construction`,
    ogType: "service",
    keywords: "phylogenetic tree Pakistan, evolutionary analysis Islamabad, molecular phylogenetics, Maximum Likelihood tree",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
          { "@type": "ListItem", position: 3, name: "Phylogenetic Tree Construction", item: `${BASE_URL}/services/phylogenetic-tree-construction` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Phylogenetic Tree Construction",
        provider: { "@id": `${BASE_URL}/#organization` },
        url: `${BASE_URL}/services/phylogenetic-tree-construction`,
        serviceType: "Bioinformatics",
        description: "Multi-sequence alignment, model testing, and publication-ready phylogenetic visualization.",
        areaServed: "Pakistan",
      },
    ],
  },

  "/services/plant-genome-sequencing": {
    title: "Plant Genome Sequencing — ClinGene (Pvt) Ltd.",
    description:
      "De novo and re-sequencing for crop and medicinal plant species in Pakistan. Genome assembly, structural variant discovery, and marker development.",
    canonical: `${BASE_URL}/services/plant-genome-sequencing`,
    ogType: "service",
    keywords: "plant genome sequencing Pakistan, crop genomics Islamabad, agricultural genetics Pakistan",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
          { "@type": "ListItem", position: 3, name: "Plant Genome Sequencing", item: `${BASE_URL}/services/plant-genome-sequencing` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Plant Genome Sequencing",
        provider: { "@id": `${BASE_URL}/#organization` },
        url: `${BASE_URL}/services/plant-genome-sequencing`,
        serviceType: "Agricultural Genomics",
        description: "Sequencing and bioinformatics for complex polyploid and diploid plant genomes.",
        areaServed: "Pakistan",
      },
    ],
  },

  "/services/protein-docking-molecular-dynamics": {
    title: "Protein Docking & Molecular Dynamics — ClinGene (Pvt) Ltd.",
    description:
      "Computational drug discovery and protein-ligand docking in Pakistan. GROMACS/AMBER molecular dynamics simulations with binding free energy analysis.",
    canonical: `${BASE_URL}/services/protein-docking-molecular-dynamics`,
    ogType: "service",
    keywords: "molecular dynamics Pakistan, protein docking Islamabad, in silico drug design, GROMACS simulation Pakistan",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
          { "@type": "ListItem", position: 3, name: "Protein Docking & Molecular Dynamics", item: `${BASE_URL}/services/protein-docking-molecular-dynamics` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Protein Docking & Molecular Dynamics Simulation",
        provider: { "@id": `${BASE_URL}/#organization` },
        url: `${BASE_URL}/services/protein-docking-molecular-dynamics`,
        serviceType: "Computational Biophysics",
        description: "Atomistic molecular dynamics simulations, binding affinity calculation, and structural modeling.",
        areaServed: "Pakistan",
      },
    ],
  },
};

