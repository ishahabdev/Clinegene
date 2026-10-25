// =============================================================================
// TEAM PAGE CONFIGURATION - Single Source of Truth
// =============================================================================
// Replace all placeholder data with real company information

import amjadAli from "../assets/team/Amjad Ali.jpeg";
import safdarAli from "../assets/team/Safdar Ali.jpeg";
import kifayatUllah from "../assets/team/Kifayat ullah.jpeg";
import abidAli from "../assets/team/Abid Ali.jpeg";
import tahirUllah from "../assets/team/Tahir Ali.jpeg";
import mudassirAlvi from "../assets/team/Mudassir.jpeg";
import saadKhan from "../assets/team/Saad.jpeg";
import imadAli from "../assets/team/Imad Ali.jpeg";
import samrana from "../assets/team/samrana.jpeg";

// -----------------------------------------------------------------------------
// COMPANY STATS - Used across Hero and Stats sections
// -----------------------------------------------------------------------------
export const companyStats = {
  teamMembers: "9+",
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
    name: "Dr. Amjad Ali Tanoli Ph.D",
    role: "Chief Executive Officer & Founder",
    department: "Leadership",
    type: "executive", // Used to filter executives
    image: amjadAli,
    imageAlt: "Dr. Amjad Ali Tanoli, CEO and Founder of ClinGene",
    imagePosition: "center 20%",
    bio: "Dr. Amjad Ali Tanoli is the founder and CEO of ClinGene, driving Pakistan's first human genetics and precision medicine platform. With over 15 years of international research experience, he bridges clinical genetics and genomic technology to advance healthcare innovation in the region.",
    tags: ["CEO/Director", "Human Geneticist", "Consultant Genetic Counselor"],
    email: "amjad.tanoli@clingene.pk",
    linkedin: "https://linkedin.com/in/amjad-ali-tanoli"
  },
  {
    id: "dr-safdar-ali",
    name: "Dr. Safdar Ali Ph.D, Postdoc",
    role: "Co-CEO & Postdoc Lead",
    department: "Leadership",
    type: "executive",
    image: safdarAli,
    imageAlt: "Dr. Safdar Ali, Co-CEO and Postdoc Lead at ClinGene",
    imagePosition: "center 8%",
    bio: "Dr. Safdar Ali serves as Co-CEO and Postdoc Lead at ClinGene. A medical physicist by training, he previously worked at the Princess Margaret Cancer Research Centre in Toronto, Canada. His expertise lies in computational oncology and translational research pipelines. He champions interdisciplinary approaches to genomic medicine and precision diagnostics.",
    tags: ["Managing Director", "Medical Physicist", "Princess Margaret Cancer Research Centre, Toronto, Canada"],
    email: "safdar.tanoli@clingene.pk",
    linkedin: "https://linkedin.com/in/safdar-ali-tanoli-phd"
  },

  // --- SCIENTIFIC & CLINICAL TEAM (Carousel) ---
  {
    id: "dr-kifayat-ullah",
    name: "Dr. Kifayat Ullah Ph.D",
    role: "Head of Human Genetics",
    department: "Genetics",
    type: "team",
    image: kifayatUllah,
    imageAlt: "Dr. Kifayat Ullah, Head of Human Genetics at ClinGene",
    imagePosition: "center 20%",
    bio: "Dr. Kifayat Ullah leads the Human Genetics division at ClinGene, overseeing clinical genetic testing and molecular diagnostics. His research focuses on identifying novel genetic variants associated with rare diseases in the South Asian population.",
    tags: ["Molecular Diagnostics", "Genetics", "Research"],
    email: "kifayat.ullah@clingene.pk",
    linkedin: "https://linkedin.com/in/kifayat-ullah-phd"
  },
  {
    id: "dr-abid-ali",
    name: "Dr. Abid Ali Ph.D, Postdoc",
    role: "Postdoctoral Researcher",
    department: "Laboratory",
    type: "team",
    image: abidAli,
    imageAlt: "Dr. Abid Ali, Postdoctoral Researcher at ClinGene",
    imagePosition: "center 20%",
    bio: "Dr. Abid Ali is a Postdoctoral Researcher specializing in Horticulture and Olericulture. He completed his postdoctoral work at Zhejiang University, China, focusing on plant genetics and molecular breeding.",
    tags: ["Horticulture/Olericulture", "Zhejiang University, China"],
    email: "abid.ali@clingene.pk",
    linkedin: "https://linkedin.com/in/abid-ali-phd"
  },
  {
    id: "mr-muhammad-tahir-ullah",
    name: "Mr. Muhammad Tahir Ullah Ph.D",
    role: "Molecular Biologist & Human Geneticist",
    department: "Genetics",
    type: "team",
    image: tahirUllah,
    imageAlt: "Mr. Muhammad Tahir Ullah, Molecular Biologist at ClinGene",
    imagePosition: "center 20%",
    bio: "Mr. Muhammad Tahir Ullah is a Molecular Biologist and Human Geneticist with expertise from Quaid-i-Azam University, Islamabad, Pakistan and King's College London, UK. His research focuses on molecular mechanisms of genetic diseases.",
    tags: ["Molecular Biologist", "Human Geneticist", "Quaid-i-Azam University, Islamabad, Pakistan", "King's College London, UK"],
    email: "tahir.ullah@clingene.pk",
    linkedin: "https://linkedin.com/in/tahir-ullah-phd"
  },
  {
    id: "mudassir-alvi",
    name: "Mudassir Alvi Ph.D",
    role: "Bioinformatician",
    department: "Bioinformatics",
    type: "team",
    image: mudassirAlvi,
    imageAlt: "Mudassir Alvi, Bioinformatician at ClinGene",
    imagePosition: "center 20%",
    bio: "Dr. Mudassir Alvi is a Bioinformatician at the National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad. He specializes in computational genomics and data analysis pipelines for precision medicine.",
    tags: ["Bioinformatician", "National Centre for Bioinformatics", "Quaid-i-Azam University, Islamabad, Pakistan"],
    email: "mudassir.alvi@clingene.pk",
    linkedin: "https://linkedin.com/in/mudassir-alvi-phd"
  },
  {
    id: "saad-khan",
    name: "Saad Khan M.Phil",
    role: "Molecular Biologist & Bioinformatician",
    department: "Bioinformatics",
    type: "team",
    image: saadKhan,
    imageAlt: "Saad Khan, Molecular Biologist at ClinGene",
    imagePosition: "center 20%",
    bio: "Saad Khan is a Molecular Biologist and Bioinformatician at the National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad. He bridges wet-lab molecular biology with computational analysis for genomic research.",
    tags: ["Molecular Biologist", "Bioinformatician", "National Centre for Bioinformatics", "Quaid-i-Azam University, Islamabad, Pakistan"],
    email: "saad.khan@clingene.pk",
    linkedin: "https://linkedin.com/in/saad-khan-mphil"
  },
  {
    id: "imad-ali",
    name: "Imad Ali",
    role: "Bioinformatics Specialist",
    department: "Bioinformatics",
    type: "team",
    image: imadAli,
    imageAlt: "Imad Ali, Bioinformatics Specialist at ClinGene",
    imagePosition: "center 20%",
    bio: "Imad Ali is a Bioinformatics Specialist at ClinGene, contributing to computational analysis and genomic data interpretation for clinical and research applications.",
    tags: ["Bioinformatics"],
    email: "imad.ali@clingene.pk",
    linkedin: "https://linkedin.com/in/imad-ali"
  },
  {
    id: "dr-samrana",
    name: "Dr. Samrana Ph.D",
    role: "Crop Genetics and Breeding Specialist",
    department: "Laboratory",
    type: "team",
    image: samrana,
    imageAlt: "Dr. Samrana, Crop Genetics and Breeding Specialist at ClinGene",
    imagePosition: "center 20%",
    bio: "Dr. Samrana specializes in Crop Genetics and Breeding with expertise from Zhejiang University, China. Her research focuses on improving crop varieties through advanced genetic and breeding techniques.",
    tags: ["Crop Genetics and Breeding", "Zhejiang University, China"],
    email: "samrana@clingene.pk",
    linkedin: "https://linkedin.com/in/dr-samrana-phd"
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
