import I18n from "@/shared/components/I18n";

import { Prisma } from "@prisma/client";
import { aboutRepository } from "../repositories/about.repository";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import { enrichEntitiesWithAltText } from "@/features/media/utils/enrich-entities";
import { CreateAboutPayload, UpdateAboutPayload, AboutQueryValidated } from "../types/about.types";

export const aboutService = {
  async getCurrent() {
    const about = await aboutRepository.findByKey("main");
    if (!about) return null;
    const [enriched] = await enrichEntitiesWithAltText("about", [about] as any[], {
      heroImage: "heroImage",
      ogImage: "ogImage",
    });
    return enriched;
  },

  async save(data: CreateAboutPayload, actorId?: string | null) {
    const existing = await aboutRepository.findByKey("main");
    if (existing) {
      return this.update(existing.id, data, actorId);
    }
    return this.create({ ...data, key: "main" }, actorId);
  },

  async getPublished(key: string = "main") {
    const about = await aboutRepository.findPublished(key);
    if (!about) throw AppError.notFound(`No published about section found for key: ${key}`);
    return about;
  },

  async create(data: CreateAboutPayload, actorId?: string | null) {
    const key = data.key || "main";

    const existing = await aboutRepository.findByKey(key);
    if (existing) {
      throw AppError.conflict(`An about section with the key '${key}' already exists.`);
    }

    const createData: Prisma.AboutCreateInput = {
      key,
      title: data.title,
      shortDesc: data.shortDesc || null,
      contentJson: data.contentJson || null,
      heroImage: data.heroImage || null,
      ogImage: data.ogImage || null,
      galleryImages: data.galleryImages || [],
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
    };

    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }

    const result = await aboutRepository.create(createData);

    await syncMediaAttachments(
      "about",
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
          altTexts: data.galleryImagesAltTexts,
          isNewUpload: true,
        },
      ],
      actorId
    );

    await bumpPublicCacheVersion("abouts");
    return result;
  },

  async update(id: string, data: UpdateAboutPayload, actorId?: string | null) {
    const existing = await aboutRepository.findById(id);
    if (!existing) throw AppError.notFound("About section not found");

    const updateData: Prisma.AboutUpdateInput = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.shortDesc !== undefined) updateData.shortDesc = data.shortDesc || null;
    if (data.contentJson !== undefined) updateData.contentJson = data.contentJson || null;
    if (data.heroImage !== undefined) updateData.heroImage = data.heroImage || null;
    if (data.ogImage !== undefined) updateData.ogImage = data.ogImage || null;
    if (data.galleryImages !== undefined) updateData.galleryImages = data.galleryImages || [];
    if (data.status !== undefined) updateData.status = data.status;

    if (actorId) {
      updateData.updatedBy = { connect: { id: actorId } };
    }

    if (data.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      updateData.publishedAt = new Date();
    }
    if (data.status === "ARCHIVED" && existing.status !== "ARCHIVED") {
      updateData.archivedAt = new Date();
    }

    const result = await aboutRepository.update(id, updateData);

    await syncMediaAttachments(
      "about",
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
          altTexts: data.galleryImagesAltTexts,
          isNewUpload: data.galleryImagesAltTexts != null,
        },
      ],
      actorId
    );

    await bumpPublicCacheVersion("abouts");
    return result;
  },
};
