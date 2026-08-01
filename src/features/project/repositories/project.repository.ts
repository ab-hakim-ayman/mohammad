import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import { ProjectQueryValidated } from "../types/project.types";

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

const projectInclude = {
  createdBy: { select: auditUserSelect },
  updatedBy: { select: auditUserSelect },
  client: { select: { id: true, title: true } },
  industry: { select: { id: true, title: true, slug: true } },
  technologies: { select: { id: true, title: true, logo: true } },
  services: { select: { id: true, title: true, slug: true } },
  categories: { select: { id: true, title: true, slug: true } },
  tags: { select: { id: true, title: true, slug: true } },
  caseStudy: { select: { id: true, title: true, slug: true, status: true } },
} as const;

const projectPublicInclude = {
  client: {
    select: { id: true, title: true, status: true },
  },
  industry: {
    select: { id: true, title: true, slug: true, status: true },
  },
  technologies: {
    where: { status: "PUBLISHED" as const },
    select: { id: true, title: true, logo: true },
  },
  services: {
    where: { status: "PUBLISHED" },
    select: { id: true, title: true, slug: true },
  },
  categories: { select: { id: true, title: true, slug: true } },
  caseStudy: {
    select: { id: true, title: true, slug: true, status: true },
  },
} as const;

export const projectRepository = {
  async findAll(params: ProjectQueryValidated) {
    const {
      page = 1,
      limit = 10,
      search,
      sort,
      status,
      isFeatured,
      technology,
      clientId,
      industryId,
      serviceId,
    } = params;

    const where: Prisma.ProjectWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(clientId && { clientId }),
      ...(industryId && { industryId }),
      ...(technology && { technologies: { some: { id: technology } } }),
      ...(serviceId && { services: { some: { id: serviceId } } }),
    };

    let orderBy: Prisma.ProjectOrderByWithRelationInput = { order: "asc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "order_asc") orderBy = { order: "asc" };
    if (sort === "startDate_desc") orderBy = { startDate: "desc" };

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: projectInclude,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: projectInclude,
    });
    return project;
  },

  async findBySlug(slug: string) {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: projectInclude,
    });
    return project;
  },

  async findPublicBySlug(slug: string) {
    const project = await prisma.project.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: projectPublicInclude,
    });
    if (!project) return null;
    return {
      ...project,
      client: project.client?.status === "PUBLISHED" ? project.client : null,
      industry: project.industry?.status === "PUBLISHED" ? project.industry : null,
      caseStudy: project.caseStudy?.status === "PUBLISHED" ? project.caseStudy : null,
    };
  },

  async findPublished(params: {
    page?: number;
    limit?: number;
    search?: string;
    technology?: string;
    featured?: boolean;
    industry?: string;
  }) {
    const { page = 1, limit = 10, search, technology, featured, industry } = params;

    const where: Prisma.ProjectWhereInput = {
      status: "PUBLISHED",
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(technology && { technologies: { some: { id: technology } } }),
      ...(industry && { industry: { slug: industry } }),
      ...(featured !== undefined && { isFeatured: featured }),
    };

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { order: "asc" },
        include: projectPublicInclude,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      data: data.map((project) => ({
        ...project,
        client: project.client?.status === "PUBLISHED" ? project.client : null,
        industry: project.industry?.status === "PUBLISHED" ? project.industry : null,
        caseStudy: project.caseStudy?.status === "PUBLISHED" ? project.caseStudy : null,
      })),
      total,
      page,
      limit,
    };
  },

  async create(data: Prisma.ProjectCreateInput) {
    return prisma.project.create({
      data,
      include: projectInclude,
    });
  },

  async update(id: string, data: Prisma.ProjectUpdateInput) {
    return prisma.project.update({
      where: { id },
      data,
      include: projectInclude,
    });
  },

  async softDelete(id: string) {
    return prisma.project.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });
  },

  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "project", id);
      return tx.project.delete({ where: { id } });
    });
  },
};
