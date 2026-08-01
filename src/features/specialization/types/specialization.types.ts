import { Status } from "@/shared/types/enums";

import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type {
  CreateSpecializationSchema,
  UpdateSpecializationSchema,
  SpecializationQuerySchema,
} from "../schemas/specialization.schema";
export type CreateSpecializationPayload = z.infer<typeof CreateSpecializationSchema> & {
  heroImageAlt?: string | null;
  cardImageAlt?: string | null;
  ogImageAlt?: string | null;
  galleryImagesAltTexts?: (string | null)[];
};
export type UpdateSpecializationPayload = z.infer<typeof UpdateSpecializationSchema> & {
  heroImageAlt?: string | null;
  cardImageAlt?: string | null;
  ogImageAlt?: string | null;
  galleryImagesAltTexts?: (string | null)[];
};
export interface SpecializationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
  isFeatured?: boolean;
}
export type SpecializationQueryValidated = z.infer<typeof SpecializationQuerySchema>;
export interface Specialization {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  contentJson?: unknown;
  icon: string | null;
  cardImage: string | null;
  heroImage: string | null;
  cardImageAlt?: string | null;
  heroImageAlt?: string | null;
  heroVideoUrl: string | null;
  galleryImages: string[];
  demoVideoUrl: string | null;
  ogImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: Status;
  isFeatured: boolean;
  order: number;
  publishedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string | null;
  updatedById: string | null;
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
  services?: Array<{ id: string; title: string; slug: string }>;
}
