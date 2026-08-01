import { Status } from "@/shared/types/enums";
import type { z } from "zod";
import type {
  AuditUserSummary,
  MediaEntityType,
  MediaProvider,
  MediaResourceType,
  MediaSummary,
  MediaUsageSummary,
  MediaUsageType,
} from "@/shared/types";
import {
  MediaAttachmentSchema,
  MediaQuerySchema,
  MediaUpdateSchema,
  MediaUploadMetaSchema,
} from "../schemas/media.schema";
export type MediaQueryValidated = z.infer<typeof MediaQuerySchema>;
export type MediaUpdatePayload = z.infer<typeof MediaUpdateSchema>;
export type MediaAttachmentPayload = z.infer<typeof MediaAttachmentSchema>;
export type MediaUploadMetaPayload = z.infer<typeof MediaUploadMetaSchema>;

export interface MediaAttachmentRecord extends MediaUsageSummary {
  mediaId: string;
}

export interface MediaRecord extends MediaSummary {
  attachments?: MediaAttachmentRecord[];
  createdBy?: AuditUserSummary | null;
  updatedBy?: AuditUserSummary | null;
}

export interface MediaUploadAttachmentTarget {
  entityType: MediaEntityType;
  entityId: string;
  fieldName?: string;
  usageType: MediaUsageType;
  isPrimary?: boolean;
  sortOrder?: number;
  altText?: string | null;
}

export interface MediaUploadInput {
  files: File[];
  folder?: string | null;
  altText?: string | null;
  attachment?: MediaUploadAttachmentTarget | null;
}

export interface MediaCreateInput {
  provider: MediaProvider;
  resourceType: MediaResourceType;
  providerAssetId: string;
  url: string;
  originalFilename: string | null;
  mimeType: string | null;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  folder: string | null;
  altText: string | null;
  createdById: string | null;
  updatedById: string | null;
}

export interface MediaAttachmentCreateInput {
  entityType: MediaEntityType;
  entityId: string;
  fieldName?: string;
  usageType: MediaUsageType;
  sortOrder?: number;
  isPrimary?: boolean;
  altText?: string | null;
}
