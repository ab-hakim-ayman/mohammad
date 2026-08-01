import I18n from "@/shared/components/I18n";

import { Prisma } from "@prisma/client";
import { testimonialRepository } from "../repositories/testimonial.repository";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import {
  CreateTestimonialPayload,
  UpdateTestimonialPayload,
  TestimonialQueryValidated,
} from "../types/testimonial.types";

export const testimonialService = {
  async getAll(params: TestimonialQueryValidated) {
    const result = await testimonialRepository.findAll(params);
    return result;
  },
  async getById(id: string) {
    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) throw AppError.notFound("Testimonial not found");
    return testimonial;
  },
  async getPublished(params?: { featured?: boolean; limit?: number }) {
    const testimonials = await testimonialRepository.findPublished(params);
    return testimonials;
  },
  async create(data: CreateTestimonialPayload, actorId?: string | null) {
    const createData: Prisma.TestimonialCreateInput = {
      message: data.message,
      rating: data.rating ?? 5,
      authorName: data.authorName,
      authorPosition: data.authorPosition || null,
      authorImage: data.authorImage || null,
      type: data.type || "CLIENT",
      source: data.source || "ADMIN",
      email: data.email || null,
      status: data.status,
      isFeatured: data.isFeatured ?? false,
      order: data.order ?? 0,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
    };
    if (data.clientId) {
      createData.client = { connect: { id: data.clientId } };
    }
    if (data.employeeId) {
      createData.employee = { connect: { id: data.employeeId } };
    }
    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }
    const result = await testimonialRepository.create(createData);
    await syncMediaAttachments(
      "testimonial",
      result.id,
      [
        {
          fieldName: "authorImage",
          value: result.authorImage,
          usageType: "AVATAR",
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("testimonials");
    return result;
  },
  async update(id: string, data: UpdateTestimonialPayload, actorId?: string | null) {
    const existing = await testimonialRepository.findById(id);
    if (!existing) throw AppError.notFound("Testimonial not found");
    const updateData: Prisma.TestimonialUpdateInput = {};
    if (data.message !== undefined) updateData.message = data.message;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.authorName !== undefined) updateData.authorName = data.authorName;
    if (data.authorPosition !== undefined) updateData.authorPosition = data.authorPosition || null;
    if (data.authorImage !== undefined) updateData.authorImage = data.authorImage || null;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.email !== undefined) updateData.email = data.email || null;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.clientId !== undefined) {
      updateData.client = data.clientId ? { connect: { id: data.clientId } } : { disconnect: true };
    }
    if (data.employeeId !== undefined) {
      updateData.employee = data.employeeId
        ? { connect: { id: data.employeeId } }
        : { disconnect: true };
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
    const result = await testimonialRepository.update(id, updateData);
    await syncMediaAttachments(
      "testimonial",
      result.id,
      [
        {
          fieldName: "authorImage",
          value: result.authorImage,
          usageType: "AVATAR",
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("testimonials");
    return result;
  },
  async delete(id: string, actorId?: string | null) {
    const existing = await testimonialRepository.findById(id);
    if (!existing) throw AppError.notFound("Testimonial not found");
    const result = await testimonialRepository.hardDelete(id);
    await bumpPublicCacheVersion("testimonials");
    return result;
  },
};
