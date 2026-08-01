import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { ClientQueryValidated } from "../types/client.types";

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

export const clientRepository = {
  async findAll(params: ClientQueryValidated) {
    const { page = 1, limit = 10, search, sort, status, isFeatured } = params;
    const where: Prisma.ClientWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { website: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status !== undefined && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
    };
    let orderBy: Prisma.ClientOrderByWithRelationInput = { order: "asc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "order_desc") orderBy = { order: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    const [data, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: { createdBy: { select: auditUserSelect }, updatedBy: { select: auditUserSelect } },
      }),
      prisma.client.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: { createdBy: { select: auditUserSelect }, updatedBy: { select: auditUserSelect } },
    });
  },
  async findPublished(limit?: number) {
    return prisma.client.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      take: limit,
      include: { createdBy: { select: auditUserSelect }, updatedBy: { select: auditUserSelect } },
    });
  },
  async create(data: Prisma.ClientCreateInput) {
    return prisma.client.create({ data });
  },
  async update(id: string, data: Prisma.ClientUpdateInput) {
    return prisma.client.update({ where: { id }, data });
  },
  async softDelete(id: string) {
    return prisma.client.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });
  },
  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "client", id);
      return tx.client.delete({ where: { id } });
    });
  },
};
