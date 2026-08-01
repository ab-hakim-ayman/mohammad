import prisma from "@/core/server/prisma";
import { ENTITY_TYPE_MAP } from "./media-attachment-sync";

export async function resolveMediaAltText(
  entityType: string,
  entityId: string,
  fieldName: string,
  mediaUrls: string[]
): Promise<Record<string, string>> {
  const normalizedEntityType = ENTITY_TYPE_MAP[entityType];
  if (!normalizedEntityType) {
    throw new Error(`Unsupported media entity type: ${entityType}`);
  }

  const attachments = await prisma.mediaAttachment.findMany({
    where: {
      entityType: normalizedEntityType,
      entityId,
      fieldName,
      media: { url: { in: mediaUrls } },
    },
    include: { media: { select: { altText: true, url: true } } },
  });

  const result: Record<string, string> = {};
  for (const att of attachments) {
    result[att.fieldName] = att.altText ?? att.media.altText ?? "";
  }
  return result;
}
