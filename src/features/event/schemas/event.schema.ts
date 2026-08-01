import I18n from "@/shared/components/I18n";
import { Status, EventFormat } from "@/shared/types/enums";
import { z } from "zod";

import { emptyStringToNull } from "@/shared/utils/schema";
import { richContentDocumentSchema } from "@/components/content/validation";

export const CreateEventSchema = z.object({
  title: z.string().min(2).max(150),
  slug: z
    .string()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDesc: z.string().optional().nullable(),
  contentJson: richContentDocumentSchema.optional().nullable(),

  startsAt: z.preprocess(emptyStringToNull, z.coerce.date()),
  endsAt: z.preprocess(emptyStringToNull, z.coerce.date().optional().nullable()),
  timeZone: z.string().default("Asia/Dhaka"),

  format: z.nativeEnum(EventFormat).default(EventFormat.OFFLINE),
  location: z.string().max(200).optional().nullable(),
  meetingUrl: z.string().url().optional().nullable(),

  cardImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  heroVideoUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  galleryImages: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.string()).default([])),
  demoVideoUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  ogImage: z.string().optional().nullable(),

  registrationUrl: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
  registrationDeadline: z.preprocess(emptyStringToNull, z.coerce.date().optional().nullable()),
  isFree: z.boolean().default(true),
  capacity: z.number().int().positive().optional().nullable(),

  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),

  status: z.nativeEnum(Status).default(Status.DRAFT),
  isFeatured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
  faqIds: z.array(z.string()).default([]),

  cardImageAlt: z.string().max(500).optional().nullable(),
  heroImageAlt: z.string().max(500).optional().nullable(),
  ogImageAlt: z.string().max(500).optional().nullable(),
  galleryImagesAltTexts: z.array(z.string().max(255).nullable()).optional(),
});

export const UpdateEventSchema = CreateEventSchema.partial();

export const EventQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum([
      "title_asc",
      "title_desc",
      "startsAt_desc",
      "startsAt_asc",
      "createdAt_desc",
      "createdAt_asc",
    ])
    .default("startsAt_desc"),
  status: z.nativeEnum(Status).optional(),
  format: z.nativeEnum(EventFormat).optional(),
  isFree: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional()
  ),
  isFeatured: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional()
  ),
});

export type CreateEventSchemaType = z.infer<typeof CreateEventSchema>;
export type UpdateEventSchemaType = z.infer<typeof UpdateEventSchema>;
export type EventQuerySchemaType = z.infer<typeof EventQuerySchema>;
