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
import abidAli from "../assets/team/Abid Ali.jpeg";
import samrana from "../assets/team/samrana.jpeg";
import kifayatUllah from "../assets/team/Kifayat ullah.jpeg";
import tahirUllah from "../assets/team/Tahir Ali.jpeg";
import mudassirAlvi from "../assets/team/Mudassir.jpeg";
import saadKhan from "../assets/team/Saad.jpeg";
import imadAli from "../assets/team/Imad Ali.jpeg";

export const teamMembers = [
  {
    name: "Dr. Amjad Ali Tanoli Ph.D",
    designation: "CEO/Director",
    description: "Human Geneticist\nConsultant Genetic Counselor",
    image: amjadAli,
    width: 879,
    height: 1024,
  },
  {
    name: "Dr. Safdar Ali, Ph.D, Postdoc",
    designation: "Managing Director",
    description: "Princess Margaret Cancer Research Center, Toronto, Canada\nMedical Physicist",
    image: safdarAli,
    width: 554,
    height: 526,
  },
  {
    name: "Dr. Abid Ali, Ph.D, Postdoc",
    designation: "Horticulture/Olericulture",
    description: "Zhejiang University, China\nInternational Agriculture Research Institute, Yunnan Academy of Agricultural Sciences, China",
    image: abidAli,
    width: 1068,
    height: 1192,
  },
  {
    name: "Dr. Samrana Ph.D",
    designation: "Crop Genetics and Breeding",
    description: "Zhejiang University, China.",
    image: samrana,
    width: 360,
    height: 360,
  },
  {
    name: "Dr. Kifayat Ullah, Ph.D",
    designation: "Molecular Biologist, Human Geneticist",
    description: "Quaid-i-Azam University, Islamabad, Pakistan.\nYale School of Medicine, Yale University, USA.",
    image: kifayatUllah,
    width: 341,
    height: 238,
  },
  {
    name: "Mr. Muhammad Tahir Ullah Ph.D",
    designation: "Molecular Biologist, Human Geneticist",
    description: "Quaid-i-Azam University, Islamabad, Pakistan.\nKing’s College London, UK",
    image: tahirUllah,
    width: 720,
    height: 1280,
  },
  {
    name: "Mudassir Alvi Ph.D",
    designation: "Bioinformatician",
    description: "National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad, Pakistan.",
    image: mudassirAlvi,
    width: 800,
    height: 800,
  },
  {
    name: "Saad Khan M.Phil",
    designation: "Molecular Biologist, Bioinformatician",
    description: "National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad, Pakistan.",
    image: saadKhan,
    width: 561,
    height: 1600,
  },
  {
    name: "Imad Ali",
    designation: "Bioinformatician",
    description: "COMSATS University, Islamabad, Pakistan.",
    image: imadAli,
    width: 1200,
    height: 1600,
  },
];

// Carousel members - all 9 members mapped in exact order
export const carouselMembers = teamMembers;

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
