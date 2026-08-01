import { Status } from "@/shared/types/enums";
import type { AuditUserSummary } from "@/shared/types";

import type { z } from "zod";
import type { CreateTagSchema, UpdateTagSchema, TagQuerySchema } from "../schemas/tag.schema";
export type CreateTagPayload = z.infer<typeof CreateTagSchema>;
export type UpdateTagPayload = z.infer<typeof UpdateTagSchema>;
export interface TagQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
}
export type TagQueryValidated = z.infer<typeof TagQuerySchema>;
export interface Tag {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  status: Status;

  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
  archivedAt?: Date | null;
  blogs?: Array<{ id: string; title: string; slug: string }>;
  projects?: Array<{ id: string; title: string; slug: string }>;
  services?: Array<{ id: string; title: string; slug: string }>;
  caseStudies?: Array<{ id: string; title: string; slug: string }>;
  technologies?: Array<{ id: string; title: string }>;
  skills?: Array<{ id: string; title: string }>;
  createdById: string | null;
  updatedById: string | null;
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
}
