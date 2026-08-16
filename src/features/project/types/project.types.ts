import { Status } from "@/shared/types/enums";

import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type { RichContentDocument } from "@/components/content/types";
import type {
  CreateProjectSchema,
  UpdateProjectSchema,
  ProjectQuerySchema,
} from "../schemas/project.schema";

export type CreateProjectPayload = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectPayload = z.infer<typeof UpdateProjectSchema>;
export type ProjectQueryValidated = z.infer<typeof ProjectQuerySchema>;

export interface ProjectApiQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
  isFeatured?: boolean;
  technology?: string;
  serviceId?: string;
}

export interface PublicProjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  technology?: string;
  featured?: boolean;
}

export interface Technology {
  id: string;
  title: string;
  logo: string | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  contentJson?: RichContentDocument | null;
  cardImage: string | null;
  heroImage: string | null;
  heroVideoUrl: string | null;
  galleryImages: string[];
  demoVideoUrl: string | null;
  ogImage: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  startDate: Date | null;
  endDate: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: Status;
  isFeatured: boolean;
  order: number;

  technologies?: Technology[];
  caseStudy?: { id: string; title: string; slug: string; status: string } | null;
  services?: { id: string; title: string; slug: string }[];
  categories?: Array<{ id: string; title: string; slug: string }>;
  tags?: Array<{ id: string; title: string; slug: string }>;

  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  archivedAt: Date | null;

  createdById: string | null;
  updatedById: string | null;
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
}
