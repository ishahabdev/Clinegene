import {
  BarChart3,
  Dna,
  FlaskConical,
  GitBranch,
  GraduationCap,
  Microscope,
  Network,
  Stethoscope,
  UserRound,
  UsersRound,
} from "lucide-react";

export const departments = [
  { id: "all", label: "All Departments" },
  { id: "leadership", label: "Leadership" },
  { id: "genetics", label: "Human Genetics" },
  { id: "laboratory", label: "Laboratory Sciences" },
  { id: "bioinformatics", label: "Bioinformatics" },
  { id: "computational", label: "Computational Biology" },
  { id: "training", label: "Training & Outreach" },
];

const departmentIcons = {
  leadership: UsersRound,
  genetics: Stethoscope,
  laboratory: Microscope,
  bioinformatics: Network,
  computational: GitBranch,
  training: GraduationCap,
};

import amjadAli from "../assets/team/Amjad Ali.jpeg";
import safdarAli from "../assets/team/Safdar Ali.jpeg";
import kifayatUllah from "../assets/team/Kifayat ullah.jpeg";
import abidAli from "../assets/team/Abid Ali.jpeg";
import tahirUllah from "../assets/team/Tahir Ali.jpeg";
import mudassirAlvi from "../assets/team/Mudassir.jpeg";
import saadKhan from "../assets/team/Saad.jpeg";
import imadAli from "../assets/team/Imad Ali.jpeg";
import samrana from "../assets/team/samrana.jpeg";

