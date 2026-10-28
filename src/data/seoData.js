/**
 * ClinGene Pakistan — Centralized SEO & Structured Data Registry
 * Contains unique titles, meta descriptions, canonical URLs, and JSON-LD schemas
 * for every public route on https://www.clingene.co.
 */

export const BASE_URL = "https://www.clingene.co";
export const COMPANY_NAME = "ClinGene (SMC-Private) Limited";
export const COMPANY_EMAIL = "info@clingene.co";
export const COMPANY_PHONE = "+923485607051";
export const COMPANY_LOCATION = "Islamabad, Pakistan";
export const DEFAULT_OG_IMAGE = `${BASE_URL}/images/og-image.jpg`;

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["MedicalOrganization", "ResearchOrganization", "Organization"],
  "@id": `${BASE_URL}/#organization`,
  name: "ClinGene",
  legalName: "ClinGene (SMC-Private) Limited",
  alternateName: ["Clingene", "ClinGene.co", "ClinGene Pakistan"],
  url: `${BASE_URL}/`,
  logo: `${BASE_URL}/images/clingene-logo.webp`,
  image: DEFAULT_OG_IMAGE,
  email: COMPANY_EMAIL,
  telephone: COMPANY_PHONE,
  description:
    "ClinGene is a pioneer in life sciences, clinical genetic testing, Sanger sequencing, next-generation sequencing (NGS), and bioinformatics services in Islamabad, Pakistan.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    addressCountry: "PK",
  },
  knowsAbout: [
    "Human Genetics",
    "Clinical Genetic Testing",
    "Sanger Sequencing",
    "Whole Exome Sequencing",
    "Whole Genome Sequencing",
    "Next Generation Sequencing",
    "Bioinformatics Analysis",
    "RNA Sequencing",
    "Metagenomics",
    "Precision Medicine"
  ],
  areaServed: {
    "@type": "Country",
    name: "Pakistan",
  },
};

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "ClinGene",
  alternateName: ["Clingene", "ClinGene.co"],
  url: `${BASE_URL}/`,
  description: "Pioneer in life sciences, clinical genetic testing, DNA sequencing and genomics research in Pakistan.",
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
  inLanguage: "en",
};

export const SITELINKS_NAV_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${BASE_URL}/#sitelinks-navigation`,
  name: "ClinGene Main Sitelinks",
  description: "Primary site hierarchy and navigational directories of ClinGene Pakistan.",
  itemListElement: [
    {
      "@type": "SiteNavigationElement",
      position: 1,
      name: "About ClinGene",
      description: "Life sciences research, mission, and regulatory compliance in Islamabad, Pakistan",
      url: `${BASE_URL}/about`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 2,
      name: "Genomic Services",
      description: "Comprehensive genetic testing, Sanger sequencing, NGS, and bioinformatics solutions",
      url: `${BASE_URL}/services`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 3,
      name: "Clinical Genetic Testing",
      description: "Diagnostic and carrier screening for inherited and rare genetic conditions in Pakistan",
      url: `${BASE_URL}/services/clinical-genetic-testing`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 4,
      name: "Sanger Sequencing",
      description: "Gold-standard Sanger DNA sequencing for mutation analysis and variant confirmation",
      url: `${BASE_URL}/services/sanger-sequencing`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 5,
      name: "Whole Genome Sequencing",
      description: "High-throughput whole exome and whole genome sequencing for clinical and research applications",
      url: `${BASE_URL}/services/whole-exome-genome-sequencing`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 6,
      name: "Scientific Team",
      description: "Meet our board of directors, clinical geneticists, molecular biologists, and bioinformaticians",
      url: `${BASE_URL}/team`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 7,
      name: "Research Insights",
      description: "Genomics research, academic collaborations, and precision medicine insights",
      url: `${BASE_URL}/research`,
    },
    {
      "@type": "SiteNavigationElement",
      position: 8,
      name: "Contact Lab",
      description: "Specimen receiving, test requisitions, sample storage, and laboratory consultations in Islamabad",
      url: `${BASE_URL}/contact`,
    },
  ],
};

