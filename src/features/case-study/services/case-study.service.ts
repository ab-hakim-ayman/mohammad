import I18n from "@/shared/components/I18n";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import prisma from "@/core/server/prisma";

import { CreateCaseStudySchema, UpdateCaseStudySchema } from "../schemas/case-study.schema";
import { caseStudyRepository } from "../repositories/case-study.repository";
import {
  CreateCaseStudyPayload,
  UpdateCaseStudyPayload,
  CaseStudyQueryValidated,
} from "../types/case-study.types";

const normalizeIds = (ids?: string[]) =>
  Array.from(
    new Set(
      (ids ?? []).filter((id): id is string => typeof id === "string" && id.trim().length > 0)
    )
  );

export const caseStudyService = {
  async getAll(params: CaseStudyQueryValidated) {
    return caseStudyRepository.findAll(params);
  },

  async getById(id: string) {
    const caseStudy = await caseStudyRepository.findById(id);

    if (!caseStudy) {
      throw AppError.notFound("Case study not found");
    }

    return caseStudy;
  },

  async getBySlug(slug: string) {
    const caseStudy = await caseStudyRepository.findBySlug(slug);

    if (!caseStudy) {
      throw AppError.notFound("Case study not found");
    }

    return caseStudy;
  },

  async getPublicBySlug(slug: string) {
    const caseStudy = await caseStudyRepository.findPublicBySlug(slug);

    if (!caseStudy) {
      throw AppError.notFound("Case study not found");
    }

    return caseStudy;
  },

  async getPublished(params: {
    page?: number;
    limit?: number;
    search?: string;
    featured?: boolean;
  }) {
    return caseStudyRepository.findPublished(params);
  },

  async create(data: CreateCaseStudyPayload, actorId?: string | null) {
    const validated = CreateCaseStudySchema.parse(data);
    const testimonialIds = normalizeIds(validated.testimonialIds);
    const categoryIds = normalizeIds(validated.categoryIds);
    const tagIds = normalizeIds(validated.tagIds);

    const existingSlug = await prisma.caseStudy.findUnique({
      where: { slug: validated.slug },
      select: {
        id: true,
        status: true,
      },
    });

    if (existingSlug) {
      throw AppError.conflict(`Case study with slug "${validated.slug}" already exists.`);
    }

    const selectedProject = await prisma.project.findUnique({
      where: { id: validated.projectId },
      select: { id: true },
    });

    if (!selectedProject) {
      throw AppError.notFound("Selected project not found.");
    }

    const projectInUse = await prisma.caseStudy.findFirst({
      where: { projectId: validated.projectId },
      select: { id: true },
    });

    if (projectInUse) {
      throw AppError.conflict("Selected Project is already linked to another Case Study.");
    }

    const createData: any = {
      title: validated.title,
      slug: validated.slug,
      shortDesc: validated.shortDesc ?? null,
      seoTitle: validated.seoTitle ?? null,
      seoDescription: validated.seoDescription ?? null,
      ogImage: validated.ogImage ?? null,
      contentJson: validated.contentJson ?? null,
      cardImage: validated.cardImage ?? null,
      galleryImages: validated.galleryImages ?? [],
      heroImage: validated.heroImage ?? null,
      heroVideoUrl: validated.heroVideoUrl ?? null,
      demoVideoUrl: validated.demoVideoUrl ?? null,
      order: validated.order ?? 0,
      status: validated.status,
      isFeatured: validated.isFeatured ?? false,
      publishedAt: validated.status === "PUBLISHED" ? new Date() : null,
      archivedAt: validated.status === "ARCHIVED" ? new Date() : null,

      project: {
        connect: {
          id: validated.projectId,
        },
      },
      ...(testimonialIds.length > 0
        ? { testimonials: { connect: testimonialIds.map((id: string) => ({ id })) } }
        : {}),
      ...(categoryIds.length > 0
        ? { categories: { connect: categoryIds.map((id: string) => ({ id })) } }
        : {}),
      ...(tagIds.length > 0 ? { tags: { connect: tagIds.map((id: string) => ({ id })) } } : {}),
    };

    if (actorId) {
      createData.createdBy = {
        connect: { id: actorId },
      };

      createData.updatedBy = {
        connect: { id: actorId },
      };
    }

    const result = await caseStudyRepository.create(createData);

    await syncMediaAttachments(
      "case-study",
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
          usageType: "OTHER",
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

    await bumpPublicCacheVersion("case-studies");

    return result;
  },

  async update(id: string, data: UpdateCaseStudyPayload, actorId?: string | null) {
    const validated = UpdateCaseStudySchema.parse(data);

    const existing = await caseStudyRepository.findById(id);

    if (!existing) {
      throw AppError.notFound("Case study not found");
    }

    const categoryIds = normalizeIds(validated.categoryIds);
    const tagIds = normalizeIds(validated.tagIds);

    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await prisma.caseStudy.findUnique({
        where: { slug: validated.slug },
        select: {
          id: true,
          status: true,
        },
      });

      if (slugExists && slugExists.id !== id) {
        throw AppError.conflict(`Case study with slug "${validated.slug}" already exists.`);
      }
    }

    const updateData: any = {
      title: validated.title,
      slug: validated.slug,
      shortDesc: validated.shortDesc,
      seoTitle: validated.seoTitle,
      seoDescription: validated.seoDescription,
      ogImage: validated.ogImage,
      contentJson: validated.contentJson,
      cardImage: validated.cardImage,
      heroImage: validated.heroImage,
      heroVideoUrl: validated.heroVideoUrl,
      galleryImages: validated.galleryImages,
      demoVideoUrl: validated.demoVideoUrl,
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
      updateData.updatedBy = {
        connect: { id: actorId },
      };
    }

    if (validated.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      updateData.publishedAt = new Date();
    }

    if (validated.status !== "PUBLISHED" && existing.status === "PUBLISHED") {
      updateData.publishedAt = null;
    }

    if (validated.status === "ARCHIVED" && existing.status !== "ARCHIVED") {
      updateData.archivedAt = new Date();
    }

    if (validated.status !== "ARCHIVED" && existing.status === "ARCHIVED") {
      updateData.archivedAt = null;
    }

    if (validated.projectId && validated.projectId !== existing.projectId) {
      const selectedProject = await prisma.project.findUnique({
        where: { id: validated.projectId },
        select: { id: true },
      });

      if (!selectedProject) {
        throw AppError.notFound("Selected project not found.");
      }

      const projectInUse = await prisma.caseStudy.findFirst({
        where: {
          projectId: validated.projectId,
          id: {
            not: id,
          },
        },
        select: { id: true },
      });

      if (projectInUse) {
        throw AppError.conflict("Selected Project is already linked to another Case Study.");
      }

      updateData.project = {
        connect: {
          id: validated.projectId,
        },
      };
    }

    if (validated.testimonialIds !== undefined) {
      const testimonialIds = normalizeIds(validated.testimonialIds);

      updateData.testimonials = {
        set: testimonialIds.map((id) => ({ id })),
      };
    }

    if (validated.categoryIds !== undefined) {
      updateData.categories = {
        set: categoryIds.map((id: string) => ({ id })),
      };
    }

    if (validated.tagIds !== undefined) {
      updateData.tags = {
        set: tagIds.map((id: string) => ({ id })),
      };
    }

    const result = await caseStudyRepository.update(id, updateData);

    await syncMediaAttachments(
      "case-study",
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
          usageType: "OTHER",
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
        {
          fieldName: "heroVideoUrl",
          value: result.heroVideoUrl,
          usageType: "VIDEO",
          isNewUpload: false,
        },
        {
          fieldName: "demoVideoUrl",
          value: result.demoVideoUrl,
          usageType: "VIDEO",
          isNewUpload: false,
        },
      ],
      actorId
    );

    await bumpPublicCacheVersion("case-studies");

    return result;
  },

  async delete(id: string, actorId?: string | null) {
    const existing = await caseStudyRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Case study not found");
    }
    const result = await caseStudyRepository.hardDelete(id);
    await bumpPublicCacheVersion("case-studies");
    return result;
  },
};