export const teamMembers = [
  {
    id: "dr-amjad-ali-tanoli",
    name: "Dr. Amjad Ali Tanoli Ph.D",
    designation: "CEO",
    department: "leadership",
    image: amjadAli,
    details: ["CEO/Director", "Human Geneticist", "Consultant Genetic Counselor"],
    bio: "Dr. Amjad Ali Tanoli is the founder and CEO of ClinGene, driving Pakistan's first human genetics and precision medicine platform. With over 5 years of international research experience, he bridges clinical genetics and genomic technology to advance healthcare innovation in the region.",
    expertise: ["Clinical Genetics", "Precision Medicine", "Genetic Counseling"],
    tags: ["Clinical Genetics", "Precision Medicine", "Leadership"],
    social: {
      email: "amjad.tanoli@clingene.pk",
      linkedin: "https://linkedin.com/in/amjad-ali-tanoli",
      orcid: "https://orcid.org/0000-0002-1234-5678",
    },
  },
  {
    id: "dr-safdar-ali-tanoli",
    name: "Dr. Safdar Ali Ph.D, Postdoc",
    designation: "POSTDOC",
    department: "leadership",
    image: safdarAli,
    details: ["Managing Director", "Medical Physicist", "Princess Margaret Cancer Research Centre, Toronto, Canada"],
    bio: "Dr. Safdar Ali serves as Managing Director and Postdoc Lead at ClinGene. A medical physicist by training, he previously worked at the Princess Margaret Cancer Research Centre in Toronto, Canada. His expertise lies in computational oncology and translational research pipelines.",
    expertise: ["Medical Physics", "Computational Oncology", "Translational Research"],
    tags: ["Medical Physics", "Oncology", "Research"],
    social: {
      email: "safdar.tanoli@clingene.pk",
      linkedin: "https://linkedin.com/in/safdar-ali-tanoli-phd",
      orcid: "https://orcid.org/0000-0003-5678-9012",
    },
  },
  {
    id: "dr-kifayat-ullah",
    name: "Dr. Kifayat Ullah Ph.D",
    designation: "Head of Human Genetics",
    department: "genetics",
    image: kifayatUllah,
    details: ["Human Geneticist", "Molecular Diagnostics"],
    bio: "Dr. Kifayat Ullah leads the Human Genetics division at ClinGene, overseeing clinical genetic testing and molecular diagnostics. His research focuses on identifying novel genetic variants associated with rare diseases in the South Asian population.",
    expertise: ["Molecular Diagnostics", "Rare Disease Genetics", "Population Genomics"],
    tags: ["Molecular Diagnostics", "Genetics", "Research"],
    social: {
      email: "kifayat.ullah@clingene.pk",
      linkedin: "https://linkedin.com/in/kifayat-ulllah-phd",
      orcid: "https://orcid.org/0000-0001-2345-6789",
    },
  },
  {
    id: "dr-abid-ali",
    name: "Dr. Abid Ali Ph.D, Postdoc",
    designation: "Postdoctoral Researcher",
    department: "laboratory",
    image: abidAli,
    details: ["Horticulture/Olericulture", "Zhejiang University, China"],
    bio: "Dr. Abid Ali is a Postdoctoral Researcher specializing in Horticulture and Olericulture. He completed his postdoctoral work at Zhejiang University, China, focusing on plant genetics and molecular breeding.",
    expertise: ["Horticulture", "Plant Genetics", "Molecular Breeding"],
    tags: ["Horticulture", "Plant Science", "Research"],
    social: {
      email: "abid.ali@clingene.pk",
      linkedin: "https://linkedin.com/in/abid-ali-phd",
    },
  },
  {
    id: "mr-muhammad-tahir-ullah",
    name: "Mr. Muhammad Tahir Ullah Ph.D",
    designation: "Molecular Biologist & Human Geneticist",
    department: "genetics",
    image: tahirUllah,
    details: ["Molecular Biologist", "Human Geneticist", "Quaid-i-Azam University, Islamabad", "King's College London, UK"],
    bio: "Mr. Muhammad Tahir Ullah is a Molecular Biologist and Human Geneticist with expertise from Quaid-i-Azam University, Islamabad, Pakistan and King's College London, UK. His research focuses on molecular mechanisms of genetic diseases.",
    expertise: ["Molecular Biology", "Human Genetics", "Disease Genetics"],
    tags: ["Molecular Biology", "Genetics", "Research"],
    social: {
      email: "tahir.ullah@clingene.pk",
      linkedin: "https://linkedin.com/in/tahir-ullah-phd",
    },
  },
  {
    id: "mudassir-alvi",
    name: "Mudassir Alvi Ph.D",
    designation: "Bioinformatician",
    department: "bioinformatics",
    image: mudassirAlvi,
    details: ["Bioinformatician", "National Centre for Bioinformatics", "Quaid-i-Azam University, Islamabad, Pakistan"],
    bio: "Dr. Mudassir Alvi is a Bioinformatician at the National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad. He specializes in computational genomics and data analysis pipelines for precision medicine.",
    expertise: ["Bioinformatics", "Computational Genomics", "Data Analysis"],
    tags: ["Bioinformatics", "Genomics", "Data Science"],
    social: {
      email: "mudassir.alvi@clingene.pk",
      linkedin: "https://linkedin.com/in/mudassir-alvi-phd",
    },
  },
  {
    id: "saad-khan",
    name: "Saad Khan M.Phil",
    designation: "Molecular Biologist & Bioinformatician",
    department: "bioinformatics",
    image: saadKhan,
    details: ["Molecular Biologist", "Bioinformatician", "National Centre for Bioinformatics", "Quaid-i-Azam University, Islamabad, Pakistan"],
    bio: "Saad Khan is a Molecular Biologist and Bioinformatician at the National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad. He bridges wet-lab molecular biology with computational analysis for genomic research.",
    expertise: ["Molecular Biology", "Bioinformatics", "Genomic Analysis"],
    tags: ["Molecular Biology", "Bioinformatics", "Research"],
    social: {
      email: "saad.khan@clingene.pk",
      linkedin: "https://linkedin.com/in/saad-khan-mphil",
    },
  },
  {
    id: "imad-ali",
    name: "Imad Ali",
    designation: "Bioinformatics Specialist",
    department: "bioinformatics",
    image: imadAli,
    details: ["Bioinformatics"],
    bio: "Imad Ali is a Bioinformatics Specialist at ClinGene, contributing to computational analysis and genomic data interpretation for clinical and research applications.",
    expertise: ["Bioinformatics", "Data Analysis", "Computational Biology"],
    tags: ["Bioinformatics", "Genomics", "Analysis"],
    social: {
      email: "imad.ali@clingene.pk",
      linkedin: "https://linkedin.com/in/imad-ali",
    },
  },
  {
    id: "dr-samrana",
    name: "Dr. Samrana Ph.D",
    designation: "Crop Genetics and Breeding Specialist",
    department: "laboratory",
    image: samrana,
    details: ["Crop Genetics and Breeding", "Zhejiang University, China"],
    bio: "Dr. Samrana specializes in Crop Genetics and Breeding with expertise from Zhejiang University, China. Her research focuses on improving crop varieties through advanced genetic and breeding techniques.",
    expertise: ["Crop Genetics", "Plant Breeding", "Agricultural Genomics"],
    tags: ["Crop Genetics", "Plant Breeding", "Research"],
    social: {
      email: "samrana@clingene.pk",
      linkedin: "https://linkedin.com/in/dr-samrana-phd",
    },
  },
];

// Carousel members - showing all 9 team members
export const carouselMembers = teamMembers.slice(0, 9);

export const getTeamMemberIcon = (dept) => departmentIcons[dept] || UserRound;

export const teamStats = [
  { value: "9+", label: "Researchers", Icon: UsersRound },
  { value: "6", label: "Departments", Icon: FlaskConical },
  { value: "5+", label: "Years Avg Experience", Icon: GraduationCap },
  { value: "20+", label: "Publications", Icon: Dna },
];

export const membersByDepartment = (deptId) =>
  deptId === "all"
    ? teamMembers
    : teamMembers.filter((m) => m.department === deptId);

export default teamMembers;
