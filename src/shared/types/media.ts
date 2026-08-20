export type MediaProvider = "CLOUDINARY";

export type MediaResourceType = "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" | "OTHER";

export type MediaUsageType =
  | "LOGO"
  | "FAVICON"
  | "HERO"
  | "HERO_VIDEO"
  | "BANNER"
  | "COVER"
  | "CARD"
  | "OG_IMAGE"
  | "GALLERY"
  | "AVATAR"
  | "THUMBNAIL"
  | "VIDEO"
  | "DOCUMENT"
  | "INLINE"
  | "OTHER";

export type MediaEntityType =
  | "SITE_INFO"
  | "ABOUT"
  | "HERO"
  | "PROFILE"
  | "BLOG"
  | "PROJECT"
  | "CASE_STUDY"
  | "SERVICE"
  | "SPECIALIZATION"
  | "ACHIEVEMENT"
  | "GALLERY"
  | "GALLERY_ITEM"
  | "TECHNOLOGY"
  | "SKILL"
  | "CATEGORY"
  | "TAG"
  | "TESTIMONIAL"
  | "EXPERIENCE"
  | "EDUCATION"
  | "TOOL";

export interface MediaUsageSummary {
  id: string;
  entityType: MediaEntityType;
  entityId: string;
  fieldName: string;
  usageType: MediaUsageType;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaSummary {
  id: string;
  provider: MediaProvider;
  resourceType: MediaResourceType;
  providerAssetId: string;
  publicId?: string;
  url: string;
  secureUrl?: string;
  originalFilename: string | null;
  mimeType: string | null;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  folder: string | null;
  altText: string | null;
  alt?: string | null;
  isArchived: boolean;
  archivedAt: Date | null;
  createdById: string | null;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date;
  attachments?: MediaUsageSummary[];
}
