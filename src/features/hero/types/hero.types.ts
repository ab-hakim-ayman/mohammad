import { Status } from "@/shared/types/enums";

import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type { CreateHeroSchema, UpdateHeroSchema, HeroQuerySchema } from "../schemas/hero.schema";
export type CreateHeroPayload = z.infer<typeof CreateHeroSchema> & {
  heroImageAlt?: string | null;
};
export type UpdateHeroPayload = z.infer<typeof UpdateHeroSchema> & {
  heroImageAlt?: string | null;
};
export interface HeroQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
  isActive?: boolean;
}
export type HeroQueryValidated = z.infer<typeof HeroQuerySchema>;
export interface Hero {
  id: string;
  key: string;
  title: string;
  shortDesc: string | null;
  heroImage: string | null;
  heroImageAlt?: string | null;
  heroVideoUrl: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  secondaryCtaText: string | null;
  secondaryCtaLink: string | null;
  status: Status;
  isActive: boolean;
  order: number;
  publishedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string | null;
  updatedById: string | null;
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
}
