import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { HeroQueryValidated } from "../types/hero.types";

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
export const heroRepository = {
  async findAll(params: HeroQueryValidated) {
    const { page = 1, limit = 10, search, sort, status, isActive } = params;
    const where: Prisma.HeroWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status !== undefined && { status }),
      ...(isActive !== undefined && { isActive }),
    };
    let orderBy: Prisma.HeroOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    const [data, total] = await Promise.all([
      prisma.hero.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          createdBy: { select: auditUserSelect },
          updatedBy: { select: auditUserSelect },
        },
      }),
      prisma.hero.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findById(id: string) {
    return prisma.hero.findUnique({
      where: { id },
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },
  async findActive() {
    return prisma.hero.findFirst({
      where: { status: "PUBLISHED", isActive: true },
    });
  },
  async create(data: Prisma.HeroCreateInput) {
    if (data.isActive) {
      return prisma.$transaction(async (tx) => {
        await tx.hero.updateMany({
          where: { isActive: true },
          data: { isActive: false },
        });
        return tx.hero.create({
          data,
          include: {
            createdBy: { select: auditUserSelect },
            updatedBy: { select: auditUserSelect },
          },
        });
      });
    }
    return prisma.hero.create({
      data,
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },
  async update(id: string, data: Prisma.HeroUpdateInput) {
    if (data.isActive) {
      return prisma.$transaction(async (tx) => {
        await tx.hero.updateMany({
          where: { isActive: true, id: { not: id } },
          data: { isActive: false },
        });
        return tx.hero.update({
          where: { id },
          data,
          include: {
            createdBy: { select: auditUserSelect },
            updatedBy: { select: auditUserSelect },
          },
        });
      });
    }
    return prisma.hero.update({
      where: { id },
      data,
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },
  async softDelete(id: string) {
    return prisma.hero.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date(), isActive: false },
    });
  },
  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "hero", id);
      return tx.hero.delete({ where: { id } });
    });
  },
};
