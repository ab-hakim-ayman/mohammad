import I18n from "@/shared/components/I18n";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments  } from "@/features/media/utils/media-attachment-sync";
import { CreateServiceSchema, UpdateServiceSchema } from "../schemas/service.schema";
import { serviceRepository } from "../repositories/service.repository";
import { CreateServicePayload, UpdateServicePayload, ServiceQueryValidated } from "../types/service.types";

export const serviceService = {
  async getAll(params: ServiceQueryValidated) {
    return serviceRepository.findAll(params);
  },

  async getById(id: string) {
    const service = await serviceRepository.findById(id);
    if (!service) throw AppError.notFound("Service not found");
    return service;
  },

  async getBySlug(slug: string) {
    const service = await serviceRepository.findBySlug(slug);
    if (!service) throw AppError.notFound("Service not found");
    return service;
  },

  async getPublicBySlug(slug: string) {
    const service = await serviceRepository.findPublicBySlug(slug);
    if (!service) throw AppError.notFound("Service not found");
    return service;
  },

  async getPublished(params: { page?: number; limit?: number; search?: string }) {
    return serviceRepository.findPublished(params);
  },

  async create(data: CreateServicePayload, actorId?: string | null) {
    const validated = CreateServiceSchema.parse(data);

    const existing = await serviceRepository.findBySlug(validated.slug);
    if (existing && existing.status !== "ARCHIVED") {
      throw AppError.conflict('Service with slug"' + validated.slug + '" already exists');
    }

    const createData: any = {
      title: validated.title,
      slug: validated.slug,
      shortDesc: validated.shortDesc || null,
      contentJson: validated.contentJson || null,
      icon: validated.icon || null,
      cardImage: validated.cardImage || null,
      heroImage: validated.heroImage || null,
      heroVideoUrl: validated.heroVideoUrl || null,
      galleryImages: validated.galleryImages,
      demoVideoUrl: validated.demoVideoUrl || null,
      ogImage: validated.ogImage || null,
      seoTitle: validated.seoTitle || null,
      seoDescription: validated.seoDescription || null,
      order: validated.order,
      status: validated.status,
      isFeatured: validated.isFeatured,
      publishedAt: validated.status === "PUBLISHED" ? new Date() : null,
      archivedAt: validated.status === "ARCHIVED" ? new Date() : null,
      technologies: { connect: validated.technologyIds?.map((id) => ({ id })) || [] },
      projects: { connect: validated.projectIds?.map((id) => ({ id })) || [] },
      faqs: { connect: validated.faqIds?.map((id) => ({ id })) || [] },
      testimonials: { connect: validated.testimonialIds?.map((id) => ({ id })) || [] },
      categories: { connect: validated.categoryIds?.map((id) => ({ id })) || [] },
      tags: { connect: validated.tagIds?.map((id) => ({ id })) || [] },
      specializations: { connect: validated.specializationIds?.map((id) => ({ id })) || [] },
    };

    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }

    const result = await serviceRepository.create(createData);

    await syncMediaAttachments(
      "service",
      result.id,
      [
        {
          fieldName: "heroImage",
          value: result.heroImage,
          usageType: "BANNER",
          altText: validated.heroImageAlt,
          isNewUpload: true,
        },
        {
          fieldName: "cardImage",
          value: result.cardImage,
          usageType: "THUMBNAIL",
          altText: validated.cardImageAlt,
          isNewUpload: true,
        },
        {
          fieldName: "ogImage",
          value: result.ogImage,
          usageType: "OTHER",
          altText: validated.ogImageAlt,
          isNewUpload: true,
        },
        {
          fieldName: "icon",
          value: result.icon,
          usageType: "INLINE",
          altText: validated.iconAlt,
          isNewUpload: true,
        },
        {
          fieldName: "galleryImages",
          value: result.galleryImages,
          usageType: "GALLERY",
          altTexts: validated.galleryImagesAltTexts ?? undefined,
          isNewUpload: true,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("services");

    return result;
  },

  async update(id: string, data: UpdateServicePayload, actorId?: string | null) {
    const validated = UpdateServiceSchema.parse(data);

    const existing = await serviceRepository.findById(id);
    if (!existing) throw AppError.notFound("Service not found");

    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await serviceRepository.findBySlug(validated.slug);
      if (slugExists && slugExists.status !== "ARCHIVED") {
        throw AppError.conflict('Service with slug"' + validated.slug + '" already exists');
      }
    }

    const updateData: any = {
      title: validated.title,
      slug: validated.slug,
      shortDesc: validated.shortDesc,
      contentJson: validated.contentJson,
      icon: validated.icon,
      cardImage: validated.cardImage,
      heroImage: validated.heroImage,
      heroVideoUrl: validated.heroVideoUrl,
      galleryImages: validated.galleryImages,
      demoVideoUrl: validated.demoVideoUrl,
      ogImage: validated.ogImage,
      seoTitle: validated.seoTitle,
      seoDescription: validated.seoDescription,
      order: validated.order,
      status: validated.status,
      isFeatured: validated.isFeatured,
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    if (actorId) {
      updateData.updatedBy = { connect: { id: actorId } };
    }

    if (validated.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      updateData.publishedAt = new Date();
    }
    if (validated.status === "ARCHIVED" && existing.status !== "ARCHIVED") {
      updateData.archivedAt = new Date();
    }
    if (validated.status !== "ARCHIVED" && existing.status === "ARCHIVED") {
      updateData.archivedAt = null;
    }

    if (validated.technologyIds)
      updateData.technologies = { set: validated.technologyIds.map((id) => ({ id })) };
    if (validated.projectIds)
      updateData.projects = { set: validated.projectIds.map((id) => ({ id })) };
    if (validated.faqIds) updateData.faqs = { set: validated.faqIds.map((id) => ({ id })) };
    if (validated.testimonialIds)
      updateData.testimonials = { set: validated.testimonialIds.map((id) => ({ id })) };
    if (validated.categoryIds)
      updateData.categories = { set: validated.categoryIds.map((id) => ({ id })) };
    if (validated.tagIds) updateData.tags = { set: validated.tagIds.map((id) => ({ id })) };
    if (validated.specializationIds)
      updateData.specializations = { set: validated.specializationIds.map((id) => ({ id })) };

    const result = await serviceRepository.update(id, updateData);

    await syncMediaAttachments(
      "service",
      result.id,
      [
        {
          fieldName: "heroImage",
          value: result.heroImage,
          usageType: "BANNER",
          altText: validated.heroImageAlt,
          isNewUpload: validated.heroImageAlt != null,
        },
        {
          fieldName: "cardImage",
          value: result.cardImage,
          usageType: "THUMBNAIL",
          altText: validated.cardImageAlt,
          isNewUpload: validated.cardImageAlt != null,
        },
        {
          fieldName: "ogImage",
          value: result.ogImage,
          usageType: "OTHER",
          altText: validated.ogImageAlt,
          isNewUpload: validated.ogImageAlt != null,
        },
        {
          fieldName: "icon",
          value: result.icon,
          usageType: "INLINE",
          altText: validated.iconAlt,
          isNewUpload: validated.iconAlt != null,
        },
        {
          fieldName: "galleryImages",
          value: result.galleryImages,
          usageType: "GALLERY",
          altTexts: validated.galleryImagesAltTexts ?? undefined,
          isNewUpload: validated.galleryImagesAltTexts != null,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("services");

    return result;
  },

  async delete(id: string, actorId?: string | null) {
    const existing = await serviceRepository.findById(id);
    if (!existing) throw AppError.notFound("Service not found");

    const result = await serviceRepository.delete(id);
    await bumpPublicCacheVersion("services");
    return result;
  },
};
