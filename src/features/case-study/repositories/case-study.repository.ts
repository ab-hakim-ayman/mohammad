import prisma from "@/core/server/prisma";
import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import { Prisma } from "@prisma/client";
import { CaseStudyQueryValidated } from "../types/case-study.types";

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

const caseStudyInclude = {
  createdBy: { select: auditUserSelect },
  updatedBy: { select: auditUserSelect },
  categories: { select: { id: true, title: true, slug: true } },
  tags: { select: { id: true, title: true, slug: true } },
  project: {
    select: {
      id: true,
      title: true,
      slug: true,
      client: { select: { id: true, title: true } },
      industry: { select: { id: true, title: true } },
      technologies: { select: { id: true, title: true, logo: true } },
      services: { select: { id: true, title: true, slug: true } },
    },
  },
  testimonials: { select: { id: true, authorName: true, message: true } },
} as const;

const caseStudyPublicInclude = {
  categories: {
    where: { status: "PUBLISHED" as const },
    select: { id: true, title: true, slug: true },
  },
  tags: {
    where: { status: "PUBLISHED" as const },
    select: { id: true, title: true, slug: true },
  },
  project: {
    select: {
      id: true,
      title: true,
      slug: true,
      shortDesc: true,
      heroImage: true,
      cardImage: true,
      startDate: true,
      endDate: true,
      client: { select: { id: true, title: true, status: true } },
      industry: { select: { id: true, title: true, status: true, slug: true } },
      technologies: {
        where: { status: "PUBLISHED" as const },
        select: { id: true, title: true, logo: true },
      },
      services: {
        where: { status: "PUBLISHED" as const },
        select: { id: true, title: true, slug: true, shortDesc: true, icon: true },
      },
    },
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
} as const;

export const caseStudyRepository = {
  async findAll(params: CaseStudyQueryValidated) {
    const { page = 1, limit = 10, search, sort, status, isFeatured } = params;

    const where: Prisma.CaseStudyWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
    };

    let orderBy: Prisma.CaseStudyOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "featured_desc") orderBy = { isFeatured: "desc" };

    const [data, total] = await Promise.all([
      prisma.caseStudy.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: caseStudyInclude,
      }),
      prisma.caseStudy.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    return prisma.caseStudy.findUnique({
      where: { id },
      include: caseStudyInclude,
    });
  },

  async findBySlug(slug: string) {
    return prisma.caseStudy.findUnique({
      where: { slug },
      include: caseStudyInclude,
    });
  },

  async findPublicBySlug(slug: string) {
    const caseStudy = await prisma.caseStudy.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
        project: { status: "PUBLISHED" },
      },
      include: caseStudyPublicInclude,
    });
    return caseStudy;
  },

  async findPublished(params: {
    page?: number;
    limit?: number;
    search?: string;
    featured?: boolean;
  }) {
    const { page = 1, limit = 10, search, featured } = params;

    const where: Prisma.CaseStudyWhereInput = {
      status: "PUBLISHED",
      project: { status: "PUBLISHED" },
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(featured !== undefined && { isFeatured: featured }),
    };

    const [data, total] = await Promise.all([
      prisma.caseStudy.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: caseStudyPublicInclude,
      }),
      prisma.caseStudy.count({ where }),
    ]);

    return { data, total, page, limit };
  },

  async create(data: Prisma.CaseStudyCreateInput) {
    return prisma.caseStudy.create({
      data,
      include: caseStudyInclude,
    });
  },

  async update(id: string, data: Prisma.CaseStudyUpdateInput) {
    return prisma.caseStudy.update({
      where: { id },
      data,
      include: caseStudyInclude,
    });
  },

  async softDelete(id: string) {
    return prisma.caseStudy.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });
  },

  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "case-study", id);
      return tx.caseStudy.delete({ where: { id } });
    });
  },
};
