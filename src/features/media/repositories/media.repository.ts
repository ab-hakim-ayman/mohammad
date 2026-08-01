import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import type { MediaEntityType, MediaUsageType } from "@/shared/types";
import type { MediaAttachmentCreateInput, MediaQueryValidated } from "../types/media.types";
import { deleteCloudinaryAsset } from "@/core/server/media";
const auditUserSelect = {
  id: true,
  email: true,
  name: true,
  avatar: true,
  role: true,
  status: true,
  profile: {
    select: {
      fullName: true,
      headline: true,
      avatar: true,
      designation: true,
    },
  },
} as const satisfies Prisma.UserSelect;
const attachmentSelect = {
  id: true,
  mediaId: true,
  entityType: true,
  entityId: true,
  fieldName: true,
  usageType: true,
  sortOrder: true,
  isPrimary: true,
  altText: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.MediaAttachmentSelect;
export const mediaRepository = {
  async findAll(params: MediaQueryValidated) {
    const { page = 1, limit = 12, search, sort, provider, resourceType, folder } = params;
    const where: Prisma.MediaWhereInput = {
      ...(search && {
        OR: [
          { providerAssetId: { contains: search, mode: "insensitive" } },
          { originalFilename: { contains: search, mode: "insensitive" } },
          { altText: { contains: search, mode: "insensitive" } },
          { folder: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(provider && { provider }),
      ...(resourceType && { resourceType }),
      ...(folder && { folder }),
      ...(params.isArchived !== undefined ? { isArchived: params.isArchived } : {}),
    };
    let orderBy: Prisma.MediaOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    if (sort === "resourceType_asc") orderBy = { resourceType: "asc" };
    if (sort === "resourceType_desc") orderBy = { resourceType: "desc" };
    if (sort === "filename_asc") orderBy = { originalFilename: "asc" };
    if (sort === "filename_desc") orderBy = { originalFilename: "desc" };
    const [data, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          createdBy: { select: auditUserSelect },
          updatedBy: { select: auditUserSelect },
          attachments: {
            select: attachmentSelect,
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
        },
      }),
      prisma.media.count({ where }),
    ]);
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },
  async findById(id: string) {
    return prisma.media.findUnique({
      where: { id },
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
        attachments: {
          select: attachmentSelect,
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });
  },
  async create(data: Prisma.MediaCreateInput) {
    const created = await prisma.media.create({
      data,
    });
    return this.findById(created.id) as any;
  },
  async update(id: string, data: Prisma.MediaUpdateInput) {
    await prisma.media.update({
      where: { id },
      data,
    });
    return this.findById(id) as any;
  },
  async archive(id: string, updatedById?: string | null) {
    await prisma.media.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
        ...(updatedById ? { updatedBy: { connect: { id: updatedById } } } : {}),
      },
    });
    return this.findById(id) as any;
  },
  async updateAltText(mediaId: string, altText: string, updatedById?: string | null) {
    return prisma.media.update({
      where: { id: mediaId },
      data: {
        altText,
        ...(updatedById ? { updatedBy: { connect: { id: updatedById } } } : {}),
      },
    });
  },
  async attach(mediaId: string, data: MediaAttachmentCreateInput) {
    return prisma.mediaAttachment.create({
      data: {
        mediaId,
        entityType: data.entityType,
        entityId: data.entityId,
        fieldName: data.fieldName ?? "default",
        usageType: data.usageType,
        sortOrder: data.sortOrder ?? 0,
        isPrimary: data.isPrimary ?? false,
      },
      select: attachmentSelect,
    });
  },
  async findByUrls(urls: string[]) {
    if (!urls.length) return [];
    return prisma.media.findMany({
      where: { url: { in: urls } },
      select: { id: true, url: true },
    });
  },
  async deleteAttachmentsByEntityAndFields(
    entityType: MediaEntityType,
    entityId: string,
    fieldNames: string[]
  ) {
    if (!fieldNames.length) return { count: 0 };
    return prisma.mediaAttachment.deleteMany({
      where: { entityType, entityId, fieldName: { in: fieldNames } },
    });
  },
  async attachMany(
    items: Array<{
      mediaId: string;
      entityType: MediaEntityType;
      entityId: string;
      fieldName: string;
      usageType: MediaUsageType;
      sortOrder: number;
      isPrimary: boolean;
      altText?: string | null;
    }>
  ) {
    if (!items.length) return [];
    return Promise.all(
      items.map((item) =>
        prisma.mediaAttachment.create({
          data: {
            mediaId: item.mediaId,
            entityType: item.entityType,
            entityId: item.entityId,
            fieldName: item.fieldName,
            usageType: item.usageType,
            sortOrder: item.sortOrder,
            isPrimary: item.isPrimary,
            ...(item.altText ? { altText: item.altText } : {}),
          },
          select: attachmentSelect,
        })
      )
    );
  },
  async detach(attachmentId: string) {
    return prisma.mediaAttachment.delete({
      where: { id: attachmentId },
      select: attachmentSelect,
    });
  },
  async delete(id: string) {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return { deleted: false };
    try {
      await deleteCloudinaryAsset(
        media.providerAssetId,
        media.resourceType as "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" | "OTHER"
      );
    } catch {}
    await prisma.media.delete({ where: { id } });
    return { deleted: true };
  },
};
