import { Status } from "@/shared/types/enums";
import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type { RichContentDocument } from "@/components/content/types";
import type { CreateEducationSchema, UpdateEducationSchema, EducationQuerySchema } from "../schemas/education.schema";

export type CreateEducationPayload = z.infer<typeof CreateEducationSchema>;
export type UpdateEducationPayload = z.infer<typeof UpdateEducationSchema>;
export type EducationQueryValidated = z.infer<typeof EducationQuerySchema>;

export interface EducationApiQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
  isFeatured?: boolean;
}

export interface PublicEducationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface Education {
  id: string;
  institution: string;
  institutionUrl: string | null;
  degree: string;
  fieldOfStudy: string | null;
  grade: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  shortDesc: string | null;
  contentJson: RichContentDocument | null;
  logo: string | null;
  certificateUrl: string | null;
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
