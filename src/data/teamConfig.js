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
  yearsExperience: "5+",
  projectsCompleted: "20+",
};

// -----------------------------------------------------------------------------
// TEAM MEMBERS - Single data source for all team displays
// -----------------------------------------------------------------------------
export const teamMembers = [
  // --- EXECUTIVE LEADERSHIP ---
  {
    id: "dr-amjad-ali-tanoli",
    name: "Dr. Amjad Ali Tanoli Ph.D",
    role: "CEO/Director",
    department: "Leadership",
    type: "executive", // Used to filter executives
    image: amjadAli,
    width: 879,
    height: 1024,
    imageAlt: "Dr. Amjad Ali Tanoli, CEO and Founder of ClinGene",
    imagePosition: "center 20%",
    bio: "Dr. Amjad Ali Tanoli is the founder and CEO of ClinGene, driving Pakistan's first human genetics and precision medicine platform.He bridges clinical genetics and genomic technologies.",
    tags: ["CEO/Director", "Human Geneticist", "Consultant Genetic Counselor"],
    email: "amjad.tanoli@clingene.pk",
    linkedin: "https://linkedin.com/in/amjad-ali-tanoli"
  },
  {
    id: "dr-safdar-ali",
    name: "Dr. Safdar Ali, Ph.D, Postdoc",
    role: "Managing Director",
    department: "Leadership",
    type: "executive",
    image: safdarAli,
    width: 554,
    height: 526,
    imageAlt: "Dr. Safdar Ali, Managing Director at ClinGene",
    imagePosition: "center 8%",
    bio: "Dr. Safdar Ali holds a Ph.D. with postdoctoral experience at the Princess Margaret Cancer Research Center, Toronto, Canada. He is a Medical Physicist and serves as the Managing Director of ClinGene.",
    tags: ["Managing Director", "Princess Margaret Cancer Research Center, Toronto, Canada", "Medical Physicist"],
    email: "safdar.tanoli@clingene.pk",
    linkedin: "https://linkedin.com/in/safdar-ali-tanoli-phd"
  },

  // --- SCIENTIFIC & CLINICAL TEAM (Carousel) ---
  {
    id: "dr-kifayat-ullah",
    name: "Dr. Kifayat Ullah, Ph.D",
    role: "Molecular Biologist, Human Geneticist",
    department: "Genetics",
    type: "team",
    image: kifayatUllah,
    width: 341,
    height: 238,
    imageAlt: "Dr. Kifayat Ullah, Molecular Biologist & Human Geneticist at ClinGene",
    imagePosition: "center 20%",
    bio: "Dr. Kifayat Ullah leads human genetics research at ClinGene, associated with Quaid-i-Azam University, Islamabad, Pakistan, and Yale School of Medicine, Yale University, USA.",
    tags: ["Molecular Biologist, Human Geneticist", "Quaid-i-Azam University, Islamabad, Pakistan.", "Yale School of Medicine, Yale University, USA."],
    email: "kifayat.ullah@clingene.pk",
    linkedin: "https://linkedin.com/in/kifayat-ullah-phd"
  },
  {
    id: "dr-abid-ali",
    name: "Dr. Abid Ali, Ph.D, Postdoc",
    role: "Horticulture/Olericulture",
    department: "Laboratory",
    type: "team",
    image: abidAli,
    width: 1068,
    height: 1192,
    imageAlt: "Dr. Abid Ali, Horticulture & Olericulture Specialist at ClinGene",
    imagePosition: "center 20%",
    bio: "Dr. Abid Ali specializes in Horticulture and Olericulture, associated with Zhejiang University, China, and International Agriculture Research Institute, Yunnan Academy of Agricultural Sciences, China.",
    tags: [
      "Horticulture/Olericulture",
      "Zhejiang University, China",
      "International Agriculture Research Institute, Yunnan Academy of Agricultural Sciences, China"
    ],
    email: "abid.ali@clingene.pk",
    linkedin: "https://linkedin.com/in/abid-ali-phd"
  },
  {
    id: "mr-muhammad-tahir-ullah",
    name: "Mr. Muhammad Tahir Ullah Ph.D",
    role: "Molecular Biologist, Human Geneticist",
    department: "Genetics",
    type: "team",
    image: tahirUllah,
    width: 720,
    height: 1280,
    imageAlt: "Mr. Muhammad Tahir Ullah, Molecular Biologist at ClinGene",
    imagePosition: "center 20%",
    bio: "Mr. Muhammad Tahir Ullah is a Molecular Biologist and Human Geneticist with credentials from Quaid-i-Azam University, Islamabad, Pakistan, and King’s College London, UK.",
    tags: ["Molecular Biologist, Human Geneticist", "Quaid-i-Azam University, Islamabad, Pakistan.", "King’s College London, UK"],
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
    width: 800,
    height: 800,
    imageAlt: "Mudassir Alvi, Bioinformatician at ClinGene",
    imagePosition: "center 20%",
    bio: "Dr. Mudassir Alvi is a Bioinformatician associated with the National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad, Pakistan.",
    tags: ["Bioinformatician", "National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad, Pakistan."],
    email: "mudassir.alvi@clingene.pk",
    linkedin: "https://linkedin.com/in/mudassir-alvi-phd"
  },
  {
    id: "saad-khan",
    name: "Saad Khan M.Phil",
    role: "Molecular Biologist, Bioinformatician",
    department: "Bioinformatics",
    type: "team",
    image: saadKhan,
    width: 561,
    height: 1600,
    imageAlt: "Saad Khan, Molecular Biologist & Bioinformatician at ClinGene",
    imagePosition: "center 20%",
    bio: "Saad Khan is a Molecular Biologist and Bioinformatician associated with the National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad, Pakistan.",
    tags: ["Molecular Biologist, Bioinformatician", "National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad, Pakistan."],
    email: "saad.khan@clingene.pk",
    linkedin: "https://linkedin.com/in/saad-khan-mphil"
  },
  {
    id: "imad-ali",
    name: "Imad Ali",
    role: "Bioinformatician",
    department: "Bioinformatics",
    type: "team",
    image: imadAli,
    width: 1200,
    height: 1600,
    imageAlt: "Imad Ali, Bioinformatician at ClinGene",
    imagePosition: "center 20%",
    bio: "Imad Ali is a Bioinformatician associated with COMSATS University, Islamabad, Pakistan.",
    tags: ["Bioinformatician", "COMSATS University, Islamabad, Pakistan."],
    email: "imad.ali@clingene.pk",
    linkedin: "https://linkedin.com/in/imad-ali"
  },
  {
    id: "dr-samrana",
    name: "Dr. Samrana Ph.D",
    role: "Crop Genetics and Breeding",
    department: "Laboratory",
    type: "team",
    image: samrana,
    width: 360,
    height: 360,
    imageAlt: "Dr. Samrana, Crop Genetics and Breeding at ClinGene",
    imagePosition: "center 20%",
    bio: "Holds PhD in crop genetics and breeding from Zhejiang university China.",
    tags: ["Crop Genetics and Breeding", "Zhejiang University, China."],
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
  email: "info@clingene.co",
  phone: "+92 348 5607051",
  address: "Street 13, Lane 10, Hostel City, Chatta Bakhtawar, Chak Shahzad, Park Road, Islamabad, Pakistan",
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
