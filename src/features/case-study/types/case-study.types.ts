import { Status } from "@/shared/types/enums";

import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type {
  CreateCaseStudySchema,
  UpdateCaseStudySchema,
  CaseStudyQuerySchema,
} from "../schemas/case-study.schema";

export type CreateCaseStudyPayload = z.infer<typeof CreateCaseStudySchema>;
export type UpdateCaseStudyPayload = z.infer<typeof UpdateCaseStudySchema>;
export type CaseStudyQueryValidated = z.infer<typeof CaseStudyQuerySchema>;

export interface CaseStudyApiQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
  isFeatured?: boolean;
}

export interface PublicCaseStudyQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  contentJson: any | null;
  cardImage: string | null;
  heroImage: string | null;
  heroVideoUrl: string | null;
  galleryImages: string[];
  demoVideoUrl: string | null;
  status: Status;
  isFeatured: boolean;
  order: number;

  projectId: string;
  project?: {
    id: string;
    title: string;
    slug: string;
    client?: { id: string; title: string } | null;
    industry?: { id: string; title: string } | null;
    technologies?: { id: string; title: string; logo: string | null }[];
  } | null;

  categories?: Array<{ id: string; title: string; slug: string }>;
  tags?: Array<{ id: string; title: string; slug: string }>;
  testimonials?: { id: string; authorName: string; message: string }[];

  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  archivedAt: Date | null;

  createdById: string | null;
  updatedById: string | null;
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
}
