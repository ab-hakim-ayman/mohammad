import { Status } from "@/shared/types/enums";

import type { z } from "zod";
import type { AuditUserSummary } from "@/shared/types";
import type {
  CreateGallerySchema,
  UpdateGallerySchema,
  GalleryQuerySchema,
  CreateGalleryItemSchema,
  UpdateGalleryItemSchema,
} from "../schemas/gallery.schema";

export type CreateGalleryPayload = z.infer<typeof CreateGallerySchema>;
export type UpdateGalleryPayload = z.infer<typeof UpdateGallerySchema>;
export type GalleryQueryValidated = z.infer<typeof GalleryQuerySchema>;
export type CreateGalleryItemPayload = z.infer<typeof CreateGalleryItemSchema>;
export type UpdateGalleryItemPayload = z.infer<typeof UpdateGalleryItemSchema>;

export interface GalleryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: Status;
}

export type PublicGalleryQueryParams = { limit?: number };

export interface GalleryItem {
  id: string;
  galleryId: string;
  title: string | null;
  shortDesc: string | null;
  image: string | null;
  type: "IMAGE" | "VIDEO";
  videoUrl: string | null;
  thumbnail: string | null;
  order: number;
  status: Status;
  publishedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Gallery {
  id: string;
  title: string;
  slug: string;
  shortDesc: string | null;
  contentJson: unknown | null;
  coverImage: string | null;
  ogImage: string | null;
  order: number;
  status: Status;
  publishedAt: Date | null;
  archivedAt: Date | null;
  createdById: string | null;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: GalleryItem[];
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
}
