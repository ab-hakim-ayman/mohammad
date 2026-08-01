import I18n from "@/shared/components/I18n";

import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { categoryRepository } from "../repositories/category.repository";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import {
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CategoryQueryValidated,
} from "../types/category.types";

export const categoryService = {
  async getAll(params: CategoryQueryValidated) {
    return categoryRepository.findAll(params);
  },
  async getById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) throw AppError.notFound("Category not found");
    return category;
  },
  async getBySlug(slug: string) {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) throw AppError.notFound("Category not found");
    if (category.status !== "PUBLISHED") {
      throw AppError.notFound("Category not available");
    }
    return category;
  },
  async getPublished(limit?: number) {
    return categoryRepository.findPublished(limit);
  },
  async create(data: CreateCategoryPayload, actorId?: string | null) {
    const titleExists = await prisma.category.findFirst({
      where: { title: data.title, scope: data.scope, status: { not: "ARCHIVED" } },
    });
    if (titleExists) {
      throw AppError.conflict(`Category with title "${data.title}" already exists in this scope`);
    }
    const slugExists = await prisma.category.findFirst({
      where: { slug: data.slug, scope: data.scope, status: { not: "ARCHIVED" } },
    });
    if (slugExists) {
      throw AppError.conflict(`Category with slug "${data.slug}" already exists in this scope`);
    }
    const createData: Prisma.CategoryCreateInput = {
      title: data.title,
      slug: data.slug,
      shortDesc: data.shortDesc || null,
      order: data.order,
      status: data.status,
      scope: data.scope,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
    };
    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }
    const result = await categoryRepository.create(createData);
    await bumpPublicCacheVersion("categories");
    return result;
  },
  async update(id: string, data: UpdateCategoryPayload, actorId?: string | null) {
    const existing = await categoryRepository.findById(id);
    if (!existing) throw AppError.notFound("Category not found");
    const scope = data.scope ?? existing.scope;
    if (data.title && data.title !== existing.title) {
      const titleExists = await prisma.category.findFirst({
        where: { title: data.title, scope, status: { not: "ARCHIVED" }, id: { not: id } },
      });
      if (titleExists) {
        throw AppError.conflict(`Category with title "${data.title}" already exists in this scope`);
      }
    }
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await prisma.category.findFirst({
        where: { slug: data.slug, scope, status: { not: "ARCHIVED" }, id: { not: id } },
      });
      if (slugExists) {
        throw AppError.conflict(`Category with slug "${data.slug}" already exists in this scope`);
      }
    }
    const updateData: Prisma.CategoryUpdateInput = {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(data.shortDesc !== undefined ? { shortDesc: data.shortDesc || null } : {}),
      ...(data.order !== undefined ? { order: data.order } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.scope !== undefined ? { scope: data.scope } : {}),
    };
    if (data.status && data.status !== existing.status) {
      if (data.status === "PUBLISHED") updateData.publishedAt = new Date();
      if (data.status === "ARCHIVED") updateData.archivedAt = new Date();
      if (data.status !== "PUBLISHED" && data.status !== "ARCHIVED") updateData.publishedAt = null;
    }
    if (actorId) {
      updateData.updatedBy = { connect: { id: actorId } };
    }
    const result = await categoryRepository.update(id, updateData);
    await bumpPublicCacheVersion("categories");
    return result;
  },
  async delete(id: string, actorId?: string | null) {
    const existing = await categoryRepository.findById(id);
    if (!existing) throw AppError.notFound("Category not found");
    const result = await categoryRepository.hardDelete(id);
    await bumpPublicCacheVersion("categories");
    return result;
  },
};
