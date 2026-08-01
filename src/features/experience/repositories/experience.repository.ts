import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { ExperienceQueryValidated } from "../types/experience.types";

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

const experienceInclude = {
  createdBy: { select: auditUserSelect },
  updatedBy: { select: auditUserSelect },
  projects: { select: { id: true, title: true, slug: true } },
  technologies: { select: { id: true, title: true } },
} as const;

export const experienceRepository = {
  async findAll(params: ExperienceQueryValidated) {
    const {
      page = 1,
      limit = 10,
      search,
      sort,
      status,
      isFeatured,
    } = params;

    const where: Prisma.ExperienceWhereInput = {
      ...(search && {
        OR: [
          { companyName: { contains: search, mode: "insensitive" } },
          { position: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
    };

    let orderBy: Prisma.ExperienceOrderByWithRelationInput = { startDate: "desc" };
    if (sort === "startDate_asc") orderBy = { startDate: "asc" };
    if (sort === "order_asc") orderBy = { order: "asc" };
    if (sort === "order_desc") orderBy = { order: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };

    const [data, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: experienceInclude,
      }),
      prisma.experience.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    return prisma.experience.findUnique({
      where: { id },
      include: experienceInclude,
    });
  },

  async findPublicById(id: string) {
    return prisma.experience.findFirst({
      where: { id, status: "PUBLISHED" },
      include: experienceInclude,
    });
  },

  async findPublished(params: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = params;
    const where: Prisma.ExperienceWhereInput = {
      status: "PUBLISHED",
      ...(search && {
        OR: [
          { companyName: { contains: search, mode: "insensitive" } },
          { position: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ order: "asc" }, { startDate: "desc" }],
        include: experienceInclude,
      }),
      prisma.experience.count({ where }),
    ]);

    return { data, total, page, limit };
  },

  async create(data: Prisma.ExperienceCreateInput, projects?: string[], technologies?: string[]) {
    return prisma.experience.create({
      data: {
        ...data,
        projects: projects ? { connect: projects.map((id) => ({ id })) } : undefined,
        technologies: technologies ? { connect: technologies.map((id) => ({ id })) } : undefined,
      },
      include: experienceInclude,
    });
  },

  async update(id: string, data: Prisma.ExperienceUpdateInput, projects?: string[], technologies?: string[]) {
    return prisma.experience.update({
      where: { id },
      data: {
        ...data,
        projects: projects ? { set: projects.map((id) => ({ id })) } : undefined,
        technologies: technologies ? { set: technologies.map((id) => ({ id })) } : undefined,
      },
      include: experienceInclude,
    });
  },

  async softDelete(id: string) {
    return prisma.experience.update({
      where: { id },
      data: { archivedAt: new Date(), status: "ARCHIVED" },
    });
  },

  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      const { cleanupMediaAttachmentsForEntity } = await import("@/shared/utils/media-cleanup");
      await cleanupMediaAttachmentsForEntity(tx, "experience", id);
      return tx.experience.delete({ where: { id } });
    });
  },
};
