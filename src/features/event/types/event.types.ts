import { Status, EventFormat } from "@/shared/types/enums";

import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type {
  CreateEventSchema,
  UpdateEventSchema,
  EventQuerySchema,
} from "../schemas/event.schema";

export type CreateEventPayload = z.infer<typeof CreateEventSchema>;
export type UpdateEventPayload = z.infer<typeof UpdateEventSchema>;
export type EventQueryValidated = z.infer<typeof EventQuerySchema>;

export interface EventApiQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
  format?: EventFormat;
  isFree?: boolean;
  isFeatured?: boolean;
}

export interface PublicEventQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  format?: EventFormat;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  contentJson?: any;
  startsAt: Date;
  endsAt: Date | null;
  timeZone: string;
  format: EventFormat;
  location: string | null;
  meetingUrl: string | null;
  cardImage: string | null;
  heroImage: string | null;
  heroVideoUrl: string | null;
  galleryImages: string[];
  demoVideoUrl: string | null;
  ogImage: string | null;
  registrationUrl: string | null;
  registrationDeadline: Date | null;
  isFree: boolean;
  capacity: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: Status;
  isFeatured: boolean;
  order: number;

  faqs?: { id: string; question: string; answer: string | null }[];

  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  archivedAt: Date | null;

  createdById: string | null;
  updatedById: string | null;
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
}
