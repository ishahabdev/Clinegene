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

import team1 from "../assets/team/1team.png";
import team2 from "../assets/team/2team.png";
import team3 from "../assets/team/3team.png";
import team4 from "../assets/team/4team.png";
import team5 from "../assets/team/5team.png";

export const teamMembers = [
  {
    id: "dr-amjad-ali-tanoli",
    name: "Dr. Amjad Ali Tanoli Ph.D",
    designation: "CEO",
    department: "leadership",
    image: team1,
    details: ["Human Geneticist", "Consultant Genetic Counselor"],
    bio: "Dr. Amjad Ali Tanoli is the founder and CEO of ClinGene, driving Pakistan's first human genetics and precision medicine platform. With over 15 years of international research experience, he bridges clinical genetics and genomic technology to advance healthcare innovation in the region.",
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
    name: "Dr. Safdar Ali Tanoli Ph.D",
    designation: "Co-CEO & Postdoc Lead",
    department: "leadership",
    image: team2,
    details: ["Co-CEO", "Medical Physicist"],
    bio: "Dr. Safdar Ali Tanoli serves as Co-CEO and Postdoc Lead at ClinGene. A medical physicist by training, he previously worked at the Princess Margaret Cancer Research Centre in Toronto, Canada. His expertise lies in computational oncology and translational research pipelines.",
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
    image: team3,
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
    id: "dr-elena-rostova",
    name: "Dr. Elena Rostova Ph.D",
    designation: "Chief Laboratory Director",
    department: "laboratory",
    image: team4,
    details: ["Pathologist", "Quality Assurance Lead"],
    bio: "Dr. Elena Rostova serves as Chief Laboratory Director, overseeing all diagnostic operations and quality assurance protocols. With expertise in clinical pathology and laboratory accreditation, she ensures the highest standards of diagnostic excellence.",
    expertise: ["Clinical Pathology", "Quality Assurance", "Laboratory Operations"],
    tags: ["Pathology", "QA Control", "Lab Ops"],
    social: {
      email: "elena.rostova@clingene.pk",
      linkedin: "https://linkedin.com/in/elena-rostova-phd",
      orcid: "https://orcid.org/0000-0002-3456-7890",
    },
  },
  {
    id: "dr-tariq-mahmood",
    name: "Dr. Tariq Mahmood Ph.D",
    designation: "Lead Bioinformatician",
    department: "bioinformatics",
    image: team5,
    details: ["Data Scientist", "Genomic Analysis"],
    bio: "Dr. Tariq Mahmood leads the bioinformatics division, specializing in AI-driven diagnostic tools and genomic data analysis. His work integrates machine learning with clinical genomics to enhance diagnostic accuracy and precision medicine approaches.",
    expertise: ["Bioinformatics", "AI Diagnostics", "Genomic Analysis"],
    tags: ["Bioinformatics", "AI Diagnostics", "Genomics"],
    social: {
      email: "tariq.mahmood@clingene.pk",
      linkedin: "https://linkedin.com/in/tariq-mahmood-phd",
      orcid: "https://orcid.org/0000-0003-4567-8901",
    },
  },
];

// Carousel members - 5 members for the scrolling carousel
export const carouselMembers = teamMembers.slice(0, 5);

export const getTeamMemberIcon = (dept) => departmentIcons[dept] || UserRound;

export const teamStats = [
  { value: "25+", label: "Researchers", Icon: UsersRound },
  { value: "6", label: "Departments", Icon: FlaskConical },
  { value: "15+", label: "Years Avg Experience", Icon: GraduationCap },
  { value: "200+", label: "Publications", Icon: Dna },
];

export const membersByDepartment = (deptId) =>
  deptId === "all"
    ? teamMembers
    : teamMembers.filter((m) => m.department === deptId);

export default teamMembers;
