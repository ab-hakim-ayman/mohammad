import I18n from "@/shared/components/I18n";

import { Prisma } from "@prisma/client";
import { technologyRepository } from "../repositories/technology.repository";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import {
  CreateTechnologyPayload,
  UpdateTechnologyPayload,
  TechnologyQueryValidated,
} from "../types/technology.types";

export const technologyService = {
  async getAll(params: TechnologyQueryValidated) {
    return technologyRepository.findAll(params);
  },
  async getById(id: string) {
    const technology = await technologyRepository.findById(id);
    if (!technology) throw AppError.notFound("Technology not found");
    return technology;
  },
  async getPublished(category?: string, limit?: number) {
    return technologyRepository.findPublished(category, limit);
  },
  async create(data: CreateTechnologyPayload, actorId?: string | null) {
    const createData: Prisma.TechnologyCreateInput = {
      title: data.title,
      shortDesc: data.shortDesc || null,
      logo: data.logo || null,
      order: data.order ?? 0,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
      createdBy: actorId ? { connect: { id: actorId } } : undefined,
      ...(data.categoryIds &&
        data.categoryIds.length > 0 && {
          categories: { connect: data.categoryIds.map((id) => ({ id })) },
        }),
      ...(data.tagIds &&
        data.tagIds.length > 0 && {
          tags: { connect: data.tagIds.map((id) => ({ id })) },
        }),
      ...(data.projectIds &&
        data.projectIds.length > 0 && {
          projects: { connect: data.projectIds.map((id) => ({ id })) },
        }),
      ...(data.serviceIds &&
        data.serviceIds.length > 0 && {
          services: { connect: data.serviceIds.map((id) => ({ id })) },
        }),
    };
    const result = await technologyRepository.create(createData);
    await syncMediaAttachments(
      "technology",
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
    await bumpPublicCacheVersion("technologies");
    return result;
  },
  async update(id: string, data: UpdateTechnologyPayload, actorId?: string | null) {
    const existing = await technologyRepository.findById(id);
    if (!existing) throw AppError.notFound("Technology not found");
    const updateData: Prisma.TechnologyUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.shortDesc !== undefined) updateData.shortDesc = data.shortDesc || null;
    if (data.logo !== undefined) updateData.logo = data.logo || null;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.categoryIds !== undefined) {
      updateData.categories = { set: data.categoryIds.map((id) => ({ id })) };
    }
    if (data.tagIds !== undefined) {
      updateData.tags = { set: data.tagIds.map((id) => ({ id })) };
    }
    if (data.projectIds !== undefined) {
      updateData.projects = { set: data.projectIds.map((id) => ({ id })) };
    }
    if (data.serviceIds !== undefined) {
      updateData.services = { set: data.serviceIds.map((id) => ({ id })) };
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
    if (actorId) {
      updateData.updatedBy = { connect: { id: actorId } };
    }
    const result = await technologyRepository.update(id, updateData);
    await syncMediaAttachments(
      "technology",
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
    await bumpPublicCacheVersion("technologies");
    return result;
  },
  async delete(id: string, actorId?: string | null) {
    const existing = await technologyRepository.findById(id);
    if (!existing) throw AppError.notFound("Technology not found");
    const result = await technologyRepository.hardDelete(id);
    await bumpPublicCacheVersion("technologies");
    return result;
  },
};
