import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import { SpecializationQueryValidated } from "../types/specialization.types";

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

const specializationInclude = {
  services: { select: { id: true, title: true, slug: true } },
  createdBy: { select: auditUserSelect },
  updatedBy: { select: auditUserSelect },
} as const;

export const specializationRepository = {
  async findAll(params: SpecializationQueryValidated) {
    const { page = 1, limit = 10, search, sort, status, isFeatured } = params;
    const where: Prisma.SpecializationWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status !== undefined && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
    };
    let orderBy: Prisma.SpecializationOrderByWithRelationInput = {
      order: "asc",
    };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    if (sort === "order_asc") orderBy = { order: "asc" };
    const [data, total] = await Promise.all([
      prisma.specialization.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: specializationInclude,
      }),
      prisma.specialization.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findById(id: string) {
    return prisma.specialization.findUnique({
      where: { id },
      include: specializationInclude,
    });
  },
  async findPublished() {
    return prisma.specialization.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      include: specializationInclude,
    });
  },
  async create(data: Prisma.SpecializationCreateInput) {
    return prisma.specialization.create({
      data,
      include: specializationInclude,
    });
  },
  async update(id: string, data: Prisma.SpecializationUpdateInput) {
    return prisma.specialization.update({
      where: { id },
      data,
      include: specializationInclude,
    });
  },
  async softDelete(id: string) {
    return prisma.specialization.update({
      where: { id },
      data: {
        status: "ARCHIVED",
        archivedAt: new Date(),
        publishedAt: null,
      },
    });
  },
  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "specialization", id);
      return tx.specialization.delete({ where: { id } });
    });
  },
};
