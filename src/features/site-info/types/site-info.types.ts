import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type { SiteInfoQuerySchema, SiteInfoSchema } from "../schemas/site-info.schema";
export type SiteInfoPayload = z.infer<typeof SiteInfoSchema>;
export type CreateSiteInfoPayload = z.infer<typeof SiteInfoSchema>;
export type UpdateSiteInfoPayload = Partial<CreateSiteInfoPayload>;

export interface SiteInfoQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}
export type SiteInfoQueryValidated = z.infer<typeof SiteInfoQuerySchema>;

export interface SiteInfoRecord extends SiteInfoPayload {
  id: string;
  key: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string | null;
  updatedById: string | null;
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
}
