import { Status } from "@/shared/types/enums";

import type { z } from "zod";
import type {
  CreateSkillSchema,
  UpdateSkillSchema,
  SkillQuerySchema,
} from "../schemas/skill.schema";
export type CreateSkillPayload = z.infer<typeof CreateSkillSchema>;
export type UpdateSkillPayload = z.infer<typeof UpdateSkillSchema>;
export type SkillQueryPayload = SkillQueryParams;
export interface SkillQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
}
export type SkillQueryValidated = z.infer<typeof SkillQuerySchema>;
export interface Skill {
  id: string;
  title: string;
  shortDesc: string | null;
  icon: string | null;
  status: Status;
  createdById: string | null;
  updatedById: string | null;
  order: number;
  publishedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  categories?: any[];
  tags?: any[];
  profiles?: any[];
}
