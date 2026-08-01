import prisma from "@/core/server/prisma";
import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import { Prisma } from "@prisma/client";
import { CategoryQueryValidated } from "../types/category.types";

const auditSelect = {
  createdBy: {
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      status: true,
      profile: { select: { fullName: true, headline: true, avatar: true, designation: true } },
    },
  },
  updatedBy: {
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      status: true,
      profile: { select: { fullName: true, headline: true, avatar: true, designation: true } },
    },
  },
} as const;

export const categoryRepository = {
  async findAll(params: CategoryQueryValidated) {
    const { page = 1, limit = 10, search, sort, status, scope } = params;
    const where: Prisma.CategoryWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status !== undefined && { status }),
      ...(scope !== undefined && { scope }),
    };
    let orderBy: Prisma.CategoryOrderByWithRelationInput = { order: "asc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "order_desc") orderBy = { order: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    const [data, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          blogs: { select: { id: true, title: true, slug: true } },
          projects: { select: { id: true, title: true, slug: true } },
          services: { select: { id: true, title: true, slug: true } },
          caseStudies: { select: { id: true, title: true, slug: true } },
          technologies: { select: { id: true, title: true } },
          skills: { select: { id: true, title: true } },
          faqs: { select: { id: true, question: true } },
          ...auditSelect,
        },
      }),
      prisma.category.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        blogs: { select: { id: true, title: true, slug: true } },
        projects: { select: { id: true, title: true, slug: true } },
        services: { select: { id: true, title: true, slug: true } },
        caseStudies: { select: { id: true, title: true, slug: true } },
        technologies: { select: { id: true, title: true } },
        skills: { select: { id: true, title: true } },
        faqs: { select: { id: true, question: true } },
        ...auditSelect,
      },
    });
    return category;
  },
  async findBySlug(slug: string) {
    const category = await prisma.category.findFirst({
      where: { slug },
      include: {
        blogs: { select: { id: true, title: true, slug: true } },
        projects: { select: { id: true, title: true, slug: true } },
        services: { select: { id: true, title: true, slug: true } },
        caseStudies: { select: { id: true, title: true, slug: true } },
        technologies: { select: { id: true, title: true } },
        skills: { select: { id: true, title: true } },
        faqs: { select: { id: true, question: true } },
        ...auditSelect,
      },
    });
    return category;
  },
  async findByTitle(title: string) {
    const category = await prisma.category.findFirst({ where: { title }, include: auditSelect });
    return category;
  },
  async findPublished(limit?: number) {
    const categories = await prisma.category.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      take: limit,
      include: auditSelect,
    });
    return categories;
  },
  async create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data });
  },
  async update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({ where: { id }, data });
  },
  async softDelete(id: string) {
    return prisma.category.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date(), publishedAt: null },
    });
  },

  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "category", id);
      return tx.category.delete({ where: { id } });
    });
  },
};
