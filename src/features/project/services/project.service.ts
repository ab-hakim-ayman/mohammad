import I18n from "@/shared/components/I18n";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments  } from "@/features/media/utils/media-attachment-sync";
import { CreateProjectSchema, UpdateProjectSchema } from "../schemas/project.schema";
import { projectRepository } from "../repositories/project.repository";
import { CreateProjectPayload, UpdateProjectPayload, ProjectQueryValidated } from "../types/project.types";

export const projectService = {
  async getAll(params: ProjectQueryValidated) {
    return projectRepository.findAll(params);
  },

  async getById(id: string) {
    const project = await projectRepository.findById(id);
    if (!project) throw AppError.notFound("Project not found");
    return project;
  },

  async getBySlug(slug: string) {
    const project = await projectRepository.findBySlug(slug);
    if (!project) throw AppError.notFound("Project not found");
    return project;
  },

  async getPublicBySlug(slug: string) {
    const project = await projectRepository.findPublicBySlug(slug);
    if (!project) throw AppError.notFound("Project not found");
    return project;
  },

  async getPublished(params: {
    page?: number;
    limit?: number;
    search?: string;
    technology?: string;
    featured?: boolean;
  }) {
    return projectRepository.findPublished(params);
  },

  async create(data: CreateProjectPayload, actorId?: string | null) {
    const validated = CreateProjectSchema.parse(data);

    const existing = await projectRepository.findBySlug(validated.slug);
    if (existing && existing.status !== "ARCHIVED") {
      throw AppError.conflict('Project with slug"' + validated.slug + '" already exists');
    }

    const createData: any = {
      title: validated.title,
      slug: validated.slug,
      shortDesc: validated.shortDesc,
      seoTitle: validated.seoTitle,
      seoDescription: validated.seoDescription,
      ogImage: validated.ogImage,
      cardImage: validated.cardImage || null,
      heroImage: validated.heroImage || null,
      heroVideoUrl: validated.heroVideoUrl || null,
      contentJson: validated.contentJson || null,
      galleryImages: validated.galleryImages,
      githubUrl: validated.githubUrl || null,
      liveUrl: validated.liveUrl || null,
      demoVideoUrl: validated.demoVideoUrl || null,
      startDate: validated.startDate || null,
      endDate: validated.endDate || null,
      status: validated.status,
      isFeatured: validated.isFeatured,
      order: validated.order,
      publishedAt: validated.status === "PUBLISHED" ? new Date() : null,
      archivedAt: validated.status === "ARCHIVED" ? new Date() : null,

      technologies: {
        connect: validated.technologyIds?.map((id) => ({ id })) || [],
      },
      services: { connect: validated.serviceIds?.map((id) => ({ id })) || [] },
      categories: { connect: validated.categoryIds?.map((id) => ({ id })) || [] },
      tags: { connect: validated.tagIds?.map((id) => ({ id })) || [] },
    };

    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }

    const result = await projectRepository.create(createData);

    await syncMediaAttachments(
      "project",
      result.id,
      [
        {
          fieldName: "heroImage",
          value: result.heroImage,
          usageType: "THUMBNAIL",
          altText: validated.heroImageAlt,
          isNewUpload: true,
        },
        {
          fieldName: "galleryImages",
          value: result.galleryImages,
          usageType: "GALLERY",
          altTexts: validated.galleryImagesAltTexts ?? undefined,
          isNewUpload: true,
        },
        {
          fieldName: "ogImage",
          value: result.ogImage,
          usageType: "BANNER",
          altText: validated.ogImageAlt,
          isNewUpload: true,
        },
        {
          fieldName: "cardImage",
          value: result.cardImage,
          usageType: "THUMBNAIL",
          altText: validated.cardImageAlt,
          isNewUpload: true,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("projects");

    return result;
  },

  async update(id: string, data: UpdateProjectPayload, actorId?: string | null) {
    const validated = UpdateProjectSchema.parse(data);

    const existing = await projectRepository.findById(id);
    if (!existing) throw AppError.notFound("Project not found");

    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await projectRepository.findBySlug(validated.slug);
      if (slugExists && slugExists.status !== "ARCHIVED") {
        throw AppError.conflict('Project with slug"' + validated.slug + '" already exists');
      }
    }

    const updateData: any = {
      title: validated.title,
      slug: validated.slug,
      shortDesc: validated.shortDesc,
      seoTitle: validated.seoTitle,
      seoDescription: validated.seoDescription,
      ogImage: validated.ogImage,
      cardImage: validated.cardImage,
      heroImage: validated.heroImage,
      heroVideoUrl: validated.heroVideoUrl,
      contentJson: validated.contentJson,
      galleryImages: validated.galleryImages,
      githubUrl: validated.githubUrl,
      liveUrl: validated.liveUrl,
      demoVideoUrl: validated.demoVideoUrl,
      startDate: validated.startDate,
      endDate: validated.endDate,
      status: validated.status,
      isFeatured: validated.isFeatured,
      order: validated.order,
    };

    for (const [key, value] of Object.entries(updateData)) {
      if (value === undefined) {
        delete (updateData as any)[key];
      }
    }

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

    if (validated.technologyIds) {
      updateData.technologies = {
        set: validated.technologyIds.map((id) => ({ id })),
      };
    }

    if (validated.serviceIds) {
      updateData.services = { set: validated.serviceIds.map((id) => ({ id })) };
    }
    if (validated.categoryIds !== undefined) {
      updateData.categories = { set: validated.categoryIds.map((id) => ({ id })) };
    }
    if (validated.tagIds !== undefined) {
      updateData.tags = { set: validated.tagIds.map((id) => ({ id })) };
    }

    const result = await projectRepository.update(id, updateData);

    await syncMediaAttachments(
      "project",
      result.id,
      [
        {
          fieldName: "heroImage",
          value: result.heroImage,
          usageType: "THUMBNAIL",
          altText: validated.heroImageAlt,
          isNewUpload: validated.heroImageAlt != null,
        },
        {
          fieldName: "galleryImages",
          value: result.galleryImages,
          usageType: "GALLERY",
          altTexts: validated.galleryImagesAltTexts ?? undefined,
          isNewUpload: validated.galleryImagesAltTexts != null,
        },
        {
          fieldName: "ogImage",
          value: result.ogImage,
          usageType: "BANNER",
          altText: validated.ogImageAlt,
          isNewUpload: validated.ogImageAlt != null,
        },
        {
          fieldName: "cardImage",
          value: result.cardImage,
          usageType: "THUMBNAIL",
          altText: validated.cardImageAlt,
          isNewUpload: validated.cardImageAlt != null,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("projects");

    return result;
  },

  async delete(id: string, actorId?: string | null) {
    const existing = await projectRepository.findById(id);
    if (!existing) throw AppError.notFound("Project not found");

    const result = await projectRepository.hardDelete(id);

    await bumpPublicCacheVersion("projects");
    return result;
  },
};
