import I18n from "@/shared/components/I18n";

import { Prisma } from "@prisma/client";
import { specializationRepository } from "../repositories/specialization.repository";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import {
  CreateSpecializationPayload,
  UpdateSpecializationPayload,
  SpecializationQueryValidated,
} from "../types/specialization.types";

export const specializationService = {
  async getAll(params: SpecializationQueryValidated) {
    const result = await specializationRepository.findAll(params);
    return result;
  },
  async getById(id: string) {
    const specialization = await specializationRepository.findById(id);
    if (!specialization) throw AppError.notFound("Specialization not found");
    return specialization;
  },
  async getPublished() {
    const result = await specializationRepository.findPublished();
    return result;
  },
  async create(data: CreateSpecializationPayload, actorId?: string | null) {
    const createData: Prisma.SpecializationCreateInput = {
      title: data.title,
      slug: data.slug,
      shortDesc: data.shortDesc || null,
      contentJson:
        data.contentJson === null ? Prisma.DbNull : (data.contentJson as Prisma.InputJsonValue),
      icon: data.icon || null,
      cardImage: data.cardImage || null,
      heroImage: data.heroImage || null,
      heroVideoUrl: data.heroVideoUrl || null,
      galleryImages: data.galleryImages ?? [],
      demoVideoUrl: data.demoVideoUrl || null,
      ogImage: data.ogImage || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      status: data.status,
      isFeatured: data.isFeatured ?? false,
      order: data.order ?? 0,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
    };

    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }

    const result = await specializationRepository.create(createData);
    await syncMediaAttachments(
      "specialization",
      result.id,
      [
        {
          fieldName: "heroImage",
          value: result.heroImage,
          usageType: "BANNER",
          altText: data.heroImageAlt,
          isNewUpload: true,
        },
        {
          fieldName: "cardImage",
          value: result.cardImage,
          usageType: "THUMBNAIL",
          altText: data.cardImageAlt,
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
    await bumpPublicCacheVersion("specializations");
    return result;
  },
  async update(id: string, data: UpdateSpecializationPayload, actorId?: string | null) {
    const existing = await specializationRepository.findById(id);
    if (!existing) throw AppError.notFound("Specialization not found");
    const updateData: Prisma.SpecializationUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.shortDesc !== undefined) updateData.shortDesc = data.shortDesc || null;
    if (data.contentJson !== undefined) {
      updateData.contentJson =
        data.contentJson === null ? Prisma.DbNull : (data.contentJson as Prisma.InputJsonValue);
    }
    if (data.icon !== undefined) updateData.icon = data.icon || null;
    if (data.cardImage !== undefined) updateData.cardImage = data.cardImage || null;
    if (data.heroImage !== undefined) updateData.heroImage = data.heroImage || null;
    if (data.heroVideoUrl !== undefined) updateData.heroVideoUrl = data.heroVideoUrl || null;
    if (data.galleryImages !== undefined) updateData.galleryImages = data.galleryImages ?? [];
    if (data.demoVideoUrl !== undefined) updateData.demoVideoUrl = data.demoVideoUrl || null;
    if (data.ogImage !== undefined) updateData.ogImage = data.ogImage || null;
    if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle || null;
    if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription || null;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.order !== undefined) updateData.order = data.order;

    if (actorId) {
      updateData.updatedBy = { connect: { id: actorId } };
    }

    if (data.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      updateData.publishedAt = new Date();
    }
    if (data.status === "ARCHIVED" && existing.status !== "ARCHIVED") {
      updateData.archivedAt = new Date();
    }
    if (data.status !== "ARCHIVED" && existing.status === "ARCHIVED") {
      updateData.archivedAt = null;
    }
    const result = await specializationRepository.update(id, updateData);
    await syncMediaAttachments(
      "specialization",
      result.id,
      [
        {
          fieldName: "heroImage",
          value: result.heroImage,
          usageType: "BANNER",
          altText: data.heroImageAlt,
          isNewUpload: data.heroImageAlt != null,
        },
        {
          fieldName: "cardImage",
          value: result.cardImage,
          usageType: "THUMBNAIL",
          altText: data.cardImageAlt,
          isNewUpload: data.cardImageAlt != null,
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
    await bumpPublicCacheVersion("specializations");
    return result;
  },
  async delete(id: string, actorId?: string | null) {
    const existing = await specializationRepository.findById(id);
    if (!existing) throw AppError.notFound("Specialization not found");
    const result = await specializationRepository.hardDelete(id);
    await bumpPublicCacheVersion("specializations");
    return result;
  },
};
