import { Status, EmploymentType } from "@/shared/types/enums";
import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type { RichContentDocument } from "@/components/content/types";
import type { CreateExperienceSchema, UpdateExperienceSchema, ExperienceQuerySchema } from "../schemas/experience.schema";

export type CreateExperiencePayload = z.infer<typeof CreateExperienceSchema>;
export type UpdateExperiencePayload = z.infer<typeof UpdateExperienceSchema>;
export type ExperienceQueryValidated = z.infer<typeof ExperienceQuerySchema>;

export interface ExperienceApiQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
  isFeatured?: boolean;
}

export interface PublicExperienceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface Experience {
  id: string;
  companyName: string;
  companyUrl: string | null;
  position: string;
  employmentType: EmploymentType;
  location: string | null;
  locationType: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  shortDesc: string | null;
  contentJson: RichContentDocument | null;
  logo: string | null;
  cardImage: string | null;
  ogImage: string | null;
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
  projects?: Array<{ id: string; title: string; slug: string }>;
  technologies?: Array<{ id: string; title: string }>;
}
