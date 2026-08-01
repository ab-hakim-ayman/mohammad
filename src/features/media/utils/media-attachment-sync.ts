import { mediaRepository } from "../repositories/media.repository";
import type { MediaUsageType } from "@/shared/types";
import type { MediaEntityType } from "@/shared/types/media";
export type MediaAttachmentSyncValue = string | string[] | null | undefined;
export interface MediaAttachmentSyncField {
  fieldName: string;
  value: MediaAttachmentSyncValue;
  usageType: MediaUsageType;
  isPrimary?: boolean;
  altText?: string | null;
  altTexts?: (string | null)[];
  isNewUpload?: boolean;
}
export const ENTITY_TYPE_MAP: Record<string, MediaEntityType> = {
  "site-info": "SITE_INFO",
  about: "ABOUT",
  hero: "HERO",
  profile: "PROFILE",
  blog: "BLOG",
  industry: "INDUSTRY",
  project: "PROJECT",
  "case-study": "CASE_STUDY",
  service: "SERVICE",
  specialization: "SPECIALIZATION",
  event: "EVENT",
  achievement: "ACHIEVEMENT",
  gallery: "GALLERY",
  "gallery-item": "GALLERY_ITEM",
  client: "CLIENT",
  partner: "PARTNER",
  technology: "TECHNOLOGY",
  skill: "SKILL",
  category: "CATEGORY",
  tag: "TAG",
  testimonial: "TESTIMONIAL",
  experience: "EXPERIENCE",
  education: "EDUCATION",
};

function normalizeEntityType(entityType: string): MediaEntityType {
  const normalized = ENTITY_TYPE_MAP[entityType];
  if (!normalized) {
    throw new Error(`Unsupported media entity type: ${entityType}`);
  }
  return normalized;
}
function normalizeUrls(value: MediaAttachmentSyncValue): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }
  const trimmed = value.trim();
  return trimmed ? [trimmed] : [];
}
export async function syncMediaAttachments(
  entityType: string,
  entityId: string,
  fields: MediaAttachmentSyncField[],
  actorId?: string | null
) {
  const urls = Array.from(new Set(fields.flatMap((field) => normalizeUrls(field.value))));
  const mediaAssets = urls.length ? await mediaRepository.findByUrls(urls) : [];
  const lookup = new Map<string, (typeof mediaAssets)[number]>();
  for (const media of mediaAssets) {
    lookup.set(media.url, media);
  }
  const normalizedEntityType = normalizeEntityType(entityType);
  await mediaRepository.deleteAttachmentsByEntityAndFields(
    normalizedEntityType,
    entityId,
    fields.map((field) => field.fieldName)
  );
  const altTextUpdates: Promise<any>[] = [];
  const attachments = fields.flatMap((field) => {
    const fieldUrls = normalizeUrls(field.value);
    const isNewUpload = field.isNewUpload;
    const fieldAltText = field.altText;
    const fieldAltTexts = field.altTexts;
    return fieldUrls.flatMap((url, index) => {
      const media = lookup.get(url);
      if (!media) return [];
      const perItemAltText = fieldAltTexts?.[index] ?? null;
      if (isNewUpload === true && (fieldAltText || perItemAltText)) {
        altTextUpdates.push(
          mediaRepository.updateAltText(media.id, perItemAltText || fieldAltText || "", actorId)
        );
      }
      const attachmentAltText =
        isNewUpload === true ? null : (perItemAltText ?? fieldAltText ?? null);
      return [
        {
          mediaId: media.id,
          entityType: normalizedEntityType,
          entityId,
          fieldName: field.fieldName,
          usageType: field.usageType,
          sortOrder: index,
          isPrimary: field.isPrimary ?? index === 0,
          altText: attachmentAltText,
        },
      ];
    });
  });
  if (altTextUpdates.length) {
    await Promise.all(altTextUpdates);
  }
  if (!attachments.length) return [];

  const uniqueAttachmentsMap = new Map<string, (typeof attachments)[number]>();
  for (const attachment of attachments) {
    const key = `${attachment.mediaId}-${attachment.entityType}-${attachment.entityId}-${attachment.fieldName}`;
    if (!uniqueAttachmentsMap.has(key)) {
      uniqueAttachmentsMap.set(key, attachment);
    }
  }

  return mediaRepository.attachMany(Array.from(uniqueAttachmentsMap.values()));
}
