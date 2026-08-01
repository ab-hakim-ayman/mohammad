import I18n from "@/shared/components/I18n";
import { Status } from "@/shared/types/enums";

import { z } from "zod";
import { emptyStringToNull } from "@/shared/utils/schema";
export const CreateTestimonialSchema = z
  .object({
    authorName: z.string().min(2, "Name must be at least 2 characters").max(100),
    authorPosition: z.string().min(2, "Position is required").max(100),
    message: z.string().min(10, "Message must be at least 10 characters").max(1000),
    rating: z.number().int().min(1).max(5).default(5),
    authorImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()),
    type: z.enum(["CLIENT", "EMPLOYEE"]).default("CLIENT"),
    clientId: z.string().optional().nullable(),
    employeeId: z.string().optional().nullable(),
    source: z.enum(["ADMIN", "REQUEST_LINK", "PUBLIC_FORM"]).default("ADMIN"),
    email: z.string().email().optional().nullable(),
    status: z.nativeEnum(Status).default(Status.DRAFT),

    isFeatured: z.boolean().default(false),
    order: z.coerce.number().int().min(0).default(0),

    submittedAt: z.string().datetime().optional().nullable(),
    consentAt: z.string().datetime().optional().nullable(),

    authorImageAlt: z.string().max(500).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "EMPLOYEE" && !data.employeeId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Employee must be selected for employee testimonials",
        path: ["employeeId"],
      });
    }
    if (data.type === "EMPLOYEE") {
      data.clientId = null;
    } else if (data.type === "CLIENT") {
      data.employeeId = null;
    }
  });
export const UpdateTestimonialSchema = z
  .object({
    authorName: z.string().min(2).max(100).optional(),
    authorPosition: z.string().min(2).max(100).optional(),
    message: z.string().min(10).max(1000).optional(),
    rating: z.number().int().min(1).max(5).optional(),
    authorImage: z.preprocess(emptyStringToNull, z.string().optional().nullable()).optional(),
    type: z.enum(["CLIENT", "EMPLOYEE"]).optional(),
    clientId: z.string().optional().nullable(),
    employeeId: z.string().optional().nullable(),
    source: z.enum(["ADMIN", "REQUEST_LINK", "PUBLIC_FORM"]).optional(),
    email: z.string().email().optional().nullable(),
    status: z.nativeEnum(Status).optional(),
    isFeatured: z.boolean().optional(),
    order: z.coerce.number().int().min(0).optional(),
    submittedAt: z.string().datetime().optional().nullable(),
    consentAt: z.string().datetime().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "EMPLOYEE" && data.employeeId === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Employee must be selected for employee testimonials",
        path: ["employeeId"],
      });
    }
    if (data.type === "EMPLOYEE") {
      data.clientId = null;
    } else if (data.type === "CLIENT") {
      data.employeeId = null;
    }
  });
export const TestimonialQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum([
      "createdAt_desc",
      "createdAt_asc",
      "authorName_asc",
      "authorName_desc",
      "rating_desc",
      "order_asc",
    ])
    .default("order_asc"),
  status: z.nativeEnum(Status).optional(),
  isFeatured: z.preprocess(
    (val) => (val === "true" ? true : val === "false" ? false : undefined),
    z.boolean().optional()
  ),
  type: z.enum(["CLIENT", "EMPLOYEE"]).optional(),
  source: z.enum(["ADMIN", "REQUEST_LINK", "PUBLIC_FORM"]).optional(),
});
export type CreateTestimonialSchemaType = z.infer<typeof CreateTestimonialSchema>;
export type UpdateTestimonialSchemaType = z.infer<typeof UpdateTestimonialSchema>;
export type TestimonialQuerySchemaType = z.infer<typeof TestimonialQuerySchema>;
