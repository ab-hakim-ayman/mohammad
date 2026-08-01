import I18n from "@/shared/components/I18n";

import { Prisma } from "@prisma/client";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import { blogRepository } from "../repositories/blog.repository";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { CreateBlogPayload, UpdateBlogPayload, BlogQueryValidated } from "../types/blog.types";

export const blogService = {
  async getAll(params: BlogQueryValidated) {
    const result = await blogRepository.findAll(params);
    return result;
  },
  async getById(id: string) {
    const blog = await blogRepository.findById(id);
    if (!blog) throw AppError.notFound("Blog not found");
    return blog;
  },
  async getBySlug(slug: string) {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) throw AppError.notFound("Blog not found");
    return blog;
  },
  async getPublicBySlug(slug: string) {
    const blog = await blogRepository.findPublicBySlug(slug);
    if (!blog) throw AppError.notFound("Blog not found or not available");
    return blog;
  },
  async getRelatedBlogs(blogId: string, categorySlugs: string[], tagSlugs: string[]) {
    return blogRepository.findRelatedBlogs(blogId, categorySlugs, tagSlugs);
  },
  async getPublished(params: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
  }) {
    return blogRepository.findPublished(params);
  },
  async create(data: CreateBlogPayload, actorId?: string | null) {
    const existing = await blogRepository.findBySlug(data.slug);
    if (existing && existing.status !== "ARCHIVED") {
      throw AppError.conflict(`Blog with slug"${data.slug}" already exists`);
    }
    const createData: Prisma.BlogCreateInput = {
      title: data.title,
      slug: data.slug,
      contentJson:
        data.contentJson === null ? Prisma.DbNull : (data.contentJson as Prisma.InputJsonValue),
      excerpt: data.excerpt || null,
      cardImage: data.cardImage || null,
      heroImage: data.heroImage || null,
      heroVideoUrl: data.heroVideoUrl || null,
      galleryImages: data.galleryImages || [],
      demoVideoUrl: data.demoVideoUrl || null,
      ogImage: data.ogImage || null,
      readTime: data.readTime || null,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
      isFeatured: data.isFeatured,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    };
    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }
    const result = await blogRepository.create(createData, data.categories, data.tags);
    await syncMediaAttachments(
      "blog",
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
        {
          fieldName: "heroVideoUrl",
          value: result.heroVideoUrl,
          usageType: "VIDEO",
          isNewUpload: true,
        },
        {
          fieldName: "demoVideoUrl",
          value: result.demoVideoUrl,
          usageType: "VIDEO",
          isNewUpload: true,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("blogs");
    return result;
  },
  async update(id: string, data: UpdateBlogPayload, actorId?: string | null) {
    const existing = await blogRepository.findById(id);
    if (!existing) throw AppError.notFound("Blog not found");
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await blogRepository.findBySlug(data.slug);
      if (slugExists && slugExists.status !== "ARCHIVED") {
        throw AppError.conflict(`Blog with slug"${data.slug}" already exists`);
      }
    }
    const updateData: Prisma.BlogUpdateInput = {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.contentJson !== undefined
        ? {
            contentJson:
              data.contentJson === null
                ? Prisma.DbNull
                : (data.contentJson as Prisma.InputJsonValue),
          }
        : {}),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
      ...(data.cardImage !== undefined && { cardImage: data.cardImage }),
      ...(data.heroImage !== undefined && { heroImage: data.heroImage }),
      ...(data.heroVideoUrl !== undefined && { heroVideoUrl: data.heroVideoUrl }),
      ...(data.galleryImages !== undefined && { galleryImages: data.galleryImages }),
      ...(data.demoVideoUrl !== undefined && { demoVideoUrl: data.demoVideoUrl }),
      ...(data.ogImage !== undefined && { ogImage: data.ogImage }),
      ...(data.readTime !== undefined && { readTime: data.readTime }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
      ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
      ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
    };
    if (actorId) {
      updateData.updatedBy = { connect: { id: actorId } };
    }
    if (data.status && data.status !== existing.status) {
      if (data.status === "PUBLISHED") updateData.publishedAt = new Date();
      if (data.status === "ARCHIVED") updateData.archivedAt = new Date();
    }
    const result = await blogRepository.update(id, updateData, data.categories, data.tags);
    await syncMediaAttachments(
      "blog",
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
        {
          fieldName: "heroVideoUrl",
          value: result.heroVideoUrl,
          usageType: "VIDEO",
          isNewUpload: data.heroVideoUrl !== undefined,
        },
        {
          fieldName: "demoVideoUrl",
          value: result.demoVideoUrl,
          usageType: "VIDEO",
          isNewUpload: data.demoVideoUrl !== undefined,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("blogs");
    return result;
  },
  async delete(id: string, actorId?: string | null) {
    const existing = await blogRepository.findById(id);
    if (!existing) throw AppError.notFound("Blog not found");
    const result = await blogRepository.hardDelete(id);
    await bumpPublicCacheVersion("blogs");
    return result;
  },
};
