// =============================================================================
// TEAM PAGE CONFIGURATION - Single Source of Truth
// =============================================================================
// Replace all placeholder data with real company information

import team1 from "../assets/team/1team.png";
import team2 from "../assets/team/2team.png";
import team3 from "../assets/team/3team.png";
import team4 from "../assets/team/4team.png";
import team5 from "../assets/team/5team.png";

// -----------------------------------------------------------------------------
// COMPANY STATS - Used across Hero and Stats sections
// -----------------------------------------------------------------------------
export const companyStats = {
  teamMembers: "30+",
  departments: 5,
  yearsExperience: "15+",
  projectsCompleted: "200+",
};

// -----------------------------------------------------------------------------
// TEAM MEMBERS - Single data source for all team displays
// -----------------------------------------------------------------------------
export const teamMembers = [
  // --- EXECUTIVE LEADERSHIP ---
  {
    id: "dr-amjad-ali-tanoli",
    name: "Dr. Amjad Ali Tanoli",
    role: "Chief Executive Officer & Founder",
    department: "Leadership",
    type: "executive", // Used to filter executives
    image: team1,
    imageAlt: "Dr. Amjad Ali Tanoli, CEO and Founder of ClinGene",
    // Focal point: adjust to show face properly (format: "horizontal% vertical%")
    imagePosition: "center 20%", // TWEAKABLE: CEO photo crop position
    bio: "Dr. Amjad Ali Tanoli is the founder and CEO of ClinGene, driving Pakistan's first human genetics and precision medicine platform. With over 15 years of international research experience, he bridges clinical genetics and genomic technology to advance healthcare innovation in the region.", // Clean, concise bio
    tags: ["Clinical Genetics", "Precision Medicine", "Leadership"],
    email: "amjad.tanoli@clingene.pk",
    linkedin: "https://linkedin.com/in/amjad-ali-tanoli"
  },
  {
    id: "dr-safdar-ali-tanoli",
    name: "Dr. Safdar Ali Tanoli",
    role: "Co-CEO & Postdoc Lead",
    department: "Leadership",
    type: "executive",
    image: team2,
    imageAlt: "Dr. Safdar Ali Tanoli, Co-CEO and Postdoc Lead at ClinGene",
    // Focal point: adjusted to show full face including forehead and hair
    imagePosition: "center 8%", // TWEAKABLE: Co-CEO photo crop position (lower % = more headroom)
    bio: "Dr. Safdar Ali Tanoli serves as Co-CEO and Postdoc Lead at ClinGene. A medical physicist by training, he previously worked at the Princess Margaret Cancer Research Centre in Toronto, Canada. His expertise lies in computational oncology and translational research pipelines. He champions interdisciplinary approaches to genomic medicine and precision diagnostics.", // Extended by one line
    tags: ["Medical Physics", "Oncology", "Research"],
    email: "safdar.tanoli@clingene.pk",
    linkedin: "https://linkedin.com/in/safdar-ali-tanoli-phd"
  },

  // --- SCIENTIFIC & CLINICAL TEAM (Carousel) ---
  {
    id: "dr-kifayat-ullah",
    name: "Dr. Kifayat Ullah",
    role: "Head of Human Genetics",
    department: "Genetics",
    type: "team",
    image: team3,
    imageAlt: "Dr. Kifayat Ullah, Head of Human Genetics at ClinGene",
    imagePosition: "center 20%", // TWEAKABLE: carousel card photo crop
    bio: "Dr. Kifayat Ullah leads the Human Genetics division at ClinGene, overseeing clinical genetic testing and molecular diagnostics. His research focuses on identifying novel genetic variants associated with rare diseases in the South Asian population.",
    tags: ["Molecular Diagnostics", "Genetics", "Research"],
    email: "kifayat.ullah@clingene.pk",
    linkedin: "https://linkedin.com/in/kifayat-ullah-phd"
  },
  {
    id: "dr-elena-rostova",
    name: "Dr. Elena Rostova",
    role: "Chief Laboratory Director",
    department: "Laboratory",
    type: "team",
    image: team4,
    imageAlt: "Dr. Elena Rostova, Chief Laboratory Director at ClinGene",
    imagePosition: "center 20%", // TWEAKABLE: carousel card photo crop
    bio: "Dr. Elena Rostova serves as Chief Laboratory Director, overseeing all diagnostic operations and quality assurance protocols. With expertise in clinical pathology and laboratory accreditation, she ensures the highest standards of diagnostic excellence.",
    tags: ["Pathology", "QA Control", "Lab Ops"],
    email: "elena.rostova@clingene.pk",
    linkedin: "https://linkedin.com/in/elena-rostova-phd"
  },
  {
    id: "dr-tariq-mahmood",
    name: "Dr. Tariq Mahmood",
    role: "Lead Bioinformatician",
    department: "Bioinformatics",
    type: "team",
    image: team5,
    imageAlt: "Dr. Tariq Mahmood, Lead Bioinformatician at ClinGene",
    imagePosition: "center 20%", // TWEAKABLE: carousel card photo crop
    bio: "Dr. Tariq Mahmood leads the bioinformatics division, specializing in AI-driven diagnostic tools and genomic data analysis. His work integrates machine learning with clinical genomics to enhance diagnostic accuracy and precision medicine approaches.",
    tags: ["Bioinformatics", "AI Diagnostics", "Genomics"],
    email: "tariq.mahmood@clingene.pk",
    linkedin: "https://linkedin.com/in/tariq-mahmood-phd"
  }
];

// Filter helpers
export const executiveTeam = teamMembers.filter(member => member.type === "executive");
export const scientificTeam = teamMembers.filter(member => member.type === "team");

// -----------------------------------------------------------------------------
// CONTACT INFORMATION - Replace with real company details
// -----------------------------------------------------------------------------
export const contactInfo = {
  email: "info@clingene.pk",
  phone: "+92 (XX) XXXX-XXXX", // Replace with real phone
  address: "Islamabad, Pakistan", // Replace with real address
  social: {
    linkedin: "https://linkedin.com/company/clingene",
    facebook: "https://facebook.com/clingene", // Optional
    twitter: "https://twitter.com/clingene" // Optional
  }
};

export default {
  companyStats,
  teamMembers,
  executiveTeam,
  scientificTeam,
  contactInfo
};
