import { Status } from "@/shared/types/enums";

import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type { CreateFaqSchema, UpdateFaqSchema, FaqQuerySchema } from "../schemas/faq.schema";

export type CreateFaqPayload = z.infer<typeof CreateFaqSchema>;
export type UpdateFaqPayload = z.infer<typeof UpdateFaqSchema>;
export type FaqQueryValidated = z.infer<typeof FaqQuerySchema>;

export interface FaqQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
  isFeatured?: boolean;
}

export type PublicFaqQueryParams = { limit?: number; category?: string };

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
  isFeatured: boolean;
  status: Status;
  publishedAt: Date | null;
  archivedAt: Date | null;
  createdById: string | null;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date;
  categories?: { id: string; title: string; slug: string }[];
  events?: { id: string; title: string; slug: string }[];
  services?: { id: string; title: string; slug: string }[];
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
}
