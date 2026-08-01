import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { FaqQueryValidated } from "../types/faq.types";

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

const faqInclude = {
  categories: { select: { id: true, title: true, slug: true } },
  events: { select: { id: true, title: true, slug: true } },
  services: { select: { id: true, title: true, slug: true } },
  createdBy: { select: auditUserSelect },
  updatedBy: { select: auditUserSelect },
} as const;

export const faqRepository = {
  async findAll(params: FaqQueryValidated) {
    const { page = 1, limit = 10, search, sort, status, isFeatured } = params;
    const where: Prisma.FaqWhereInput = {
      ...(search && {
        OR: [
          { question: { contains: search, mode: "insensitive" } },
          { answer: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status !== undefined && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
    };
    let orderBy: Prisma.FaqOrderByWithRelationInput = { order: "asc" };
    if (sort === "question_asc") orderBy = { question: "asc" };
    if (sort === "question_desc") orderBy = { question: "desc" };
    if (sort === "order_desc") orderBy = { order: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    const [data, total] = await Promise.all([
      prisma.faq.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: faqInclude,
      }),
      prisma.faq.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    return prisma.faq.findUnique({
      where: { id },
      include: faqInclude,
    });
  },

  async findPublished(limit?: number, category?: string) {
    return prisma.faq.findMany({
      where: {
        status: "PUBLISHED",
        ...(category ? { categories: { some: { slug: category } } } : {}),
      },
      orderBy: { order: "asc" },
      take: limit,
      include: faqInclude,
    });
  },

  async create(data: Prisma.FaqCreateInput) {
    return prisma.faq.create({ data, include: faqInclude });
  },

  async update(id: string, data: Prisma.FaqUpdateInput) {
    return prisma.faq.update({ where: { id }, data, include: faqInclude });
  },

  async softDelete(id: string) {
    return prisma.faq.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });
  },
  async hardDelete(id: string) {
    return prisma.faq.delete({ where: { id } });
  },
};
