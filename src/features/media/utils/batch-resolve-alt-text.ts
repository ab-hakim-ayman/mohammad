import I18n from "@/shared/components/I18n";
import prisma from "@/core/server/prisma";
import { ENTITY_TYPE_MAP } from "./media-attachment-sync";

interface EntityMediaFields {
  entityId: string;
  mediaFields: Record<string, string | null | undefined>;
}

interface ResolvedAltText {
  altTexts: Record<string, string>;
}

export async function batchResolveMediaAltText(
  entityType: string,
  entities: EntityMediaFields[]
): Promise<Map<string, ResolvedAltText>> {
  const normalizedEntityType = ENTITY_TYPE_MAP[entityType.trim().toLowerCase()] || ENTITY_TYPE_MAP[entityType];
  if (!normalizedEntityType) {
    throw new Error(`Unsupported media entity type: ${entityType}`);
  }
  if (entities.length === 0) return new Map();

  const allFieldNames = new Set<string>();
  for (const entity of entities) {
    for (const fieldName of Object.keys(entity.mediaFields)) {
      allFieldNames.add(fieldName);
    }
  }

  const allMediaUrls = new Set<string>();
  for (const entity of entities) {
    for (const url of Object.values(entity.mediaFields)) {
      if (url) allMediaUrls.add(url);
    }
  }

  if (allMediaUrls.size === 0) return new Map();

  const attachments = await prisma.mediaAttachment.findMany({
    where: {
      entityType: normalizedEntityType,
      entityId: { in: entities.map((e) => e.entityId) },
      fieldName: { in: Array.from(allFieldNames) },
      media: { url: { in: Array.from(allMediaUrls) } },
    },
    include: {
      media: {
        select: { altText: true, url: true },
      },
    },
  });

  const attachmentLookup = new Map<string, (typeof attachments)[0]>();
  for (const att of attachments) {
    const key = `${att.entityType}::${att.entityId}::${att.fieldName}`;
    attachmentLookup.set(key, att);
  }

  const mediaRecords = await prisma.media.findMany({
    where: { url: { in: Array.from(allMediaUrls) } },
    select: { url: true, altText: true },
  });
  const mediaByUrl = new Map<string, string | null>();
  for (const media of mediaRecords) {
    mediaByUrl.set(media.url, media.altText);
  }

  const result = new Map<string, ResolvedAltText>();

  for (const entity of entities) {
    const altTexts: Record<string, string> = {};

    for (const [fieldName, mediaUrl] of Object.entries(entity.mediaFields)) {
      if (!mediaUrl) {
        altTexts[fieldName] = "";
        continue;
      }

      const lookupKey = `${normalizedEntityType}::${entity.entityId}::${fieldName}`;
      const attachment = attachmentLookup.get(lookupKey);

      if (attachment?.altText) {
        // Priority 1: MediaAttachment.altText
        altTexts[fieldName] = attachment.altText;
      } else if (attachment?.media?.altText) {
        // Priority 2: Media.altText via attachment relationship
        altTexts[fieldName] = attachment.media.altText;
      } else {
        // Priority 3: Media.altText by URL lookup
        altTexts[fieldName] = mediaByUrl.get(mediaUrl) ?? "";
      }
    }

    result.set(entity.entityId, { altTexts });
  }

  return result;
}
