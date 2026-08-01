import { Status } from "@/shared/types/enums";

import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type {
  CreateClientSchema,
  UpdateClientSchema,
  ClientQuerySchema,
} from "../schemas/client.schema";
export type CreateClientPayload = z.infer<typeof CreateClientSchema>;
export type UpdateClientPayload = z.infer<typeof UpdateClientSchema>;
export type ClientQueryValidated = z.infer<typeof ClientQuerySchema>;

export interface ClientQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: string;
  isFeatured?: boolean;
}
export type PublicClientQueryParams = { limit?: number; isFeatured?: boolean };

export interface Client {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  contentJson: unknown | null;
  logo: string | null;
  heroImage: string | null;
  ogImage: string | null;
  website: string | null;
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
