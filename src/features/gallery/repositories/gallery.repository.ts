import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import { GalleryQueryValidated } from "../types/gallery.types";

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

const galleryInclude = {
  items: { orderBy: { order: "asc" } },
  createdBy: { select: auditUserSelect },
  updatedBy: { select: auditUserSelect },
} as const;

export const galleryRepository = {
  async findAll(params: GalleryQueryValidated) {
    const { page = 1, limit = 10, search, sort, status } = params;
    const where: Prisma.GalleryWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status !== undefined && { status }),
    };
    let orderBy: Prisma.GalleryOrderByWithRelationInput = { order: "asc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "order_desc") orderBy = { order: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    const [data, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: galleryInclude,
      }),
      prisma.gallery.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    return prisma.gallery.findUnique({
      where: { id },
      include: galleryInclude,
    });
  },

  async findBySlug(slug: string) {
    return prisma.gallery.findUnique({
      where: { slug },
      include: galleryInclude,
    });
  },

  async findPublishedBySlug(slug: string) {
    return prisma.gallery.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        items: {
          where: { status: "PUBLISHED" },
          orderBy: { order: "asc" },
        },
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },

  async findPublished(limit?: number) {
    return prisma.gallery.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      take: limit,
      include: {
        items: { orderBy: { order: "asc" }, where: { status: "PUBLISHED" } },
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },

  async create(data: Prisma.GalleryCreateInput) {
    return prisma.gallery.create({
      data,
      include: galleryInclude,
    });
  },

  async update(id: string, data: Prisma.GalleryUpdateInput) {
    return prisma.gallery.update({
      where: { id },
      data,
      include: galleryInclude,
    });
  },

  async softDelete(id: string) {
    return prisma.gallery.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date(), publishedAt: null },
    });
  },

  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "gallery", id);
      return tx.gallery.delete({ where: { id } });
    });
  },

  async addItem(galleryId: string, data: Prisma.GalleryItemCreateInput) {
    return prisma.galleryItem.create({
      data: { ...data, gallery: { connect: { id: galleryId } } },
    });
  },

  async findItemById(itemId: string) {
    return prisma.galleryItem.findUnique({ where: { id: itemId } });
  },

  async updateItem(itemId: string, data: Prisma.GalleryItemUpdateInput) {
    return prisma.galleryItem.update({ where: { id: itemId }, data });
  },

  async deleteItem(itemId: string) {
    return prisma.galleryItem.delete({ where: { id: itemId } });
  },
};
