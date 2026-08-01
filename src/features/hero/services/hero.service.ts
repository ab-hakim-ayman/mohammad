import I18n from "@/shared/components/I18n";

import { Prisma } from "@prisma/client";
import { heroRepository } from "../repositories/hero.repository";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import { CreateHeroPayload, UpdateHeroPayload, HeroQueryValidated } from "../types/hero.types";

export const heroService = {
  async getAll(params: HeroQueryValidated) {
    return heroRepository.findAll(params);
  },

  async getById(id: string) {
    const hero = await heroRepository.findById(id);
    if (!hero) throw AppError.notFound("Hero not found");
    return hero;
  },

  async getActive() {
    const hero = await heroRepository.findActive();
    if (!hero) throw AppError.notFound("No active hero section");
    return hero;
  },

  async create(data: CreateHeroPayload, actorId?: string | null) {
    const createData: Prisma.HeroCreateInput = {
      title: data.title,
      shortDesc: data.shortDesc ?? null,
      heroImage: data.heroImage ?? null,
      heroVideoUrl: data.heroVideoUrl ?? null,
      ctaText: data.ctaText ?? null,
      ctaLink: data.ctaLink ?? null,
      secondaryCtaText: data.secondaryCtaText ?? null,
      secondaryCtaLink: data.secondaryCtaLink ?? null,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
      isActive: data.isActive,
      order: data.order ?? 0,
    };
    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }

    const result = await heroRepository.create(createData);
    await syncMediaAttachments(
      "hero",
      result.id,
      [
        {
          fieldName: "heroImage",
          value: result.heroImage,
          usageType: "BANNER",
          altText: data.heroImageAlt,
          isNewUpload: true,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("heroes");
    return result;
  },

  async update(id: string, data: UpdateHeroPayload, actorId?: string | null) {
    const existing = await heroRepository.findById(id);
    if (!existing) throw AppError.notFound("Hero not found");
    const updateData: Prisma.HeroUpdateInput = {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.shortDesc !== undefined ? { shortDesc: data.shortDesc ?? null } : {}),
      ...(data.heroImage !== undefined ? { heroImage: data.heroImage ?? null } : {}),
      ...(data.heroVideoUrl !== undefined ? { heroVideoUrl: data.heroVideoUrl ?? null } : {}),
      ...(data.ctaText !== undefined ? { ctaText: data.ctaText ?? null } : {}),
      ...(data.ctaLink !== undefined ? { ctaLink: data.ctaLink ?? null } : {}),
      ...(data.secondaryCtaText !== undefined
        ? { secondaryCtaText: data.secondaryCtaText ?? null }
        : {}),
      ...(data.secondaryCtaLink !== undefined
        ? { secondaryCtaLink: data.secondaryCtaLink ?? null }
        : {}),
      ...(data.order !== undefined ? { order: data.order } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
    };
    if (actorId) {
      updateData.updatedBy = { connect: { id: actorId } };
    }
    if (data.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      updateData.publishedAt = new Date();
    }
    if (data.status === "ARCHIVED" && existing.status !== "ARCHIVED") {
      updateData.archivedAt = new Date();
    }
    if (data.status && data.status !== "ARCHIVED" && existing.status === "ARCHIVED") {
      updateData.archivedAt = null;
    }

    const result = await heroRepository.update(id, updateData);
    await syncMediaAttachments(
      "hero",
      result.id,
      [
        {
          fieldName: "heroImage",
          value: result.heroImage,
          usageType: "BANNER",
          altText: data.heroImageAlt,
          isNewUpload: data.heroImageAlt != null,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("heroes");
    return result;
  },

  async delete(id: string, actorId?: string | null) {
    const existing = await heroRepository.findById(id);
    if (!existing) throw AppError.notFound("Hero not found");
    const result = await heroRepository.hardDelete(id);
    await bumpPublicCacheVersion("heroes");
    return result;
  },
};
