import { Prisma } from "@prisma/client";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import { educationRepository } from "../repositories/education.repository";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { CreateEducationPayload, UpdateEducationPayload, EducationQueryValidated } from "../types/education.types";

export const educationService = {
  async getAll(params: EducationQueryValidated) {
    return educationRepository.findAll(params);
  },

  async getById(id: string) {
    const education = await educationRepository.findById(id);
    if (!education) throw AppError.notFound("Education not found");
    return education;
  },

  async getPublicById(id: string) {
    const education = await educationRepository.findPublicById(id);
    if (!education) throw AppError.notFound("Education not found or not available");
    return education;
  },

  async getPublished(params: { page?: number; limit?: number; search?: string }) {
    return educationRepository.findPublished(params);
  },

  async create(data: CreateEducationPayload, actorId?: string | null) {
    const createData: Prisma.EducationCreateInput = {
      institution: data.institution,
      institutionUrl: data.institutionUrl || null,
      degree: data.degree,
      fieldOfStudy: data.fieldOfStudy || null,
      grade: data.grade || null,
      startDate: data.startDate,
      endDate: data.endDate || null,
      isCurrent: data.isCurrent,
      shortDesc: data.shortDesc || null,
      contentJson: data.contentJson === null ? Prisma.DbNull : (data.contentJson as Prisma.InputJsonValue),
      logo: data.logo || null,
      certificateUrl: data.certificateUrl || null,
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

    const result = await educationRepository.create(createData);

    await syncMediaAttachments(
      "education",
      result.id,
      [
        {
          fieldName: "logo",
          value: result.logo,
          usageType: "LOGO",
          altText: data.logoAlt,
          isNewUpload: true,
        },
      ],
      actorId
    );

    await bumpPublicCacheVersion("educations");
    return result;
  },

  async update(id: string, data: UpdateEducationPayload, actorId?: string | null) {
    const existing = await educationRepository.findById(id);
    if (!existing) throw AppError.notFound("Education not found");

    const updateData: Prisma.EducationUpdateInput = {
      ...(data.institution !== undefined && { institution: data.institution }),
      ...(data.institutionUrl !== undefined && { institutionUrl: data.institutionUrl }),
      ...(data.degree !== undefined && { degree: data.degree }),
      ...(data.fieldOfStudy !== undefined && { fieldOfStudy: data.fieldOfStudy }),
      ...(data.grade !== undefined && { grade: data.grade }),
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
      ...(data.certificateUrl !== undefined && { certificateUrl: data.certificateUrl }),
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

    const result = await educationRepository.update(id, updateData);

    await syncMediaAttachments(
      "education",
      result.id,
      [
        {
          fieldName: "logo",
          value: result.logo,
          usageType: "LOGO",
          altText: data.logoAlt,
          isNewUpload: data.logoAlt != null,
        },
      ],
      actorId
    );

    await bumpPublicCacheVersion("educations");
    return result;
  },

  async delete(id: string, actorId?: string | null) {
    const existing = await educationRepository.findById(id);
    if (!existing) throw AppError.notFound("Education not found");
    const result = await educationRepository.hardDelete(id);
    await bumpPublicCacheVersion("educations");
    return result;
  },
};
