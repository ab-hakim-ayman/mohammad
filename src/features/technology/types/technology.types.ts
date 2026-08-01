import { Status } from "@/shared/types/enums";

import type { z } from "zod";
import type {
  CreateTechnologySchema,
  UpdateTechnologySchema,
  TechnologyQuerySchema,
} from "../schemas/technology.schema";

export type CreateTechnologyPayload = z.infer<typeof CreateTechnologySchema>;
export type UpdateTechnologyPayload = z.infer<typeof UpdateTechnologySchema>;
export interface TechnologyQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
}
export type TechnologyQueryValidated = z.infer<typeof TechnologyQuerySchema>;
export interface TechnologyProjectSummary {
  id: string;
  title: string;
  slug: string;
  status: Status;
  cardImage?: string | null;
}

export interface Technology {
  id: string;
  title: string;
  shortDesc: string | null;
  logo: string | null;
  status: Status;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
  archivedAt?: Date | null;
  projects?: TechnologyProjectSummary[];
  categories?: any[];
  tags?: any[];
  services?: any[];
  createdById?: string | null;
  updatedById?: string | null;
  _count?: { projects: number };
}
