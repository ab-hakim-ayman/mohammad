import { Status } from "@/shared/types/enums";
import type { Prisma } from "@prisma/client";

import type { z } from "zod";
import type {
  CreateIndustrySchema,
  UpdateIndustrySchema,
  IndustryQuerySchema,
} from "../schemas/industry.schema";
export type CreateIndustryPayload = z.infer<typeof CreateIndustrySchema>;
export type UpdateIndustryPayload = z.infer<typeof UpdateIndustrySchema>;
export interface IndustryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
  isFeatured?: boolean;
}
export type IndustryQueryValidated = z.infer<typeof IndustryQuerySchema>;
export type Industry = Prisma.IndustryGetPayload<{
  include: {
    services: true;
    projects: { include: { caseStudy: true } };
    createdBy: true;
    updatedBy: true;
  };
}> & {
  _count?: { services: number; projects: number };
};
