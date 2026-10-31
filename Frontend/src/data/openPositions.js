import {
  FlaskConical,
  GitBranch,
  Microscope,
  Network,
  Stethoscope,
  UsersRound,
} from "lucide-react";

export const openPositions = [];

export const upcomingDepartments = [
  { label: "Bioinformatics", Icon: Network },
  { label: "Human Genetics", Icon: Stethoscope },
  { label: "Laboratory Sciences", Icon: Microscope },
  { label: "Computational Biology", Icon: GitBranch },
  { label: "Training & Outreach", Icon: UsersRound },
  { label: "Research & Development", Icon: FlaskConical },
];

export const departmentRoles = {
  Bioinformatics: ["Bioinformatician", "Data Scientist", "Pipeline Developer"],
  "Human Genetics": ["Genetic Counselor", "Clinical Research Associate"],
  "Laboratory Sciences": ["Lab Technician", "Research Associate"],
  "Computational Biology": [
    "Computational Biologist",
    "Machine Learning Engineer",
  ],
  "Training & Outreach": [
    "Training Coordinator",
    "Outreach Specialist",
  ],
  "Research & Development": [
    "Research Associate",
    "Postdoctoral Fellow",
  ],
};

export default openPositions;
