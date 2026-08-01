import { Prisma } from "@prisma/client";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import { experienceRepository } from "../repositories/experience.repository";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { CreateExperiencePayload, UpdateExperiencePayload, ExperienceQueryValidated } from "../types/experience.types";

export const experienceService = {
  async getAll(params: ExperienceQueryValidated) {
    return experienceRepository.findAll(params);
  },

  async getById(id: string) {
    const experience = await experienceRepository.findById(id);
    if (!experience) throw AppError.notFound("Experience not found");
    return experience;
  },

  async getPublicById(id: string) {
    const experience = await experienceRepository.findPublicById(id);
    if (!experience) throw AppError.notFound("Experience not found or not available");
    return experience;
  },

  async getPublished(params: { page?: number; limit?: number; search?: string }) {
    return experienceRepository.findPublished(params);
  },

  async create(data: CreateExperiencePayload, actorId?: string | null) {
    const createData: Prisma.ExperienceCreateInput = {
      companyName: data.companyName,
      companyUrl: data.companyUrl || null,
      position: data.position,
      employmentType: data.employmentType,
      location: data.location || null,
      locationType: data.locationType || null,
      startDate: data.startDate,
      endDate: data.endDate || null,
      isCurrent: data.isCurrent,
      shortDesc: data.shortDesc || null,
      contentJson: data.contentJson === null ? Prisma.DbNull : (data.contentJson as Prisma.InputJsonValue),
      logo: data.logo || null,
      cardImage: data.cardImage || null,
      ogImage: data.ogImage || null,
      status: data.status,
      isFeatured: data.isFeatured,
      order: data.order,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
    };

    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }

    const result = await experienceRepository.create(createData, data.projects, data.technologies);

    await syncMediaAttachments(
      "experience",
      result.id,
      [
        {
          fieldName: "logo",
          value: result.logo,
          usageType: "LOGO",
          altText: data.logoAlt,
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
      ],
      actorId
    );

    await bumpPublicCacheVersion("experiences");
    return result;
  },

  async update(id: string, data: UpdateExperiencePayload, actorId?: string | null) {
    const existing = await experienceRepository.findById(id);
    if (!existing) throw AppError.notFound("Experience not found");

    const updateData: Prisma.ExperienceUpdateInput = {
      ...(data.companyName !== undefined && { companyName: data.companyName }),
      ...(data.companyUrl !== undefined && { companyUrl: data.companyUrl }),
      ...(data.position !== undefined && { position: data.position }),
      ...(data.employmentType !== undefined && { employmentType: data.employmentType }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.locationType !== undefined && { locationType: data.locationType }),
      ...(data.startDate !== undefined && { startDate: data.startDate }),
      ...(data.endDate !== undefined && { endDate: data.endDate }),
      ...(data.isCurrent !== undefined && { isCurrent: data.isCurrent }),
      ...(data.shortDesc !== undefined && { shortDesc: data.shortDesc }),
      ...(data.contentJson !== undefined
        ? {
            contentJson:
              data.contentJson === null
                ? Prisma.DbNull
                : (data.contentJson as Prisma.InputJsonValue),
          }
        : {}),
      ...(data.logo !== undefined && { logo: data.logo }),
      ...(data.cardImage !== undefined && { cardImage: data.cardImage }),
      ...(data.ogImage !== undefined && { ogImage: data.ogImage }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
      ...(data.order !== undefined && { order: data.order }),
    };

    if (actorId) {
      updateData.updatedBy = { connect: { id: actorId } };
    }

    if (data.status && data.status !== existing.status) {
      if (data.status === "PUBLISHED") updateData.publishedAt = new Date();
      if (data.status === "ARCHIVED") updateData.archivedAt = new Date();
    }

    const result = await experienceRepository.update(id, updateData, data.projects, data.technologies);

    await syncMediaAttachments(
      "experience",
      result.id,
      [
        {
          fieldName: "logo",
          value: result.logo,
          usageType: "LOGO",
          altText: data.logoAlt,
          isNewUpload: data.logoAlt != null,
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
      ],
      actorId
    );

    await bumpPublicCacheVersion("experiences");
    return result;
  },

  async delete(id: string, actorId?: string | null) {
    const existing = await experienceRepository.findById(id);
    if (!existing) throw AppError.notFound("Experience not found");
    const result = await experienceRepository.hardDelete(id);
    await bumpPublicCacheVersion("experiences");
    return result;
  },
};
