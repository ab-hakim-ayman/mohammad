import { PrismaClient, MediaEntityType as PrismaMediaEntityType } from "@prisma/client";
import type { MediaEntityType, MediaResourceType } from "@/shared/types/media";
import { deleteCloudinaryAsset } from "@/core/server/media";

const ENTITY_TYPE_MAP: Record<string, MediaEntityType> = {
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

export async function cleanupMediaAttachmentsForEntity(
  tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
  entityType: string,
  entityId: string
) {
  const normalizedEntityType = ENTITY_TYPE_MAP[entityType];
  if (!normalizedEntityType) {
    throw new Error(`Unsupported media entity type: ${entityType}`);
  }

  const deletedAttachments = await tx.mediaAttachment.deleteMany({
    where: {
      entityType: normalizedEntityType as PrismaMediaEntityType,
      entityId,
    },
  });

  if (deletedAttachments.count > 0) {
    const orphanedMedia = await tx.media.findMany({
      where: {
        attachments: { none: {} },
      },
    });

    for (const media of orphanedMedia) {
      try {
        await deleteCloudinaryAsset(media.providerAssetId, media.resourceType as MediaResourceType);
      } catch {}

      await tx.media.delete({ where: { id: media.id } });
    }
  }
}
