import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const TeamMemberSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),
  designation: z
    .string()
    .min(2, "Designation is required")
    .max(100, "Designation cannot exceed 100 characters"),
  department: z
    .string()
    .min(1, "Department is required"),
  qualification: z
    .string()
    .min(2, "Qualification is required")
    .max(150, "Qualification cannot exceed 150 characters"),
  shortBio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio cannot exceed 500 characters"),
  photo: z
    .string()
    .optional(),
  email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url("Enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  displayOrder: z
    .coerce
    .number()
    .int("Order must be an integer")
    .min(1, "Order must be at least 1"),
  status: z
    .enum(["Published", "Draft"]),
});

export const DEPARTMENTS = [
  "Executive Leadership",
  "Clinical Genetics",
  "Molecular Biology",
  "Bioinformatics",
  "Sequencing Operations",
  "Agricultural Genomics",
];

export const ServiceSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    number: z.string().optional(),
    name: z
      .string()
      .min(2, "Service name must be at least 2 characters")
      .max(100, "Service name cannot exceed 100 characters"),
    slug: z
      .string()
      .min(2, "Slug is required")
      .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
    type: z.enum(["lab", "computational"]).default("lab"),
    category: z.string().min(1, "Category is required"),
    tagline: z
      .string()
      .max(250, "Tagline cannot exceed 250 characters")
      .optional()
      .or(z.literal("")),
    description: z
      .string()
      .max(350, "Description cannot exceed 350 characters")
      .optional()
      .or(z.literal("")),
    pricing: z.string().optional().or(z.literal("")),
    status: z.enum(["Active", "Draft"]).default("Active"),
    image: z.string().optional().or(z.literal("")),
    imageAlt: z.string().optional().or(z.literal("")),
    sampleType: z
      .string()
      .max(120, "Sample type cannot exceed 120 characters")
      .optional()
      .or(z.literal("")),
    turnaroundTime: z
      .string()
      .max(60, "Turnaround time cannot exceed 60 characters")
      .optional()
      .or(z.literal("")),
    reportFormat: z
      .string()
      .max(120, "Report format cannot exceed 120 characters")
      .optional()
      .or(z.literal("")),
    requisitionPdf: z
      .union([
        z.string(),
        z.object({
          url: z.string(),
          name: z.string().optional(),
          size: z.number().optional(),
        }),
      ])
      .optional()
      .nullable(),
    overview: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
    applications: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
        })
      )
      .optional(),
    requirements: z.array(z.string()).optional(),
    deliverables: z.array(z.string()).optional(),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),
    relatedSlugs: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.image && data.image.trim().length > 0) {
        return Boolean(data.imageAlt && data.imageAlt.trim().length > 0);
      }
      return true;
    },
    {
      message: "Alt text is required when an image is set",
      path: ["imageAlt"],
    }
  );


