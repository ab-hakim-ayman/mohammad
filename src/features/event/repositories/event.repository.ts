import prisma from "@/core/server/prisma";
import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import { Prisma } from "@prisma/client";
import { EventQueryValidated } from "../types/event.types";

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

const eventInclude = {
  createdBy: { select: auditUserSelect },
  updatedBy: { select: auditUserSelect },
  faqs: { select: { id: true, question: true, answer: true } },
} as const;

const eventPublicInclude = {
  faqs: {
    where: { status: "PUBLISHED" },
    select: { id: true, question: true, answer: true },
  },
} as const;

export const eventRepository = {
  async findAll(params: EventQueryValidated) {
    const { page = 1, limit = 10, search, sort, status, format, isFree, isFeatured } = params;

    const where: Prisma.EventWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
      ...(format && { format }),
      ...(isFree !== undefined && { isFree }),
      ...(isFeatured !== undefined && { isFeatured }),
    };

    let orderBy: Prisma.EventOrderByWithRelationInput = { startsAt: "desc" };
    if (sort === "startsAt_desc") orderBy = { startsAt: "desc" };
    if (sort === "startsAt_asc") orderBy = { startsAt: "asc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };

    const [data, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: eventInclude,
      }),
      prisma.event.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: eventInclude,
    });
  },

  async findBySlug(slug: string) {
    return prisma.event.findUnique({
      where: { slug },
      include: eventInclude,
    });
  },

  async findPublicBySlug(slug: string) {
    return prisma.event.findUnique({
      where: { slug, status: "PUBLISHED" },
      include: eventPublicInclude,
    });
  },

  async findPublished(params: {
    page?: number;
    limit?: number;
    search?: string;
    format?: string;
    isUpcoming?: boolean;
  }) {
    const { page = 1, limit = 10, search, format, isUpcoming } = params;

    const where: Prisma.EventWhereInput = {
      status: "PUBLISHED",
      ...(format && { format: format as any }),
      ...(isUpcoming !== undefined && {
        startsAt: isUpcoming ? { gte: new Date() } : { lt: new Date() },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startsAt: "desc" },
        include: eventPublicInclude,
      }),
      prisma.event.count({ where }),
    ]);

    return { data, total, page, limit };
  },

  async create(data: Prisma.EventCreateInput) {
    return prisma.event.create({
      data,
      include: eventInclude,
    });
  },

  async update(id: string, data: Prisma.EventUpdateInput) {
    return prisma.event.update({
      where: { id },
      data,
      include: eventInclude,
    });
  },

  async softDelete(id: string) {
    return prisma.event.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });
  },

  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "event", id);
      return tx.event.delete({ where: { id } });
    });
  },
};
