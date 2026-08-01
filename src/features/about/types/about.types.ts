import { Status } from "@/shared/types/enums";

import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type {
  CreateAboutSchema,
  UpdateAboutSchema,
  AboutQuerySchema,
} from "../schemas/about.schema";

export type CreateAboutPayload = z.infer<typeof CreateAboutSchema> & {
  heroImageAlt?: string | null;
  ogImageAlt?: string | null;
  galleryImagesAltTexts?: (string | null)[];
};
export type UpdateAboutPayload = z.infer<typeof UpdateAboutSchema> & {
  heroImageAlt?: string | null;
  ogImageAlt?: string | null;
  galleryImagesAltTexts?: (string | null)[];
};
export interface AboutQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
}
export type AboutQueryValidated = z.infer<typeof AboutQuerySchema>;
export interface About {
  id: string;
  key: string;
  title: string;
  shortDesc: string | null;
  contentJson: unknown | null;
  heroImage: string | null;
  galleryImages: string[];
  ogImage: string | null;
  status: Status;

  publishedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string | null;
  updatedById: string | null;
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
}
