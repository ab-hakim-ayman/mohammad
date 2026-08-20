import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import { SkillQueryValidated } from "../types/skill.types";

const skillInclude = {
  categories: { select: { id: true, title: true } },
  tags: { select: { id: true, title: true } },
  profiles: { select: { id: true, fullName: true, avatar: true } },
  createdBy: { select: { id: true, name: true, email: true } },
  updatedBy: { select: { id: true, name: true, email: true } },
} as const;

export const skillRepository = {
  async findAll(params: SkillQueryValidated) {
    const { page = 1, limit = 10, search, sort, status } = params;
    const where: Prisma.SkillWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { categories: { some: { title: { contains: search, mode: "insensitive" } } } },
        ],
      }),
      ...(status !== undefined && { status }),
    };
    let orderBy: Prisma.SkillOrderByWithRelationInput = { order: "asc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    const [data, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: skillInclude,
      }),
      prisma.skill.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findById(id: string) {
    const skill = await prisma.skill.findUnique({ where: { id }, include: skillInclude });
    return skill;
  },
  async findPublished(category?: string, limit = 100) {
    const where: Prisma.SkillWhereInput = {
      status: "PUBLISHED",
      ...(category && { categories: { some: { title: category } } }),
    };
    const skills = await prisma.skill.findMany({
      where,
      orderBy: { order: "asc" },
      take: Math.min(limit, 100),
      include: skillInclude,
    });
    return skills;
  },
  async findDistinctCategories() {
    const result = await prisma.category.findMany({
      where: { skills: { some: {} } },
      select: { title: true },
      orderBy: { title: "asc" },
    });
    return result.map((r) => r.title);
  },
  async create(data: Prisma.SkillCreateInput) {
    return prisma.skill.create({ data });
  },
  async update(id: string, data: Prisma.SkillUpdateInput) {
    return prisma.skill.update({ where: { id }, data });
  },
  async softDelete(id: string) {
    return prisma.skill.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date(), publishedAt: null },
    });
  },
  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "skill", id);
      return tx.skill.delete({ where: { id } });
    });
  },
};
