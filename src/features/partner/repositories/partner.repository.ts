import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { PartnerQueryValidated } from "../types/partner.types";

const partnerInclude = {
  createdBy: {
    select: { id: true, email: true, name: true, avatar: true, role: true, status: true },
  },
  updatedBy: {
    select: { id: true, email: true, name: true, avatar: true, role: true, status: true },
  },
} as const satisfies Prisma.PartnerInclude;

export const partnerRepository = {
  async findAll(params: PartnerQueryValidated) {
    const { page = 1, limit = 10, search, sort, status, type, isFeatured } = params;
    const where: Prisma.PartnerWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { website: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status !== undefined && { status }),
      ...(type && { type }),
      ...(isFeatured !== undefined && { isFeatured }),
    };
    let orderBy: Prisma.PartnerOrderByWithRelationInput = { order: "asc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "order_desc") orderBy = { order: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    const [data, total] = await Promise.all([
      prisma.partner.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: partnerInclude,
      }),
      prisma.partner.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findById(id: string) {
    return prisma.partner.findUnique({ where: { id }, include: partnerInclude });
  },
  async findPublished(limit?: number) {
    return prisma.partner.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { order: "asc" },
      take: limit,
      include: partnerInclude,
    });
  },
  async create(data: Prisma.PartnerCreateInput) {
    return prisma.partner.create({ data });
  },
  async update(id: string, data: Prisma.PartnerUpdateInput) {
    return prisma.partner.update({ where: { id }, data });
  },
  async softDelete(id: string) {
    return prisma.partner.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });
  },
  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "partner", id);
      return tx.partner.delete({ where: { id } });
    });
  },
};
