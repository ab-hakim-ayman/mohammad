import { ContactStatus } from "@/shared/types/enums";

import type { z } from "zod";
import type {
  CreateContactSchema,
  UpdateContactSchema,
  ContactQuerySchema,
} from "../schemas/contact.schema";

export type CreateContactPayload = z.infer<typeof CreateContactSchema>;
export type UpdateContactPayload = z.infer<typeof UpdateContactSchema>;
export type ContactQueryValidated = z.infer<typeof ContactQuerySchema>;

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone: string | null;
  status: ContactStatus;
  repliedAt: Date | null;
  archivedAt: Date | null;

  serviceId: string | null;
  service?: { id: string; title: string } | null;

  createdAt: Date;
  updatedAt: Date;
}
