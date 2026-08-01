import prisma from "@/core/server/prisma";
import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import { Prisma } from "@prisma/client";
import { ContactQueryValidated } from "../types/contact.types";

export const contactRepository = {
  async findAll(params: ContactQueryValidated) {
    const { page = 1, limit = 10, search, sort, status, serviceId } = params;

    const where: Prisma.ContactWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { subject: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
      ...(serviceId && { serviceId }),
    };

    let orderBy: Prisma.ContactOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "name_asc") orderBy = { name: "asc" };
    if (sort === "name_desc") orderBy = { name: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };

    const [data, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: { service: { select: { id: true, title: true } } },
      }),
      prisma.contact.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    return prisma.contact.findUnique({
      where: { id },
      include: { service: { select: { id: true, title: true } } },
    });
  },

  async create(data: Prisma.ContactCreateInput) {
    return prisma.contact.create({ data });
  },

  async update(id: string, data: Prisma.ContactUpdateInput) {
    return prisma.contact.update({ where: { id }, data });
  },

  async softDelete(id: string) {
    return prisma.contact.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });
  },

  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "contact", id);
      return tx.contact.delete({ where: { id } });
    });
  },
};
