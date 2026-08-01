import I18n from "@/shared/components/I18n";

import { AppError } from "@/core/server/http/errors";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import { Prisma } from "@prisma/client";
import { partnerRepository } from "../repositories/partner.repository";
import {
  CreatePartnerPayload,
  UpdatePartnerPayload,
  PartnerQueryValidated,
} from "../types/partner.types";

export const partnerService = {
  async getAll(params: PartnerQueryValidated) {
    const result = await partnerRepository.findAll(params);
    return result;
  },
  async getById(id: string) {
    const partner = await partnerRepository.findById(id);
    if (!partner) throw AppError.notFound("Partner not found");
    return partner;
  },
  async getPublished(limit?: number) {
    const partners = await partnerRepository.findPublished(limit);
    return partners;
  },
  async create(data: CreatePartnerPayload, actorId?: string | null) {
    const createData: Prisma.PartnerCreateInput = {
      title: data.title,
      logo: data.logo,
      website: data.website || null,
      shortDesc: data.shortDesc || null,
      type: data.type,
      isFeatured: data.isFeatured ?? false,
      order: data.order,
      status: data.status,
      ...(data.status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
      ...(data.status === "ARCHIVED" ? { archivedAt: new Date() } : {}),
    };
    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }
    const result = await partnerRepository.create(createData);
    await syncMediaAttachments(
      "partner",
      result.id,
      [
        {
          fieldName: "logo",
          value: result.logo,
          usageType: "LOGO",
          altText: data.logoAlt,
          isNewUpload: true,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("partners");
    return result;
  },
  async update(id: string, data: UpdatePartnerPayload, actorId?: string | null) {
    const existing = await partnerRepository.findById(id);
    if (!existing) throw AppError.notFound("Partner not found");
    const result = await partnerRepository.update(id, {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.logo !== undefined ? { logo: data.logo } : {}),
      ...(data.website !== undefined ? { website: data.website || null } : {}),
      ...(data.shortDesc !== undefined ? { shortDesc: data.shortDesc || null } : {}),
      ...(data.type !== undefined ? { type: data.type } : {}),
      ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
      ...(data.order !== undefined ? { order: data.order } : {}),
      ...(data.status !== undefined
        ? {
            status: data.status,
            ...(data.status === "PUBLISHED" && existing.status !== "PUBLISHED"
              ? { publishedAt: existing.publishedAt || new Date() }
              : {}),
            ...(data.status === "ARCHIVED" && existing.status !== "ARCHIVED"
              ? { archivedAt: new Date() }
              : {}),
          }
        : {}),
      ...(actorId ? { updatedBy: { connect: { id: actorId } } } : {}),
    });
    await syncMediaAttachments(
      "partner",
      result.id,
      [
        {
          fieldName: "logo",
          value: result.logo,
          usageType: "LOGO",
          altText: data.logoAlt,
          isNewUpload: data.logoAlt != null,
        },
      ],
      actorId
    );
    await bumpPublicCacheVersion("partners");
    return result;
  },
  async delete(id: string, actorId?: string | null) {
    const existing = await partnerRepository.findById(id);
    if (!existing) throw AppError.notFound("Partner not found");
    const result = await partnerRepository.hardDelete(id);
    await bumpPublicCacheVersion("partners");
    return result;
  },
};
