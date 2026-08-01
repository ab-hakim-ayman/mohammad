import I18n from "@/shared/components/I18n";

import { Prisma } from "@prisma/client";
import { skillRepository } from "../repositories/skill.repository";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { CreateSkillPayload, UpdateSkillPayload, SkillQueryValidated } from "../types/skill.types";

export const skillService = {
  async getAll(params: SkillQueryValidated) {
    return skillRepository.findAll(params);
  },
  async getById(id: string) {
    const skill = await skillRepository.findById(id);
    if (!skill) throw AppError.notFound("Skill not found");
    return skill;
  },
  async getPublished(category?: string, limit?: number) {
    return skillRepository.findPublished(category, limit);
  },
  async getCategories() {
    return skillRepository.findDistinctCategories();
  },
  async create(data: CreateSkillPayload, createdById?: string | null) {
    const createData: Prisma.SkillCreateInput = {
      title: data.title,
      shortDesc: data.shortDesc || null,
      icon: data.icon || null,
      order: data.order ?? 0,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
      createdBy: createdById ? { connect: { id: createdById } } : undefined,
      ...(data.categoryIds &&
        data.categoryIds.length > 0 && {
          categories: { connect: data.categoryIds.map((id) => ({ id })) },
        }),
      ...(data.tagIds &&
        data.tagIds.length > 0 && {
          tags: { connect: data.tagIds.map((id) => ({ id })) },
        }),
      ...(data.profileIds &&
        data.profileIds.length > 0 && {
          profiles: { connect: data.profileIds.map((id) => ({ id })) },
        }),
    };
    const result = await skillRepository.create(createData);
    await bumpPublicCacheVersion("skills");
    return result;
  },
  async update(id: string, data: UpdateSkillPayload, updatedById?: string | null) {
    const existing = await skillRepository.findById(id);
    if (!existing) throw AppError.notFound("Skill not found");
    const updateData: Prisma.SkillUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.shortDesc !== undefined) updateData.shortDesc = data.shortDesc || null;
    if (data.icon !== undefined) updateData.icon = data.icon || null;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.categoryIds !== undefined) {
      updateData.categories = { set: data.categoryIds.map((id) => ({ id })) };
    }
    if (data.tagIds !== undefined) {
      updateData.tags = { set: data.tagIds.map((id) => ({ id })) };
    }
    if (data.profileIds !== undefined) {
      updateData.profiles = { set: data.profileIds.map((id) => ({ id })) };
    }

    if (data.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      updateData.publishedAt = new Date();
    }
    if (
      data.status !== undefined &&
      data.status !== "PUBLISHED" &&
      existing.status === "PUBLISHED"
    ) {
      updateData.publishedAt = null;
    }
    if (data.status === "ARCHIVED" && existing.status !== "ARCHIVED") {
      updateData.archivedAt = new Date();
    }
    if (data.status !== "ARCHIVED" && existing.status === "ARCHIVED") {
      updateData.archivedAt = null;
    }
    if (updatedById) {
      updateData.updatedBy = { connect: { id: updatedById } };
    }
    const result = await skillRepository.update(id, updateData);
    await bumpPublicCacheVersion("skills");
    return result;
  },
  async delete(id: string, updatedById?: string | null) {
    const existing = await skillRepository.findById(id);
    if (!existing) throw AppError.notFound("Skill not found");
    const result = await skillRepository.hardDelete(id);
    await bumpPublicCacheVersion("skills");
    return result;
  },
};
