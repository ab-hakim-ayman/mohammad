import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { AboutQueryValidated } from "../types/about.types";

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

export const aboutRepository = {
  async findAll(params: AboutQueryValidated) {
    const { page = 1, limit = 10, search, sort, status } = params;
    const where: Prisma.AboutWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status !== undefined && { status }),
    };
    let orderBy: Prisma.AboutOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };

    const [data, total] = await Promise.all([
      prisma.about.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.about.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    return prisma.about.findUnique({
      where: { id },
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },

  async findByKey(key: string) {
    return prisma.about.findUnique({
      where: { key },
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },

  async findPublished(key: string = "main") {
    return prisma.about
      .findUnique({
        where: { key },
        select: {
          id: true,
          key: true,
          title: true,
          shortDesc: true,
          contentJson: true,
          heroImage: true,
          galleryImages: true,
          ogImage: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .then((about) => (about && about.status === "PUBLISHED" ? about : null));
  },

  async create(data: Prisma.AboutCreateInput) {
    return prisma.about.create({
      data,
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },

  async update(id: string, data: Prisma.AboutUpdateInput) {
    return prisma.about.update({
      where: { id },
      data,
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },

  async softDelete(id: string) {
    return prisma.about.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });
  },

  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "about", id);
      return tx.about.delete({ where: { id } });
    });
  },
};
