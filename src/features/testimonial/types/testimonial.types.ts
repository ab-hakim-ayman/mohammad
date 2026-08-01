import { Status } from "@/shared/types/enums";
import type { AuditUserSummary } from "@/shared/types";

import type { z } from "zod";
import type {
  CreateTestimonialSchema,
  UpdateTestimonialSchema,
  TestimonialQuerySchema,
} from "../schemas/testimonial.schema";
export type CreateTestimonialPayload = z.infer<typeof CreateTestimonialSchema>;
export type UpdateTestimonialPayload = z.infer<typeof UpdateTestimonialSchema>;
export interface TestimonialQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
  isFeatured?: boolean;
  type?: "CLIENT" | "EMPLOYEE";
  source?: "ADMIN" | "REQUEST_LINK" | "PUBLIC_FORM";
}
export type TestimonialQueryValidated = z.infer<typeof TestimonialQuerySchema>;
export interface Testimonial {
  id: string;
  authorName: string;
  authorPosition: string | null;
  message: string;
  rating: number;
  authorImage: string | null;
  authorImageAlt?: string | null;
  status: Status;
  type: "CLIENT" | "EMPLOYEE";
  clientId: string | null;
  employeeId: string | null;
  source: "ADMIN" | "REQUEST_LINK" | "PUBLIC_FORM";
  email: string | null;
  isFeatured: boolean;
  order: number;
  submittedAt: Date | null;
  consentAt: Date | null;
  publishedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string | null;
  updatedById: string | null;
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
  client?: { id: string; title: string; logo: string | null } | null;
  employee?: { id: string; name: string | null; avatar: string | null } | null;
  caseStudies?: Array<{ id: string; title: string; slug: string }>;
  services?: Array<{ id: string; title: string; slug: string }>;
}
