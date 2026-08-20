import { Status } from "@/shared/types/enums";
import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type {
  createToolSchema,
  updateToolSchema,
  toolQuerySchema,
} from "../schemas/tool.schema";

export type ToolEngineType = "SCHEMA" | "CUSTOM";

export type CreateToolPayload = z.infer<typeof createToolSchema>;
export type UpdateToolPayload = z.infer<typeof updateToolSchema>;
export type ToolQueryValidated = z.infer<typeof toolQuerySchema>;

export interface ToolQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categories?: string;
  sort?: string;
  status?: Status;
  isFeatured?: boolean;
  engineType?: ToolEngineType;
}

export interface CategorySummary {
  id: string;
  title: string;
  slug: string;
}

export interface Tool {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  categories?: CategorySummary[];
  icon: string | null;
  engineType: ToolEngineType;
  actionKey: string | null;
  componentKey: string | null;

  cardImage: string | null;
  heroImage: string | null;
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
}
