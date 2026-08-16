import I18n from "@/shared/components/I18n";
import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { faqRepository } from "../repositories/faq.repository";
import { CreateFaqPayload, UpdateFaqPayload, FaqQueryValidated } from "../types/faq.types";

export const faqService = {
  async getAll(params: FaqQueryValidated) {
    return faqRepository.findAll(params);
  },

  async getById(id: string) {
    const faq = await faqRepository.findById(id);
    if (!faq) throw AppError.notFound("FAQ not found");
    return faq;
  },

  async getPublished(limit?: number, category?: string) {
    return faqRepository.findPublished(limit, category);
  },

  async create(data: CreateFaqPayload, actorId?: string | null) {
    const createData: any = {
      question: data.question,
      answer: data.answer,
      order: data.order,
      isFeatured: data.isFeatured ?? false,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      archivedAt: data.status === "ARCHIVED" ? new Date() : null,
      ...(data.categoryIds && data.categoryIds.length > 0
        ? { categories: { connect: data.categoryIds.map((id) => ({ id })) } }
        : {}),
      ...(data.serviceIds && data.serviceIds.length > 0
        ? { services: { connect: data.serviceIds.map((id) => ({ id })) } }
        : {}),
    };

    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }

    const result = await faqRepository.create(createData);
    await bumpPublicCacheVersion("faqs");
    return result;
  },

  async update(id: string, data: UpdateFaqPayload, actorId?: string | null) {
    const existing = await faqRepository.findById(id);
    if (!existing) throw AppError.notFound("FAQ not found");

    const updateData: any = {
      ...(data.question !== undefined ? { question: data.question } : {}),
      ...(data.answer !== undefined ? { answer: data.answer } : {}),
      ...(data.order !== undefined ? { order: data.order } : {}),
      ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
      ...(data.status !== undefined
        ? {
            status: data.status,
            publishedAt:
              data.status === "PUBLISHED" && existing.status !== "PUBLISHED"
                ? new Date()
                : undefined,
            archivedAt:
              data.status === "ARCHIVED" && existing.status !== "ARCHIVED" ? new Date() : undefined,
          }
        : {}),
      ...(data.categoryIds !== undefined
        ? { categories: { set: data.categoryIds.map((id) => ({ id })) } }
        : {}),
      ...(data.serviceIds !== undefined
        ? { services: { set: data.serviceIds.map((id) => ({ id })) } }
        : {}),
    };

    if (actorId) {
      updateData.updatedBy = { connect: { id: actorId } };
    }

    if (data.status && data.status !== "ARCHIVED" && existing.status === "ARCHIVED") {
      updateData.archivedAt = null;
    }

    const result = await faqRepository.update(id, updateData);
    await bumpPublicCacheVersion("faqs");
    return result;
  },

  async delete(id: string, actorId?: string | null) {
    const existing = await faqRepository.findById(id);
    if (!existing) throw AppError.notFound("FAQ not found");
    const result = await faqRepository.hardDelete(id);
    await bumpPublicCacheVersion("faqs");
    return result;
  },
};
