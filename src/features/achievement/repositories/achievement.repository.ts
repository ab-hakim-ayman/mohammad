import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import { AchievementQueryValidated } from "../types/achievement.types";

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

export const achievementRepository = {
  async findAll(params: AchievementQueryValidated) {
    const { page = 1, limit = 10, search, sort, status, type, isFeatured } = params;
    const where: Prisma.AchievementWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { issuer: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status !== undefined && { status }),
      ...(type !== undefined && { type }),
      ...(isFeatured !== undefined && { isFeatured }),
    };
    let orderBy: Prisma.AchievementOrderByWithRelationInput = { order: "asc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "order_desc") orderBy = { order: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    const [data, total] = await Promise.all([
      prisma.achievement.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.achievement.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    return prisma.achievement.findUnique({
      where: { id },
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },

  async findBySlug(slug: string) {
    return prisma.achievement.findUnique({
      where: { slug },
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },

  async findPublished(limit?: number) {
    return prisma.achievement.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      take: limit,
    });
  },

  async create(data: Prisma.AchievementCreateInput) {
    return prisma.achievement.create({
      data,
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },

  async update(id: string, data: Prisma.AchievementUpdateInput) {
    return prisma.achievement.update({
      where: { id },
      data,
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },

  async softDelete(id: string) {
    return prisma.achievement.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });
  },

  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "achievement", id);
      return tx.achievement.delete({ where: { id } });
    });
  },
};
