import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { IndustryQueryValidated } from "../types/industry.types";

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

const industryPublicInclude = {
  services: {
    where: { status: "PUBLISHED" as const },
    select: { id: true, title: true, slug: true, shortDesc: true, icon: true, order: true },
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
      order: true,
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
      client: {
        select: { title: true },
      },
      technologies: {
        where: { status: "PUBLISHED" as const },
        select: { title: true },
      },
    },
    orderBy: [{ isFeatured: "desc" as const }, { order: "asc" as const }],
  },
  _count: {
    select: {
      services: { where: { status: "PUBLISHED" as const } },
      projects: { where: { status: "PUBLISHED" as const } },
    },
  },
};

const industryInclude = {
  _count: { select: { services: true, projects: true } },
  createdBy: { select: auditUserSelect },
  updatedBy: { select: auditUserSelect },
} as const;

export const industryRepository = {
  async findAll(params: IndustryQueryValidated) {
    const { page = 1, limit = 10, search, sort, status, isFeatured } = params;
    const where: Prisma.IndustryWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
    };
    let orderBy: Prisma.IndustryOrderByWithRelationInput = { order: "asc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "order_desc") orderBy = { order: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    const [data, total] = await Promise.all([
      prisma.industry.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: industryInclude,
      }),
      prisma.industry.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findById(id: string) {
    return prisma.industry.findUnique({
      where: { id },
      include: industryInclude,
    });
  },
  async findBySlug(slug: string) {
    return prisma.industry.findUnique({
      where: { slug },
      include: industryInclude,
    });
  },
  async findPublicBySlug(slug: string) {
    const industry = await prisma.industry.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: industryPublicInclude,
    });
    return industry;
  },
  async findByTitle(title: string) {
    return prisma.industry.findFirst({ where: { title } });
  },
  async findPublished(limit?: number) {
    const data = await prisma.industry.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      take: limit,
      include: industryPublicInclude,
    });
    return data;
  },
  async create(data: Prisma.IndustryCreateInput) {
    return prisma.industry.create({ data, include: industryInclude });
  },
  async update(id: string, data: Prisma.IndustryUpdateInput) {
    return prisma.industry.update({ where: { id }, data, include: industryInclude });
  },
  async softDelete(id: string) {
    return prisma.industry.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });
  },
  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "industry", id);
      return tx.industry.delete({ where: { id } });
    });
  },
};