export const seoRoutes = {
  "/": {
    title: "ClinGene | Pioneer in Life Sciences & Genetic Testing in Pakistan",
    description:
      "ClinGene provides genetic testing, Sanger sequencing, NGS, and bioinformatics services for researchers, clinicians and industry partners in Islamabad, Pakistan.",
    canonical: `${BASE_URL}/`,
    ogType: "website",
    schema: [
      ORGANIZATION_SCHEMA,
      WEBSITE_SCHEMA,
      SITELINKS_NAV_SCHEMA,
    ],
  },

  "/about": {
    title: "About ClinGene | Life Sciences Research in Islamabad, Pakistan",
    description:
      "Learn about ClinGene's mission to advance life sciences in Pakistan through precision genetic testing, applied research, and registered laboratory services.",
    canonical: `${BASE_URL}/about`,
    ogType: "website",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "About ClinGene", item: `${BASE_URL}/about` },
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
    title: "Comprehensive Genomic Solutions & Genetic Testing | ClinGene",
    description:
      "Explore 12 specialized genomic services in Pakistan: clinical genetic testing, Sanger sequencing, WES/WGS, RNA-seq, metagenomics, and molecular dynamics.",
    canonical: `${BASE_URL}/services`,
    ogType: "website",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Genomic Services", item: `${BASE_URL}/services` },
        ],
      },
    ],
  },

  "/team": {
    title: "Our Scientific Team & Geneticists - ClinGene",
    description:
      "Meet ClinGene's board of directors, clinical geneticists, molecular biologists, and bioinformaticians advancing genomic science in Islamabad, Pakistan.",
    canonical: `${BASE_URL}/team`,
    ogType: "website",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Scientific Team", item: `${BASE_URL}/team` },
        ],
      },
    ],
  },

  "/ceo-message": {
    title: "CEO Message - ClinGene",
    description:
      "Read the CEO message from Dr. Amjad Ali Tanoli on building Pakistan's genomic medicine ecosystem and training the next generation of researchers.",
    canonical: `${BASE_URL}/ceo-message`,
    ogType: "article",
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
    title: "Contact ClinGene | Specimen Receiving & Lab in Islamabad",
    description:
      "Contact ClinGene in Islamabad, Pakistan. Sample shipments, requisitions, pricing quotes, research inquiries, and genetic testing consultations.",
    canonical: `${BASE_URL}/contact`,
    ogType: "website",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Contact ClinGene", item: `${BASE_URL}/contact` },
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
    title: "Careers & Open Positions - ClinGene",
    description:
      "Join ClinGene's research community. Explore job openings, research fellowships, and internship opportunities in molecular biology and bioinformatics.",
    canonical: `${BASE_URL}/careers`,
    ogType: "website",
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
    title: "Careers & Open Positions - ClinGene",
    description:
      "Join ClinGene's research community. Explore job openings, research fellowships, and internship opportunities in molecular biology and bioinformatics.",
    canonical: `${BASE_URL}/careers`,
    ogType: "website",
    schema: [],
  },

  "/research": {
    title: "Genomics Research & Precision Medicine Insights | ClinGene",
    description:
      "Explore ClinGene's genomics research, biomedical collaborations, and scientific publications advancing precision medicine in Pakistan.",
    canonical: `${BASE_URL}/research`,
    ogType: "website",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Research Insights", item: `${BASE_URL}/research` },
        ],
      },
    ],
  },

  "/gallery": {
    title: "Gallery | ClinGene",
    description:
      "Take a look inside ClinGene's laboratory facilities, advanced sequencing hardware, research training workshops, and scientific events in Islamabad.",
    canonical: `${BASE_URL}/gallery`,
    ogType: "website",
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
    title: "News & Updates | ClinGene",
    description:
      "Stay informed on the latest genomics research milestones, laboratory service announcements, and scientific publications from ClinGene Pakistan.",
    canonical: `${BASE_URL}/news`,
    ogType: "website",
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
    title: "Page Not Found | ClinGene",
    description: "The page you are looking for does not exist on ClinGene Pakistan. Return to our homepage to explore our genomic testing and sequencing services.",
    canonical: `${BASE_URL}/404`,
    ogType: "website",
    robots: "noindex, follow",
    schema: [],
  },

  // ─── 12 Service Detail Pages ───
  "/services/clinical-genetic-testing": {
    title: "Clinical Genetic Testing in Pakistan | ClinGene",
    description:
      "Diagnostic and carrier genetic testing in Pakistan for inherited disorders. Interpreted reports with variant classification by certified geneticists.",
    canonical: `${BASE_URL}/services/clinical-genetic-testing`,
    ogType: "service",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Genomic Services", item: `${BASE_URL}/services` },
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
    title: "Sanger & DNA Sequencing Services in Pakistan | ClinGene",
    description:
      "High-accuracy Sanger DNA sequencing in Pakistan for PCR products and plasmids. Forward and reverse reads with quality-checked chromatograms (.ab1).",
    canonical: `${BASE_URL}/services/sanger-sequencing`,
    ogType: "service",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Genomic Services", item: `${BASE_URL}/services` },
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
    title: "Whole Genome & Exome Sequencing in Pakistan | ClinGene",
    description:
      "Comprehensive Whole Exome and Whole Genome Sequencing in Pakistan. FASTQ, BAM, VCF variant calling, and clinical trio annotation for rare diseases.",
    canonical: `${BASE_URL}/services/whole-exome-genome-sequencing`,
    ogType: "service",
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
    title: "RNA-Seq | ClinGene",
    description:
      "RNA sequencing and differential gene expression analysis in Pakistan. mRNA and total RNA-seq with PCA, volcano plots, and pathway enrichment.",
    canonical: `${BASE_URL}/services/rna-seq`,
    ogType: "service",
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
    title: "Single-cell RNA-seq Analysis | ClinGene",
    description:
      "Bioinformatics analysis for 10x Genomics scRNA-seq datasets in Pakistan. Quality control, UMAP clustering, cell-type annotation, and trajectory inference.",
    canonical: `${BASE_URL}/services/single-cell-rna-seq-analysis`,
    ogType: "service",
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
    title: "16S rRNA Metagenome Sequencing | ClinGene",
    description:
      "Microbiome profiling using 16S/18S/ITS amplicon sequencing in Pakistan. OTU/ASV clustering, alpha/beta diversity metrics, and taxonomic classification.",
    canonical: `${BASE_URL}/services/16s-rrna-metagenome-sequencing`,
    ogType: "service",
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
    title: "Whole Genome Metagenome | ClinGene",
    description:
      "Shotgun metagenomic sequencing and functional gene profiling in Pakistan. Metagenome assembly, MAG binning, and metabolic pathway reconstruction.",
    canonical: `${BASE_URL}/services/whole-genome-metagenome`,
    ogType: "service",
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
    title: "Whole Fungal Genome Sequencing | ClinGene",
    description:
      "De novo sequencing and annotation for fungal pathogens and industrial strains in Pakistan. High-accuracy assemblies and secondary metabolite profiling.",
    canonical: `${BASE_URL}/services/whole-fungal-genome-sequencing`,
    ogType: "service",
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
    title: "Pangenome Analysis | ClinGene",
    description:
      "Multi-strain pangenome construction and comparative genomics in Pakistan. Characterize core, dispensable, and strain-specific accessory genes.",
    canonical: `${BASE_URL}/services/pangenome-analysis`,
    ogType: "service",
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
    title: "Phylogenetic Tree Construction | ClinGene",
    description:
      "Phylogenetic analysis and evolutionary tree construction in Pakistan using Maximum Likelihood, Bayesian, and Neighbor-Joining algorithms.",
    canonical: `${BASE_URL}/services/phylogenetic-tree-construction`,
    ogType: "service",
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
    title: "Plant Genome Sequencing | ClinGene",
    description:
      "De novo and re-sequencing for crop and medicinal plant species in Pakistan. Genome assembly, structural variant discovery, and marker development.",
    canonical: `${BASE_URL}/services/plant-genome-sequencing`,
    ogType: "service",
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
    title: "Protein Docking & Molecular Dynamics | ClinGene",
    description:
      "Computational drug discovery and protein-ligand docking in Pakistan. GROMACS/AMBER molecular dynamics simulations with binding free energy analysis.",
    canonical: `${BASE_URL}/services/protein-docking-molecular-dynamics`,
    ogType: "service",
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
