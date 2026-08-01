import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import { ServiceQueryValidated } from "../types/service.types";

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

const serviceInclude = {
  createdBy: { select: auditUserSelect },
  updatedBy: { select: auditUserSelect },
  industries: { select: { id: true, title: true, slug: true } },
  technologies: { select: { id: true, title: true } },
  projects: { select: { id: true, title: true, slug: true } },
  faqs: { select: { id: true, question: true } },
  testimonials: { select: { id: true, authorName: true } },
  categories: { select: { id: true, title: true, slug: true } },
  tags: { select: { id: true, title: true, slug: true } },
  specializations: { select: { id: true, title: true, slug: true } },
} as const;

const servicePublicInclude = {
  industries: {
    where: { status: "PUBLISHED" as const },
    select: { id: true, title: true, slug: true, shortDesc: true, icon: true },
  },
  technologies: {
    where: { status: "PUBLISHED" as const },
    select: { id: true, title: true, logo: true },
  },
  projects: {
    where: { status: "PUBLISHED" as const },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDesc: true,
      heroImage: true,
      isFeatured: true,
      industry: { select: { id: true, title: true, slug: true } },
      technologies: { where: { status: "PUBLISHED" as const }, select: { id: true, title: true } },
      caseStudy: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          shortDesc: true,
          cardImage: true,
        },
      },
    },
  },
  faqs: {
    where: { status: "PUBLISHED" as const },
    select: { id: true, question: true, answer: true },
  },
  testimonials: {
    where: { status: "PUBLISHED" as const },
    select: {
      id: true,
      authorName: true,
      authorPosition: true,
      authorImage: true,
      message: true,
      rating: true,
    },
  },
  categories: {
    where: { status: "PUBLISHED" as const },
    select: { id: true, title: true, slug: true },
  },
  tags: {
    where: { status: "PUBLISHED" as const },
    select: { id: true, title: true, slug: true },
  },
  specializations: {
    where: { status: "PUBLISHED" as const },
    select: { id: true, title: true, slug: true, icon: true, shortDesc: true },
  },
} as const;

export const serviceRepository = {
  async findAll(params: ServiceQueryValidated) {
    const { page = 1, limit = 10, search, sort, status, isFeatured } = params;

    const where: Prisma.ServiceWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
    };

    let orderBy: Prisma.ServiceOrderByWithRelationInput = { order: "asc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "order_desc") orderBy = { order: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };

    const [data, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: serviceInclude,
      }),
      prisma.service.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    return prisma.service.findUnique({
      where: { id },
      include: serviceInclude,
    });
  },

  async findBySlug(slug: string) {
    return prisma.service.findUnique({
      where: { slug },
      include: serviceInclude,
    });
  },

  async findPublicBySlug(slug: string) {
    const service = await prisma.service.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: servicePublicInclude,
    });
    return service;
  },

  async findPublished(params: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = params;

    const where: Prisma.ServiceWhereInput = {
      status: "PUBLISHED",
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { order: "asc" },
        include: servicePublicInclude,
      }),
      prisma.service.count({ where }),
    ]);

    return { data, total, page, limit };
  },

  async create(data: Prisma.ServiceCreateInput) {
    return prisma.service.create({
      data,
      include: serviceInclude,
    });
  },

  async update(id: string, data: Prisma.ServiceUpdateInput) {
    return prisma.service.update({
      where: { id },
      data,
      include: serviceInclude,
    });
  },

  async softDelete(id: string) {
    return prisma.service.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });
  },

  async delete(id: string) {
    await prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "service", id);
      await tx.service.delete({ where: { id } });
    });
    return { deleted: true };
  },
};
