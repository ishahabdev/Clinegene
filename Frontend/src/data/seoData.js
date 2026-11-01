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
  alternateName: ["Clingene", "ClinGene Pakistan"],
  url: `${BASE_URL}/`,
  logo: `${BASE_URL}/images/clingene-logo.webp`,
  image: DEFAULT_OG_IMAGE,
  email: COMPANY_EMAIL,
  telephone: COMPANY_PHONE,
  description:
    "ClinGene is a pioneer in life sciences, clinical genetic testing, Sanger sequencing, next-generation sequencing (NGS), and bioinformatics services in Islamabad, Pakistan.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Street 13, Lane 10, Hostel City, Chatta Bakhtawar, Chak Shahzad, Park Road",
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
  alternateName: ["ClinGene Lab", "ClinGene Pakistan", "Clingene"],
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
    title: "ClinGene | Clinical Genetic Testing Laboratory",
    description:
      "ClinGene provides genetic testing, Sanger sequencing, NGS, and bioinformatics services for researchers, clinicians and industry partners in Islamabad, Pakistan.",
    canonical: `${BASE_URL}/`,
    ogType: "website",
    schema: [
      ORGANIZATION_SCHEMA,
      SITELINKS_NAV_SCHEMA,
    ],
  },

  "/about": {
    title: "About Us | ClinGene",
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
    title: "Our Services | ClinGene",
    description:
      "Explore ClinGene's comprehensive genomic services in Pakistan: genetic counselling, Sanger sequencing, WES/WGS, RNA-seq, metagenomics, protein modeling, and more.",
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
    title: "Contact Us | ClinGene",
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

  "/blogs": {
    title: "Blogs & Articles | ClinGene",
    description:
      "Read the latest scientific articles, genomic research perspectives, and expert insights from the team at ClinGene Pakistan.",
    canonical: `${BASE_URL}/blogs`,
    ogType: "website",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Blogs", item: `${BASE_URL}/blogs` },
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

};

/**
 * Generate SEO metadata and structured JSON-LD schemas for a service
 * based on its Supabase row (or mapped service object).
 *
 * @param {Object} service - Supabase services row or service object
 * @returns {Object} SEO metadata object matching the shape of seoRoutes entries
 */
export function buildServiceSeo(service) {
  if (!service) return null;

  const titleName = service.title || service.name || "Genomic Service";
  const slug = service.slug;
  const canonicalUrl = `${BASE_URL}/services/${slug}`;
  const seoTitle = service.seo_title || `${titleName} in Pakistan | ClinGene`;
  const seoDesc =
    service.seo_description ||
    service.short_description ||
    service.tagline ||
    "";
  const serviceCategory = service.category || "Genomic Service";
  const descForSchema =
    service.short_description ||
    service.seo_description ||
    service.tagline ||
    "";

  return {
    title: seoTitle,
    description: seoDesc,
    canonical: canonicalUrl,
    ogType: "service",
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${BASE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${BASE_URL}/services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: titleName,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: titleName,
        url: canonicalUrl,
        serviceType: serviceCategory,
        description: descForSchema,
        provider: {
          "@id": `${BASE_URL}/#organization`,
        },
        areaServed: "Pakistan",
      },
    ],
  };
}
