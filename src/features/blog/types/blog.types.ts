import { Status } from "@/shared/types/enums";

import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type { RichContentDocument } from "@/components/content/types";
import type { CreateBlogSchema, UpdateBlogSchema, BlogQuerySchema } from "../schemas/blog.schema";
export type CreateBlogPayload = z.infer<typeof CreateBlogSchema>;
export type UpdateBlogPayload = z.infer<typeof UpdateBlogSchema>;
export type BlogQueryValidated = z.infer<typeof BlogQuerySchema>;
export interface BlogApiQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;

  isFeatured?: boolean;
  category?: string;
  tag?: string;
}
export interface PublicBlogQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}
export interface Blog {
  id: string;
  title: string;
  slug: string;
  contentJson: RichContentDocument | null;
  excerpt: string | null;
  cardImage: string | null;
  heroImage: string | null;
  heroVideoUrl: string | null;
  galleryImages: string[];
  demoVideoUrl: string | null;
  ogImage: string | null;
  readTime: number | null;
  status: Status;

  isFeatured: boolean;
  publishedAt: Date | null;
  archivedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  categories?: Array<{ id: string; title: string; slug: string }>;
  tags?: Array<{ id: string; title: string; slug: string }>;
  _count?: { categories?: number; tags?: number };
  createdById: string | null;
  updatedById: string | null;
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
}
