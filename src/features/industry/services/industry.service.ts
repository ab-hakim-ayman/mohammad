import I18n from "@/shared/components/I18n";

import { Prisma } from "@prisma/client";
import { industryRepository } from "../repositories/industry.repository";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import {
  CreateIndustryPayload,
  UpdateIndustryPayload,
  IndustryQueryValidated,
} from "../types/industry.types";

export const industryService = {
  async getAll(params: IndustryQueryValidated) {
    return industryRepository.findAll(params);
  },
  async getById(id: string) {
    const industry = await industryRepository.findById(id);
    if (!industry) throw AppError.notFound("Industry not found");
    return industry;
  },
  async getBySlug(slug: string) {
    const industry = await industryRepository.findBySlug(slug);
    if (!industry) throw AppError.notFound("Industry not found");
    return industry;
  },
  async getPublicBySlug(slug: string) {
    const industry = await industryRepository.findPublicBySlug(slug);
    if (!industry) throw AppError.notFound("Industry not found or not available");
    return industry;
  },
  async getPublished(limit?: number) {
    return industryRepository.findPublished(limit);
  },
  async create(data: CreateIndustryPayload, actorId?: string | null) {
    const existingByName = await industryRepository.findByTitle(data.title);
    if (existingByName && existingByName.status !== "ARCHIVED") {
      throw AppError.conflict(`Industry with name "${data.title}" already exists`);
    }
    const existingBySlug = await industryRepository.findBySlug(data.slug);
    if (existingBySlug && existingBySlug.status !== "ARCHIVED") {
      throw AppError.conflict(`Industry with slug "${data.slug}" already exists`);
    }
    const createData: Prisma.IndustryCreateInput = {
      title: data.title,
      slug: data.slug,
      shortDesc: data.shortDesc ?? null,
      contentJson:
        data.contentJson === null ? Prisma.DbNull : (data.contentJson as Prisma.InputJsonValue),
      icon: data.icon ?? null,
      cardImage: data.cardImage ?? null,
      heroImage: data.heroImage ?? null,
      heroVideoUrl: data.heroVideoUrl ?? null,
      galleryImages: data.galleryImages ?? [],
      demoVideoUrl: data.demoVideoUrl ?? null,
      ogImage: data.ogImage ?? null,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      order: data.order,
      status: data.status,
      isFeatured: data.isFeatured,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
    };
    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }
    const result = await industryRepository.create(createData);
    await syncMediaAttachments(
      "industry",
      result.id,
      [
        {
          fieldName: "cardImage",
          value: result.cardImage,
          usageType: "THUMBNAIL",
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
        {
          fieldName: "ogImage",
          value: result.ogImage,
          usageType: "OTHER",
          altText: data.ogImageAlt,
          isNewUpload: true,
        },
        {
          fieldName: "galleryImages",
          value: result.galleryImages,
          usageType: "GALLERY",
          altTexts: data.galleryImagesAltTexts ?? undefined,
          isNewUpload: true,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("industries");
    return result;
  },
  async update(id: string, data: UpdateIndustryPayload, actorId?: string | null) {
    const existing = await industryRepository.findById(id);
    if (!existing) throw AppError.notFound("Industry not found");
    if (data.title && data.title !== existing.title) {
      const nameExists = await industryRepository.findByTitle(data.title);
      if (nameExists && nameExists.status !== "ARCHIVED") {
        throw AppError.conflict(`Industry with name "${data.title}" already exists`);
      }
    }
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await industryRepository.findBySlug(data.slug);
      if (slugExists && slugExists.status !== "ARCHIVED") {
        throw AppError.conflict(`Industry with slug "${data.slug}" already exists`);
      }
    }
    const updateData: Prisma.IndustryUpdateInput = {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(data.shortDesc !== undefined ? { shortDesc: data.shortDesc ?? null } : {}),
      ...(data.contentJson !== undefined
        ? {
            contentJson:
              data.contentJson === null
                ? Prisma.DbNull
                : (data.contentJson as Prisma.InputJsonValue),
          }
        : {}),
      ...(data.icon !== undefined ? { icon: data.icon ?? null } : {}),
      ...(data.cardImage !== undefined ? { cardImage: data.cardImage ?? null } : {}),
      ...(data.heroImage !== undefined ? { heroImage: data.heroImage ?? null } : {}),
      ...(data.heroVideoUrl !== undefined ? { heroVideoUrl: data.heroVideoUrl ?? null } : {}),
      ...(data.galleryImages !== undefined ? { galleryImages: data.galleryImages ?? [] } : {}),
      ...(data.demoVideoUrl !== undefined ? { demoVideoUrl: data.demoVideoUrl ?? null } : {}),
      ...(data.ogImage !== undefined ? { ogImage: data.ogImage ?? null } : {}),
      ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle ?? null } : {}),
      ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription ?? null } : {}),
      ...(data.order !== undefined ? { order: data.order } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
    };
    if (data.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      updateData.publishedAt = new Date();
    }
    if (data.status === "ARCHIVED" && existing.status !== "ARCHIVED") {
      updateData.archivedAt = new Date();
    }
    if (data.status && data.status !== "ARCHIVED" && existing.status === "ARCHIVED") {
      updateData.archivedAt = null;
    }
    if (actorId) {
      updateData.updatedBy = { connect: { id: actorId } };
    }
    const result = await industryRepository.update(id, updateData);
    await syncMediaAttachments(
      "industry",
      result.id,
      [
        {
          fieldName: "cardImage",
          value: result.cardImage,
          usageType: "THUMBNAIL",
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
        {
          fieldName: "ogImage",
          value: result.ogImage,
          usageType: "OTHER",
          altText: data.ogImageAlt,
          isNewUpload: data.ogImageAlt != null,
        },
        {
          fieldName: "galleryImages",
          value: result.galleryImages,
          usageType: "GALLERY",
          altTexts: data.galleryImagesAltTexts ?? undefined,
          isNewUpload: data.galleryImagesAltTexts != null,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("industries");
    return result;
  },
  async delete(id: string, actorId?: string | null) {
    const existing = await industryRepository.findById(id);
    if (!existing) throw AppError.notFound("Industry not found");
    const result = await industryRepository.hardDelete(id);
    await bumpPublicCacheVersion("industries");
    return result;
  },
};
