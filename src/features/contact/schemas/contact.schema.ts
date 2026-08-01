import I18n from "@/shared/components/I18n";
import { Status, ContactStatus } from "@/shared/types/enums";
import { z } from "zod";

export const CreateContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  phone: z.string().optional().nullable(),
  serviceId: z.string().optional().nullable(),
});

export const UpdateContactSchema = z.object({
  status: z.nativeEnum(ContactStatus).optional(),
});

export const ContactQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .enum(["createdAt_desc", "createdAt_asc", "name_asc", "name_desc"])
    .default("createdAt_desc"),
  status: z.nativeEnum(ContactStatus).optional(),
  serviceId: z.string().optional(),
});

export type CreateContactSchemaType = z.infer<typeof CreateContactSchema>;
export type UpdateContactSchemaType = z.infer<typeof UpdateContactSchema>;
export type ContactQuerySchemaType = z.infer<typeof ContactQuerySchema>;
