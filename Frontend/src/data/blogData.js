// Authentic ClinGene Blog, News & Scientific Press Releases

export const BLOG_CATEGORIES = [
  "All Articles",
  "Announcement",
  "Research",
  "Clinical Genetics",
  "Events & Outreach",
  "Education",
];

export const BLOG_ARTICLES = [
  {
    id: "clinical-exome-launch-islamabad",
    slug: "clinical-exome-launch-islamabad",
    title: "ClinGene Launches Advanced Clinical Exome Sequencing in Islamabad",
    subtitle: "High-throughput Next-Generation Sequencing now accessible locally with certified ACMG variant reporting and genetic counseling.",
    category: "Announcement",
    featured: true,
    author: {
      name: "Dr. Amjad Ali Tanoli Ph.D",
      role: "CEO & Director (Founder)",
      designation: "Human Geneticist",
    },
    date: "October 24, 2026",
    isoDate: "2026-10-24",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&auto=format&fit=crop&q=80",
    tags: ["Clinical Exome", "Genomics", "Islamabad", "ACMG"],
    excerpt:
      "ClinGene has inaugurated its premier high-throughput sequencing suite in Islamabad, bringing state-of-the-art Clinical Whole Exome Sequencing (WES) to patients and clinicians across Pakistan without the delays and risks of overseas sample shipping.",
    body: [
      "Historically, clinical genomics samples from Pakistan had to be shipped overseas to laboratories in Europe, the United States, or China, resulting in turn-around times exceeding 6 to 8 weeks, prohibitive currency costs, and sample degradation risks during transit.",
      "With ClinGene’s accredited laboratory infrastructure at Park Road, Islamabad, patient samples are prepared, sequenced at 100x mean target coverage, and interpreted by our board-certified human geneticists within 10 to 14 business days.",
      "Each exome report includes rigorous classification according to American College of Medical Genetics and Genomics (ACMG) guidelines, accompanied by one-on-one pre- and post-test genetic counseling to ensure patients and families fully understand their molecular findings.",
    ],
  },
  {
    id: "world-dna-day-symposium",
    slug: "world-dna-day-symposium",
    title: "Celebrating World DNA Day: Advancing Precision Genomics in Pakistan",
    subtitle: "Leading geneticists, oncologists, and bioinformaticians convene at ClinGene to chart the future of personalized medicine.",
    category: "Events & Outreach",
    featured: false,
    author: {
      name: "Dr. Safdar Ali, Ph.D, Postdoc",
      role: "Managing Director / Co-CEO",
      designation: "Medical Physicist",
    },
    date: "April 25, 2026",
    isoDate: "2026-04-25",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=900&auto=format&fit=crop&q=80",
    tags: ["DNA Day", "Symposium", "Precision Medicine", "Healthcare"],
    excerpt:
      "ClinGene commemorated World DNA Day by hosting a national genomic symposium uniting clinicians, geneticists, and university researchers to discuss population genomics, rare diseases, and cancer precision therapeutics.",
    body: [
      "Dr. Safdar Ali highlighted the clinical revolution occurring at the intersection of medical physics, clinical radiotherapy, and targeted genomic biomarker profiling.",
      "Keynote addresses covered the imperative need for indigenous genetic repositories, emphasizing that South Asian genomic diversity must be properly cataloged to prevent misdiagnoses caused by reliance on Western reference genomes.",
      "Students and research fellows from QAU, NUST, and COMSATS attended hands-on workshops exploring automated variant annotation pipelines and tertiary protein modeling.",
    ],
  },
  {
    id: "novel-cardiomyopathy-variants",
    slug: "novel-cardiomyopathy-variants",
    title: "Novel Pathogenic Variants Identified in Hereditary Cardiomyopathies",
    subtitle: "Targeted cardiac gene panel reveals high-penetrance mutations in Pakistani families with sudden cardiac arrest history.",
    category: "Research",
    featured: false,
    author: {
      name: "Dr. Kifayat Ullah, Ph.D",
      role: "Lead Molecular Biologist & Human Geneticist",
      designation: "Head of Genomic Medicine",
    },
    date: "February 14, 2026",
    isoDate: "2026-02-14",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&auto=format&fit=crop&q=80",
    tags: ["Cardiomyopathy", "Targeted Panel", "Cardiac Genetics", "Research"],
    excerpt:
      "A clinical study spearheaded by ClinGene's Human Genetics Department has characterized novel frameshift mutations in the MYH7 and TNNT2 genes responsible for familial hypertrophic cardiomyopathy in three independent lineages.",
    body: [
      "Sudden unexpected death in young individuals often stems from inherited cardiac channelopathies or cardiomyopathies that remain undiagnosed until post-mortem examination.",
      "Using our high-depth 174-gene Cardiac Panel, our research group screened 48 families presenting with unexplained syncope or early sudden cardiac arrest.",
      "The identification of novel truncated alleles allows immediate cascade testing for at-risk first-degree relatives, enabling life-saving prophylactic implantable cardioverter-defibrillator (ICD) placements and lifestyle modifications.",
    ],
  },
  {
    id: "pakistani-allele-frequency-database",
    slug: "pakistani-allele-frequency-database",
    title: "Building the Pakistani Population Allele Frequency Atlas (PakGen-AF)",
    subtitle: "A decisive step toward eliminating diagnostic disparities and false positive variant calls in South Asian genomics.",
    category: "Clinical Genetics",
    featured: false,
    author: {
      name: "Mudassir Alvi Ph.D",
      role: "Senior Bioinformatician & Pipeline Engineer",
      designation: "Bioinformatics Lead",
    },
    date: "December 18, 2025",
    isoDate: "2025-12-18",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&auto=format&fit=crop&q=80",
    tags: ["Population Health", "Bioinformatics", "Allele Frequency", "PakGen"],
    excerpt:
      "ClinGene’s computational biology wing has published the inaugural release of the PakGen-AF repository, cataloging over 4.2 million localized single nucleotide polymorphisms from healthy Pakistani donors.",
    body: [
      "Clinical laboratories worldwide routinely query databases like gnomAD, 1000 Genomes, and ClinVar to evaluate whether an observed variant is rare enough to be considered disease-causing.",
      "However, South Asian cohorts—and particularly Pakistani consanguineous populations—have historically been underrepresented, causing benign regional variants to be incorrectly classified as 'Variants of Uncertain Significance' (VUS) or false positives.",
      "With PakGen-AF, our automated variant annotation pipeline filters out harmless ethnic polymorphisms, boosting definitive diagnostic confidence for clinicians and patients.",
    ],
  },
  {
    id: "crop-genomics-pangenome-release",
    slug: "crop-genomics-pangenome-release",
    title: "Comprehensive Horticultural & Crop Pangenomics Platform Unveiled",
    subtitle: "Accelerating agricultural resilience and crop yield through long-read sequencing and structural variant identification.",
    category: "Research",
    featured: false,
    author: {
      name: "Dr. Abid Ali, Ph.D, Postdoc",
      role: "Senior Plant Geneticist & Olericulture Specialist",
      designation: "Agricultural Genomics Lead",
    },
    date: "September 12, 2025",
    isoDate: "2025-09-12",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=900&auto=format&fit=crop&q=80",
    tags: ["Agriculture", "Pangenomics", "Plant Breeding", "Bioinformatics"],
    excerpt:
      "ClinGene’s Laboratory Sciences Division has launched an integrated plant genomics pipeline combining Oxford Nanopore ultra-long reads with high-throughput Illumina short reads to resolve complex polyploid plant genomes.",
    body: [
      "Climatic stress and emergent fungal blights pose serious challenges to Pakistan's agricultural sustainability and horticultural export potential.",
      "Dr. Abid Ali and Dr. Samrana demonstrated how de novo graph pangenomes capture the presence-absence variations (PAVs) that conventional reference genomes miss completely.",
      "This service enables seed breeders, research institutes, and agricultural universities to map quantitative trait loci (QTLs) for drought resistance, salinity tolerance, and enhanced nutrient uptake.",
    ],
  },
  {
    id: "hands-on-ngs-workshop",
    slug: "hands-on-ngs-workshop",
    title: "Practical Next-Generation Sequencing & Bioinformatics Training Workshop",
    subtitle: "Empowering young scientists, postgraduate researchers, and clinical lab technicians with modern NGS library prep skills.",
    category: "Education",
    featured: false,
    author: {
      name: "Mr. Muhammad Tahir Ullah Ph.D",
      role: "Senior Molecular Biologist",
      designation: "Human Genetics Specialist",
    },
    date: "July 08, 2025",
    isoDate: "2025-07-08",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
    tags: ["Training", "Workshop", "NGS Hands-on", "Capacity Building"],
    excerpt:
      "A 3-day intensive wet-lab and computational training course hosted at ClinGene's Islamabad facility trained 30 molecular biology scholars on DNA extraction, quality control, library fragmentation, and variant calling.",
    body: [
      "Bridging the gap between theoretical genetics curricula and cutting-edge clinical laboratory practice is a core pillar of ClinGene’s educational mission.",
      "Participants engaged directly with fluorometric quantitation (Qubit), automated fragment analysis, and Linux-based bioinformatic pipelines executing BWA-MEM alignment and GATK variant calling.",
      "ClinGene plans to run bi-annual certified training cohorts to nurture local scientific talent and establish Pakistan as a regional hub for genomics excellence.",
    ],
  },
];

