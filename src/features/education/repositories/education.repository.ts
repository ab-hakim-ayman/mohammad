import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { EducationQueryValidated } from "../types/education.types";

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

const educationInclude = {
  createdBy: { select: auditUserSelect },
  updatedBy: { select: auditUserSelect },
} as const;

export const educationRepository = {
  async findAll(params: EducationQueryValidated) {
    const {
      page = 1,
      limit = 10,
      search,
      sort,
      status,
      isFeatured,
    } = params;

    const where: Prisma.EducationWhereInput = {
      ...(search && {
        OR: [
          { institution: { contains: search, mode: "insensitive" } },
          { degree: { contains: search, mode: "insensitive" } },
          { fieldOfStudy: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
    };

    let orderBy: Prisma.EducationOrderByWithRelationInput = { startDate: "desc" };
    if (sort === "startDate_asc") orderBy = { startDate: "asc" };
    if (sort === "order_asc") orderBy = { order: "asc" };
    if (sort === "order_desc") orderBy = { order: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };

    const [data, total] = await Promise.all([
      prisma.education.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: educationInclude,
      }),
      prisma.education.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    return prisma.education.findUnique({
      where: { id },
      include: educationInclude,
    });
  },

  async findPublicById(id: string) {
    return prisma.education.findFirst({
      where: { id, status: "PUBLISHED" },
      include: educationInclude,
    });
  },

  async findPublished(params: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = params;
    const where: Prisma.EducationWhereInput = {
      status: "PUBLISHED",
      ...(search && {
        OR: [
          { institution: { contains: search, mode: "insensitive" } },
          { degree: { contains: search, mode: "insensitive" } },
          { fieldOfStudy: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      prisma.education.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ order: "asc" }, { startDate: "desc" }],
        include: educationInclude,
      }),
      prisma.education.count({ where }),
    ]);

    return { data, total, page, limit };
  },

  async create(data: Prisma.EducationCreateInput) {
    return prisma.education.create({
      data,
      include: educationInclude,
    });
  },

  async update(id: string, data: Prisma.EducationUpdateInput) {
    return prisma.education.update({
      where: { id },
      data,
      include: educationInclude,
    });
  },

  async softDelete(id: string) {
    return prisma.education.update({
      where: { id },
      data: { archivedAt: new Date(), status: "ARCHIVED" },
    });
  },

  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      const { cleanupMediaAttachmentsForEntity } = await import("@/shared/utils/media-cleanup");
      await cleanupMediaAttachmentsForEntity(tx, "education", id);
      return tx.education.delete({ where: { id } });
    });
  },
};
