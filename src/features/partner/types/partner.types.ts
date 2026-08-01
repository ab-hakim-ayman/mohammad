import { Status } from "@/shared/types/enums";

import type { z } from "zod";
import type {
  CreatePartnerSchema,
  UpdatePartnerSchema,
  PartnerQuerySchema,
} from "../schemas/partner.schema";
import type { AuditUserSummary } from "@/shared/types";
export type CreatePartnerPayload = z.infer<typeof CreatePartnerSchema>;
export type UpdatePartnerPayload = z.infer<typeof UpdatePartnerSchema>;
export type PartnerQueryValidated = z.infer<typeof PartnerQuerySchema>;

export interface PartnerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: string;
  type?: string;
  isFeatured?: boolean;
}
export type PublicPartnerQueryParams = { limit?: number };

export interface Partner {
  id: string;
  title: string;
  logo: string | null;
  website: string | null;
  shortDesc: string | null;
  type: "TECHNOLOGY" | "RESELLER" | "ALLIANCE" | "AFFILIATE";
  order: number;
  isFeatured: boolean;
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
