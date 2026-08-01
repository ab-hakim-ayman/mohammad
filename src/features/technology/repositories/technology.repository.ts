import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import { TechnologyQueryValidated } from "../types/technology.types";

const technologyInclude = {
  _count: { select: { projects: true } },
  categories: { select: { id: true, title: true } },
  tags: { select: { id: true, title: true } },
  services: { select: { id: true, title: true } },
  projects: { select: { id: true, title: true, slug: true } },
  createdBy: { select: { id: true, name: true, email: true } },
  updatedBy: { select: { id: true, name: true, email: true } },
} as const;

export const technologyRepository = {
  async findAll(params: TechnologyQueryValidated) {
    const { page = 1, limit = 10, search, sort, status } = params;
    const where: Prisma.TechnologyWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { categories: { some: { title: { contains: search, mode: "insensitive" } } } },
        ],
      }),
      ...(status !== undefined && { status }),
    };
    let orderBy: Prisma.TechnologyOrderByWithRelationInput = { order: "asc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };

    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    const [data, total] = await Promise.all([
      prisma.technology.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: technologyInclude,
      }),
      prisma.technology.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findById(id: string) {
    const technology = await prisma.technology.findUnique({
      where: { id },
      include: technologyInclude,
    });
    return technology;
  },
  async findPublished(category?: string, limit?: number) {
    const where: Prisma.TechnologyWhereInput = {
      status: "PUBLISHED",
      ...(category && { categories: { some: { title: category } } }),
    };
    const technologies = await prisma.technology.findMany({
      where,
      orderBy: { order: "asc" },
      take: limit,
      include: technologyInclude,
    });
    return technologies;
  },
  async create(data: Prisma.TechnologyCreateInput) {
    return prisma.technology.create({ data });
  },
  async update(id: string, data: Prisma.TechnologyUpdateInput) {
    return prisma.technology.update({ where: { id }, data });
  },
  async softDelete(id: string) {
    return prisma.technology.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });
  },
  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "technology", id);
      return tx.technology.delete({ where: { id } });
    });
  },
};
