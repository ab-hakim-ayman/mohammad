import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";

import { z } from "zod";
export const CreateFaqSchema = z.object({
  question: z.string().min(2).max(300),
  answer: z.string().min(2).max(5000),
  order: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  status: z.nativeEnum(Status).default(Status.DRAFT),
  categoryIds: z.array(z.string()).default([]),
  eventIds: z.array(z.string()).default([]),
  serviceIds: z.array(z.string()).default([]),
});
export const UpdateFaqSchema = CreateFaqSchema.partial();
export const FaqQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum([
      "question_asc",
      "question_desc",
      "order_asc",
      "order_desc",
      "createdAt_desc",
      "createdAt_asc",
    ])
    .default("order_asc"),
  status: z.nativeEnum(Status).optional(),
  isFeatured: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional()
  ),
});
export type CreateFaqSchemaType = z.infer<typeof CreateFaqSchema>;
export type UpdateFaqSchemaType = z.infer<typeof UpdateFaqSchema>;
export type FaqQuerySchemaType = z.infer<typeof FaqQuerySchema>;
