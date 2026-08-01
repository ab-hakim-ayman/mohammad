import I18n from "@/shared/components/I18n";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import { mediaRepository } from "@/features/media/server";
import { galleryRepository } from "../repositories/gallery.repository";
import {
  CreateGalleryPayload,
  UpdateGalleryPayload,
  CreateGalleryItemPayload,
  UpdateGalleryItemPayload,
  GalleryQueryValidated,
} from "../types/gallery.types";

export const galleryService = {
  async getAll(params: GalleryQueryValidated) {
    return galleryRepository.findAll(params);
  },

  async getById(id: string) {
    const gallery = await galleryRepository.findById(id);
    if (!gallery) throw AppError.notFound("Gallery not found");
    return gallery;
  },

  async getItemById(itemId: string) {
    const item = await galleryRepository.findItemById(itemId);
    if (!item) throw AppError.notFound("Gallery item not found");
    return item;
  },

  async getBySlug(slug: string) {
    const gallery = await galleryRepository.findPublishedBySlug(slug);
    if (!gallery) throw AppError.notFound("Gallery not found or not published");
    return gallery;
  },

  async getPublished(limit?: number) {
    return galleryRepository.findPublished(limit);
  },

  async create(data: CreateGalleryPayload, actorId?: string | null) {
    const existing = await galleryRepository.findBySlug(data.slug);
    if (existing) throw AppError.conflict('Gallery with slug"' + data.slug + '" already exists');

    const createData: any = {
      title: data.title,
      slug: data.slug,
      shortDesc: data.shortDesc || null,
      coverImage: data.coverImage || null,
      contentJson: data.contentJson || null,
      ogImage: data.ogImage || null,
      order: data.order,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
    };

    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }

    const result = await galleryRepository.create(createData);
    await syncMediaAttachments(
      "gallery",
      result.id,
      [
        {
          fieldName: "coverImage",
          value: result.coverImage,
          usageType: "BANNER",
          isPrimary: true,
          altText: data.coverImageAlt,
          isNewUpload: true,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("galleries");
    return result;
  },

  async update(id: string, data: UpdateGalleryPayload, actorId?: string | null) {
    const existing = await galleryRepository.findById(id);
    if (!existing) throw AppError.notFound("Gallery not found");
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await galleryRepository.findBySlug(data.slug);
      if (slugExists)
        throw AppError.conflict('Gallery with slug"' + data.slug + '" already exists');
    }

    const updateData: any = {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(data.shortDesc !== undefined ? { shortDesc: data.shortDesc || null } : {}),
      ...(data.contentJson !== undefined ? { contentJson: data.contentJson || null } : {}),
      ...(data.ogImage !== undefined ? { ogImage: data.ogImage || null } : {}),
      ...(data.coverImage !== undefined ? { coverImage: data.coverImage || null } : {}),
      ...(data.order !== undefined ? { order: data.order } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
    };

    if (actorId) {
      updateData.updatedBy = { connect: { id: actorId } };
    }

    if (data.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      updateData.publishedAt = new Date();
    }
    if (data.status !== "PUBLISHED" && existing.status === "PUBLISHED") {
      updateData.publishedAt = null;
    }
    if (data.status === "ARCHIVED" && existing.status !== "ARCHIVED") {
      updateData.archivedAt = new Date();
    }
    if (data.status && data.status !== "ARCHIVED" && existing.status === "ARCHIVED") {
      updateData.archivedAt = null;
    }

    const result = await galleryRepository.update(id, updateData);
    await syncMediaAttachments(
      "gallery",
      result.id,
      [
        {
          fieldName: "coverImage",
          value: result.coverImage,
          usageType: "BANNER",
          isPrimary: true,
          altText: data.coverImageAlt,
          isNewUpload: data.coverImageAlt != null,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("galleries");
    return result;
  },

  async delete(id: string, actorId?: string | null) {
    const existing = await galleryRepository.findById(id);
    if (!existing) throw AppError.notFound("Gallery not found");
    const result = await galleryRepository.hardDelete(id);
    await bumpPublicCacheVersion("galleries");
    return result;
  },

  async addItem(galleryId: string, data: CreateGalleryItemPayload, actorId?: string | null) {
    const gallery = await galleryRepository.findById(galleryId);
    if (!gallery) throw AppError.notFound("Gallery not found");
    const result = await galleryRepository.addItem(galleryId, {
      title: data.title,
      shortDesc: data.shortDesc || null,
      image: data.image,
      type: data.type,
      videoUrl: data.videoUrl || null,
      thumbnail: data.thumbnail || null,
      order: data.order,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
    } as any);
    await syncMediaAttachments(
      "gallery-item",
      result.id,
      [
        {
          fieldName: "image",
          value: result.image,
          usageType: "GALLERY",
          isPrimary: true,
          altText: data.imageAlt,
          isNewUpload: true,
        },
        {
          fieldName: "videoUrl",
          value: result.videoUrl,
          usageType: "VIDEO",
        },
        {
          fieldName: "thumbnail",
          value: result.thumbnail,
          usageType: "THUMBNAIL",
          altText: data.thumbnailAlt,
          isNewUpload: true,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("galleries");
    return result;
  },

  async updateItem(itemId: string, data: UpdateGalleryItemPayload, actorId?: string | null) {
    const existing = await galleryRepository.findItemById(itemId);
    if (!existing) throw AppError.notFound("Gallery item not found");
    const updateItemData: any = {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.shortDesc !== undefined ? { shortDesc: data.shortDesc || null } : {}),
      ...(data.image !== undefined ? { image: data.image } : {}),
      ...(data.type !== undefined ? { type: data.type } : {}),
      ...(data.videoUrl !== undefined ? { videoUrl: data.videoUrl || null } : {}),
      ...(data.thumbnail !== undefined ? { thumbnail: data.thumbnail || null } : {}),
      ...(data.order !== undefined ? { order: data.order } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
    };

    if (data.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      updateItemData.publishedAt = new Date();
    }
    if (data.status !== "PUBLISHED" && existing.status === "PUBLISHED") {
      updateItemData.publishedAt = null;
    }
    if (data.status === "ARCHIVED" && existing.status !== "ARCHIVED") {
      updateItemData.archivedAt = new Date();
    }
    if (data.status !== "ARCHIVED" && existing.status === "ARCHIVED") {
      updateItemData.archivedAt = null;
    }

    const result = await galleryRepository.updateItem(itemId, updateItemData);
    await syncMediaAttachments(
      "gallery-item",
      result.id,
      [
        {
          fieldName: "image",
          value: result.image,
          usageType: "GALLERY",
          isPrimary: true,
          altText: data.imageAlt,
          isNewUpload: data.imageAlt != null,
        },
        {
          fieldName: "videoUrl",
          value: result.videoUrl,
          usageType: "VIDEO",
        },
        {
          fieldName: "thumbnail",
          value: result.thumbnail,
          usageType: "THUMBNAIL",
          altText: data.thumbnailAlt,
          isNewUpload: data.thumbnailAlt != null,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("galleries");
    return result;
  },

  async deleteItem(itemId: string) {
    const existing = await galleryRepository.findItemById(itemId);
    if (!existing) throw AppError.notFound("Gallery item not found");
    await mediaRepository.deleteAttachmentsByEntityAndFields("GALLERY_ITEM", itemId, [
      "image",
      "videoUrl",
      "thumbnail",
    ]);
    const result = await galleryRepository.deleteItem(itemId);
    await bumpPublicCacheVersion("galleries");
    return result;
  },
};
