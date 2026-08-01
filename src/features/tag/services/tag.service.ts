import I18n from "@/shared/components/I18n";

import { Prisma } from "@prisma/client";
import { tagRepository } from "../repositories/tag.repository";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { CreateTagPayload, UpdateTagPayload, TagQueryValidated } from "../types/tag.types";

export const tagService = {
  async getAll(params: TagQueryValidated) {
    return tagRepository.findAll(params);
  },
  async getById(id: string) {
    const tag = await tagRepository.findById(id);
    if (!tag) throw AppError.notFound("Tag not found");
    return tag;
  },
  async getPublicBySlug(slug: string) {
    const tag = await tagRepository.findBySlug(slug);
    if (!tag) throw AppError.notFound("Tag not found");
    if (tag.status !== "PUBLISHED") {
      throw AppError.notFound("Tag not available");
    }
    return tag;
  },
  async getPublished(limit?: number) {
    return tagRepository.findPublished(limit);
  },
  async create(data: CreateTagPayload, createdById?: string | null) {
    const existingByName = await tagRepository.findByName(data.title);
    if (existingByName && existingByName.status !== "ARCHIVED") {
      throw AppError.conflict(`Tag with name"${data.title}" already exists`);
    }
    const existingBySlug = await tagRepository.findBySlug(data.slug);
    if (existingBySlug && existingBySlug.status !== "ARCHIVED") {
      throw AppError.conflict(`Tag with slug"${data.slug}" already exists`);
    }
    const createData: Prisma.TagCreateInput = {
      title: data.title,
      slug: data.slug,
      shortDesc: data.shortDesc || null,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
      createdBy: createdById ? { connect: { id: createdById } } : undefined,
      updatedBy: createdById ? { connect: { id: createdById } } : undefined,
    };
    const result = await tagRepository.create(createData);
    await bumpPublicCacheVersion("tags");
    return result;
  },
  async update(id: string, data: UpdateTagPayload, updatedById?: string | null) {
    const existing = await tagRepository.findById(id);
    if (!existing) throw AppError.notFound("Tag not found");
    if (data.title && data.title !== existing.title) {
      const nameExists = await tagRepository.findByName(data.title);
      if (nameExists && nameExists.status !== "ARCHIVED") {
        throw AppError.conflict(`Tag with name"${data.title}" already exists`);
      }
    }
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await tagRepository.findBySlug(data.slug);
      if (slugExists && slugExists.status !== "ARCHIVED") {
        throw AppError.conflict(`Tag with slug"${data.slug}" already exists`);
      }
    }
    const updateData: Prisma.TagUpdateInput = {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(data.shortDesc !== undefined ? { shortDesc: data.shortDesc || null } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
    };

    if (data.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      updateData.publishedAt = new Date();
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
    const result = await tagRepository.update(id, updateData);
    await bumpPublicCacheVersion("tags");
    return result;
  },
  async delete(id: string, updatedById?: string | null) {
    const existing = await tagRepository.findById(id);
    if (!existing) throw AppError.notFound("Tag not found");
    const result = await tagRepository.hardDelete(id);
    await bumpPublicCacheVersion("tags");
    return result;
  },
};
