import I18n from "@/shared/components/I18n";

import { AppError } from "@/core/server/http/errors";
import { Prisma } from "@prisma/client";
import { bumpPublicCacheVersion } from "@/core/server/cache";
import { syncMediaAttachments } from "@/features/media/utils/media-attachment-sync";
import { clientRepository } from "../repositories/client.repository";
import {
  CreateClientPayload,
  UpdateClientPayload,
  ClientQueryValidated,
} from "../types/client.types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const clientService = {
  async getAll(params: ClientQueryValidated) {
    const result = await clientRepository.findAll(params);
    return {
      ...result,
      data: result.data.map((client) => ({ ...client, name: client.title })),
    };
  },
  async getById(id: string) {
    const client = await clientRepository.findById(id);
    if (!client) throw AppError.notFound("Client not found");
    return { ...client, name: client.title };
  },
  async getPublished(limit?: number) {
    const clients = await clientRepository.findPublished(limit);
    return clients.map((client) => ({ ...client, name: client.title }));
  },
  async create(data: CreateClientPayload, actorId?: string | null) {
    const createData: Prisma.ClientCreateInput = {
      title: data.title,
      slug: data.slug || slugify(data.title),
      shortDesc: data.shortDesc || null,
      contentJson: data.contentJson ?? null,
      logo: data.logo,
      heroImage: data.heroImage || null,
      ogImage: data.ogImage || null,
      website: data.website || null,
      order: data.order,
      isFeatured: data.isFeatured ?? false,
      status: data.status,
      ...(data.status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
      ...(data.status === "ARCHIVED" ? { archivedAt: new Date() } : {}),
    };
    if (actorId) {
      createData.createdBy = { connect: { id: actorId } };
      createData.updatedBy = { connect: { id: actorId } };
    }
    const result = await clientRepository.create(createData);
    await syncMediaAttachments(
      "client",
      result.id,
      [
        {
          fieldName: "logo",
          value: result.logo,
          usageType: "LOGO",
          altText: data.logoAlt,
          isNewUpload: true,
        },
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
      ],
      actorId
    );
    await bumpPublicCacheVersion("clients");
    return { ...result, name: result.title };
  },
  async update(id: string, data: UpdateClientPayload, actorId?: string | null) {
    const existing = await clientRepository.findById(id);
    if (!existing) throw AppError.notFound("Client not found");
    const result = await clientRepository.update(id, {
      ...(actorId ? { updatedBy: { connect: { id: actorId } } } : {}),
      ...(data.title !== undefined ? { title: data.title, slug: slugify(data.title) } : {}),
      ...(data.shortDesc !== undefined ? { shortDesc: data.shortDesc || null } : {}),
      ...(data.contentJson !== undefined ? { contentJson: data.contentJson ?? null } : {}),
      ...(data.logo !== undefined ? { logo: data.logo } : {}),
      ...(data.heroImage !== undefined ? { heroImage: data.heroImage || null } : {}),
      ...(data.ogImage !== undefined ? { ogImage: data.ogImage || null } : {}),
      ...(data.website !== undefined ? { website: data.website || null } : {}),
      ...(data.order !== undefined ? { order: data.order } : {}),
      ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
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
    });
    await syncMediaAttachments(
      "client",
      result.id,
      [
        {
          fieldName: "logo",
          value: result.logo,
          usageType: "LOGO",
          altText: data.logoAlt,
          isNewUpload: data.logoAlt != null,
        },
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
      ],
      actorId
    );
    await bumpPublicCacheVersion("clients");
    return { ...result, name: result.title };
  },
  async delete(id: string, actorId?: string | null) {
    const existing = await clientRepository.findById(id);
    if (!existing) throw AppError.notFound("Client not found");
    const result = await clientRepository.hardDelete(id);
    await bumpPublicCacheVersion("clients");
    return result;
  },
};
