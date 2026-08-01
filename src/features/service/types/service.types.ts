import { Status } from "@/shared/types/enums";

import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type { RichContentDocument } from "@/components/content/types";
import type {
  CreateServiceSchema,
  UpdateServiceSchema,
  ServiceQuerySchema,
} from "../schemas/service.schema";
export type CreateServicePayload = z.infer<typeof CreateServiceSchema>;
export type UpdateServicePayload = z.infer<typeof UpdateServiceSchema>;
export type ServiceQueryValidated = z.infer<typeof ServiceQuerySchema>;
export interface ServiceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
  isFeatured?: boolean;
}
export type PublicServiceQueryParams = ServiceQueryParams;
export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  contentJson: RichContentDocument | null;
  icon: string | null;
  cardImage: string | null;
  heroImage: string | null;
  heroVideoUrl: string | null;
  galleryImages: string[];
  demoVideoUrl: string | null;
  ogImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  order: number;
  status: Status;
  isFeatured: boolean;
  industries?: any[];
  technologies?: any[];
  projects?: any[];
  faqs?: any[];
  testimonials?: any[];
  categories?: any[];
  tags?: any[];
  specializations?: any[];

  publishedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string | null;
  updatedById: string | null;
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
}
