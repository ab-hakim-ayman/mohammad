import I18n from "@/shared/components/I18n";

import { Prisma } from "@prisma/client";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import { achievementRepository } from "../repositories/achievement.repository";
import {
  CreateAchievementPayload,
  UpdateAchievementPayload,
  AchievementQueryValidated,
} from "../types/achievement.types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const achievementService = {
  async getAll(params: AchievementQueryValidated) {
    return achievementRepository.findAll(params);
  },

  async getById(id: string) {
    const achievement = await achievementRepository.findById(id);
    if (!achievement) throw AppError.notFound("Achievement not found");
    return achievement;
  },

  async getBySlug(slug: string) {
    const achievement = await achievementRepository.findBySlug(slug);
    if (!achievement) throw AppError.notFound("Achievement not found");
    return achievement;
  },

  async getPublished(limit?: number) {
    const achievements = await achievementRepository.findPublished(limit);
    return achievements;
  },

  async create(data: CreateAchievementPayload, actorId?: string | null) {
    const slug = data.slug || slugify(data.title);

    const existingSlug = await achievementRepository.findBySlug(slug);
    if (existingSlug) {
      throw AppError.conflict(`An achievement with the slug '${slug}' already exists.`);
    }

    const createData: Prisma.AchievementCreateInput = {
      title: data.title,
      slug,
      issuer: data.issuer,
      achievedAt: data.achievedAt ?? null,
      shortDesc: data.shortDesc ?? null,
      type: data.type,
      isFeatured: data.isFeatured ?? false,
      cardImage: data.cardImage || null,
      heroImage: data.heroImage || null,
      certificateUrl: data.certificateUrl || null,
      ogImage: data.ogImage || null,
      contentJson: data.contentJson || null,
      icon: data.icon || null,
      image: data.image || null,
      order: data.order,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    };

    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }

    const result = await achievementRepository.create(createData);

    await syncMediaAttachments(
      "achievement",
      result.id,
      [
        {
          fieldName: "cardImage",
          value: result.cardImage,
          usageType: "GALLERY",
          altText: data.cardImageAlt,
          isNewUpload: true,
        },
        {
          fieldName: "heroImage",
          value: result.heroImage,
          usageType: "BANNER",
          altText: data.heroImageAlt,
          isNewUpload: true,
        },
        { fieldName: "certificateUrl", value: result.certificateUrl, usageType: "DOCUMENT" },
        {
          fieldName: "ogImage",
          value: result.ogImage,
          usageType: "OTHER",
          altText: data.ogImageAlt,
          isNewUpload: true,
        },
        {
          fieldName: "image",
          value: result.image,
          usageType: "BANNER",
          altText: data.imageAlt,
          isNewUpload: true,
        },
      ],
      actorId
    );

    await bumpPublicCacheVersion("achievements");
    return result;
  },

  async update(id: string, data: UpdateAchievementPayload, actorId?: string | null) {
    const existing = await achievementRepository.findById(id);
    if (!existing) throw AppError.notFound("Achievement not found");

    if (data.slug && data.slug !== existing.slug) {
      const slugCollision = await achievementRepository.findBySlug(data.slug);
      if (slugCollision) {
        throw AppError.conflict(`An achievement with the slug '${data.slug}' already exists.`);
      }
    }

    const updateData: Prisma.AchievementUpdateInput = {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(data.issuer !== undefined ? { issuer: data.issuer } : {}),
      ...(data.achievedAt !== undefined ? { achievedAt: data.achievedAt ?? null } : {}),
      ...(data.shortDesc !== undefined ? { shortDesc: data.shortDesc ?? null } : {}),
      ...(data.type !== undefined ? { type: data.type } : {}),
      ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
      ...(data.cardImage !== undefined ? { cardImage: data.cardImage ?? null } : {}),
      ...(data.heroImage !== undefined ? { heroImage: data.heroImage ?? null } : {}),
      ...(data.certificateUrl !== undefined ? { certificateUrl: data.certificateUrl ?? null } : {}),
      ...(data.ogImage !== undefined ? { ogImage: data.ogImage ?? null } : {}),
      ...(data.contentJson !== undefined ? { contentJson: data.contentJson ?? null } : {}),
      ...(data.icon !== undefined ? { icon: data.icon ?? null } : {}),
      ...(data.image !== undefined ? { image: data.image ?? null } : {}),
      ...(data.order !== undefined ? { order: data.order } : {}),
      ...(data.status !== undefined
        ? {
            status: data.status,
            publishedAt:
              data.status === "PUBLISHED" && existing.status !== "PUBLISHED"
                ? new Date()
                : existing.status === "PUBLISHED"
                  ? existing.publishedAt
                  : null,
            archivedAt:
              data.status === "ARCHIVED" && existing.status !== "ARCHIVED" ? new Date() : undefined,
          }
        : {}),
    };

    if (actorId) {
      updateData.updatedBy = { connect: { id: actorId } };
    }

    const result = await achievementRepository.update(id, updateData);

    await syncMediaAttachments(
      "achievement",
      result.id,
      [
        {
          fieldName: "cardImage",
          value: result.cardImage,
          usageType: "GALLERY",
          altText: data.cardImageAlt,
          isNewUpload: data.cardImageAlt != null,
        },
        {
          fieldName: "heroImage",
          value: result.heroImage,
          usageType: "BANNER",
          altText: data.heroImageAlt,
          isNewUpload: data.heroImageAlt != null,
        },
        { fieldName: "certificateUrl", value: result.certificateUrl, usageType: "DOCUMENT" },
        {
          fieldName: "ogImage",
          value: result.ogImage,
          usageType: "OTHER",
          altText: data.ogImageAlt,
          isNewUpload: data.ogImageAlt != null,
        },
        {
          fieldName: "image",
          value: result.image,
          usageType: "BANNER",
          altText: data.imageAlt,
          isNewUpload: data.imageAlt != null,
        },
      ],
      actorId
    );

    await bumpPublicCacheVersion("achievements");
    return result;
  },

  async delete(id: string, actorId?: string | null) {
    const existing = await achievementRepository.findById(id);
    if (!existing) throw AppError.notFound("Achievement not found");
    const result = await achievementRepository.hardDelete(id);
    await bumpPublicCacheVersion("achievements");
    return result;
  },
};
