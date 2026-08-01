import { Status } from "@/shared/types/enums";

import type { AuditUserSummary } from "@/shared/types";
// ✅ 'type' কিওয়ার্ড যোগ করা হয়েছে
import type { AchievementType } from "@prisma/client";
import type { z } from "zod";
import type {
  CreateAchievementSchema,
  UpdateAchievementSchema,
  AchievementQuerySchema,
} from "../schemas/achievement.schema";

export type CreateAchievementPayload = z.infer<typeof CreateAchievementSchema>;
export type UpdateAchievementPayload = z.infer<typeof UpdateAchievementSchema>;
export type AchievementQueryValidated = z.infer<typeof AchievementQuerySchema>;

export interface AchievementQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
  type?: string;
  isFeatured?: boolean;
}

export type PublicAchievementQueryParams = { limit?: number };

export interface Achievement {
  id: string;
  title: string;
  slug: string;
  type: AchievementType;
  issuer: string;
  achievedAt: Date | null;
  shortDesc: string | null;
  contentJson: unknown | null;
  icon: string | null;
  image: string | null;
  cardImage: string | null;
  heroImage: string | null;
  certificateUrl: string | null;
  ogImage: string | null;
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