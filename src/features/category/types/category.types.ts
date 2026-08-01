import { Status } from "@/shared/types/enums";
import type { CategoryScope } from "@/shared/types/enums";
import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type {
  CreateCategorySchema,
  UpdateCategorySchema,
  CategoryQuerySchema,
} from "../schemas/category.schema";
export type CreateCategoryPayload = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryPayload = z.infer<typeof UpdateCategorySchema>;
export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
  scope?: CategoryScope;
}
export type CategoryQueryValidated = z.infer<typeof CategoryQuerySchema>;
export interface Category {
  id: string;
  title: string;
  slug: string;
  scope: CategoryScope;
  shortDesc: string | null;
  order: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  archivedAt: Date | null;
  createdById: string | null;
  updatedById: string | null;
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
  blogs?: Array<{ id: string; title: string; slug: string }>;
  projects?: Array<{ id: string; title: string; slug: string }>;
  services?: Array<{ id: string; title: string; slug: string }>;
  caseStudies?: Array<{ id: string; title: string; slug: string }>;
  technologies?: Array<{ id: string; title: string }>;
  skills?: Array<{ id: string; title: string }>;
  faqs?: Array<{ id: string; title: string; slug: string }>;
}
