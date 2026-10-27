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
    name: "Dr. Amjad Ali Tanoli, Ph.D",
    designation: "CEO / Director",
    description: "Dr. Amjad Ali Tanoli holds a Ph.D. and is a Human Geneticist and Consultant Genetic Counselor. He serves as the CEO and Director of ClinGene.",
    image: amjadAli,
  },
  {
    name: "Dr. Safdar Ali, Ph.D, Postdoc",
    designation: "Managing Director",
    description: "Dr. Safdar Ali holds a Ph.D. with postdoctoral experience at the Princess Margaret Cancer Research Center, Toronto, Canada. He is a Medical Physicist and serves as the Managing Director of ClinGene.",
    image: safdarAli,
  },
  {
    name: "Dr. Abid Ali, Ph.D, Postdoc",
    designation: "Horticulture / Olericulture",
    description: "Dr. Abid Ali holds a Ph.D. with postdoctoral experience in Horticulture and Olericulture at Zhejiang University, China.",
    image: abidAli,
  },
  {
    name: "Dr. Samrana, Ph.D",
    designation: "Crop Genetics and Breeding",
    description: "Dr. Samrana holds a Ph.D. and specializes in Crop Genetics and Breeding. She is associated with Zhejiang University, China.",
    image: samrana,
  },
  {
    name: "Dr. Kifayat Ullah, Ph.D",
    designation: "Molecular Biologist, Human Geneticist",
    description: "Dr. Kifayat Ullah holds a Ph.D. and works as a Molecular Biologist and Human Geneticist. He is associated with Quaid-i-Azam University, Islamabad, Pakistan, and Yale School of Medicine, Yale University, USA.",
    image: kifayatUllah,
  },
  {
    name: "Muhammad Tahir Ullah, Ph.D",
    designation: "Molecular Biologist, Human Geneticist",
    description: "Muhammad Tahir Ullah holds a Ph.D. and works as a Molecular Biologist and Human Geneticist. He is associated with Quaid-i-Azam University, Islamabad, Pakistan, and King's College London, UK.",
    image: tahirUllah,
  },
  {
    name: "Mudassir Alvi, Ph.D",
    designation: "Bioinformatician",
    description: "Mudassir Alvi holds a Ph.D. and works as a Bioinformatician. He is associated with the National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad, Pakistan.",
    image: mudassirAlvi,
  },
  {
    name: "Saad Khan, M.Phil",
    designation: "Molecular Biologist, Bioinformatician",
    description: "Saad Khan holds an M.Phil. and works as a Molecular Biologist and Bioinformatician. He is associated with the National Centre for Bioinformatics, Quaid-i-Azam University, Islamabad, Pakistan.",
    image: saadKhan,
  },
  {
    name: "Imad Ali",
    designation: "Bioinformatics",
    description: "Imad Ali works in Bioinformatics and is associated with COMSATS University, Islamabad, Pakistan.",
    image: imadAli,
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
