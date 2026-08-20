import { Prisma } from "@prisma/client";
import { toolRepository } from "../repositories/tool.repository";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import type {
  CreateToolPayload,
  UpdateToolPayload,
  ToolQueryValidated,
} from "../types/tool.types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const toolService = {
  async getAll(params: ToolQueryValidated) {
    return toolRepository.findAll(params);
  },

  async getById(id: string) {
    const tool = await toolRepository.findById(id);
    if (!tool) throw AppError.notFound("Tool not found");
    return tool;
  },

  async getBySlug(slug: string) {
    const tool = await toolRepository.findBySlug(slug);
    if (!tool) throw AppError.notFound("Tool not found");
    return tool;
  },

  async getPublished(params?: { category?: string; featured?: boolean; limit?: number; search?: string }) {
    return toolRepository.findPublished(params);
  },

  async create(data: CreateToolPayload, actorId?: string | null) {
    const baseSlug = data.slug && data.slug.trim() !== "" ? slugify(data.slug) : slugify(data.title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await toolRepository.findBySlug(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const createData: Prisma.ToolCreateInput = {
      title: data.title,
      slug: finalSlug,
      shortDesc: data.shortDesc || null,
      category: data.category || "DEVELOPER",
      icon: data.icon || null,
      engineType: data.engineType || "SCHEMA",
      actionKey: data.actionKey || null,
      componentKey: data.componentKey || null,

      cardImage: data.cardImage || null,
      heroImage: data.heroImage || null,
      heroVideoUrl: data.heroVideoUrl || null,
      galleryImages: data.galleryImages || [],
      demoVideoUrl: data.demoVideoUrl || null,
      ogImage: data.ogImage || null,

      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,

      order: data.order ?? 0,
      status: data.status,
      isFeatured: data.isFeatured ?? false,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
      createdBy: actorId ? { connect: { id: actorId } } : undefined,
    };

    const result = await toolRepository.create(createData);

    await syncMediaAttachments(
      "TOOL",
      result.id,
      [
        { fieldName: "icon", value: result.icon, usageType: "LOGO" },
        { fieldName: "cardImage", value: result.cardImage, usageType: "CARD" },
        { fieldName: "heroImage", value: result.heroImage, usageType: "HERO" },
        { fieldName: "ogImage", value: result.ogImage, usageType: "OG_IMAGE" },
      ],
      actorId
    );

    await bumpPublicCacheVersion("tools");
    return result;
  },

  async update(id: string, data: UpdateToolPayload, actorId?: string | null) {
    const existing = await toolRepository.findById(id);
    if (!existing) throw AppError.notFound("Tool not found");

    const updateData: Prisma.ToolUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.shortDesc !== undefined) updateData.shortDesc = data.shortDesc || null;
    if (data.category !== undefined) updateData.category = data.category || "DEVELOPER";
    if (data.icon !== undefined) updateData.icon = data.icon || null;
    if (data.engineType !== undefined) updateData.engineType = data.engineType;
    if (data.actionKey !== undefined) updateData.actionKey = data.actionKey || null;
    if (data.componentKey !== undefined) updateData.componentKey = data.componentKey || null;

    if (data.cardImage !== undefined) updateData.cardImage = data.cardImage || null;
    if (data.heroImage !== undefined) updateData.heroImage = data.heroImage || null;
    if (data.heroVideoUrl !== undefined) updateData.heroVideoUrl = data.heroVideoUrl || null;
    if (data.galleryImages !== undefined) updateData.galleryImages = data.galleryImages;
    if (data.demoVideoUrl !== undefined) updateData.demoVideoUrl = data.demoVideoUrl || null;
    if (data.ogImage !== undefined) updateData.ogImage = data.ogImage || null;

    if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle || null;
    if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription || null;

    if (data.order !== undefined) updateData.order = data.order;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;

    if (data.slug !== undefined && data.slug && data.slug !== existing.slug) {
      let finalSlug = slugify(data.slug);
      let counter = 1;
      let existingSlugTool = await toolRepository.findBySlug(finalSlug);
      while (existingSlugTool && existingSlugTool.id !== id) {
        finalSlug = `${slugify(data.slug)}-${counter}`;
        counter++;
        existingSlugTool = await toolRepository.findBySlug(finalSlug);
      }
      updateData.slug = finalSlug;
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

    const result = await toolRepository.update(id, updateData);

    await syncMediaAttachments(
      "TOOL",
      result.id,
      [
        { fieldName: "icon", value: result.icon, usageType: "LOGO" },
        { fieldName: "cardImage", value: result.cardImage, usageType: "CARD" },
        { fieldName: "heroImage", value: result.heroImage, usageType: "HERO" },
        { fieldName: "ogImage", value: result.ogImage, usageType: "OG_IMAGE" },
      ],
      actorId
    );

    await bumpPublicCacheVersion("tools");
    return result;
  },

  async delete(id: string, actorId?: string | null) {
    const existing = await toolRepository.findById(id);
    if (!existing) throw AppError.notFound("Tool not found");
    const result = await toolRepository.hardDelete(id);
    await bumpPublicCacheVersion("tools");
    return result;
  },
};
