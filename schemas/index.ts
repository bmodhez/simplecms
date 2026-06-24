import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  published: z.boolean().default(false),
  categoryId: z.string().optional().nullable(),
});

export const pageSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().default(false),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
});

export const settingsSchema = z.object({
  customCss: z.string().optional(),
  customJs: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type PageInput = z.infer<typeof pageSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
