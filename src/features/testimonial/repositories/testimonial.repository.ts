import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { TestimonialQueryValidated } from "../types/testimonial.types";

export const testimonialRepository = {
  async findAll(params: TestimonialQueryValidated) {
    const { page = 1, limit = 10, search, sort, status, isFeatured, type, source } = params;
    const where: Prisma.TestimonialWhereInput = {
      ...(search && {
        OR: [
          { authorName: { contains: search, mode: "insensitive" } },
          { authorPosition: { contains: search, mode: "insensitive" } },
          { message: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status !== undefined && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(type !== undefined && { type }),
      ...(source !== undefined && { source }),
    };
    let orderBy: Prisma.TestimonialOrderByWithRelationInput = { order: "asc" };

    if (sort === "rating_desc") orderBy = { rating: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    if (sort === "order_asc") orderBy = { order: "asc" };
    const [data, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          client: { select: { id: true, title: true, logo: true } },
          employee: { select: { id: true, name: true, avatar: true } },
          caseStudies: { select: { id: true, title: true, slug: true } },
          services: { select: { id: true, title: true, slug: true } },
        },
      }),
      prisma.testimonial.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findById(id: string) {
    return prisma.testimonial.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, title: true, logo: true } },
        employee: { select: { id: true, name: true, avatar: true } },
        caseStudies: { select: { id: true, title: true, slug: true } },
        services: { select: { id: true, title: true, slug: true } },
      },
    });
  },
  async findPublished(params?: { featured?: boolean; limit?: number }) {
    const where: Prisma.TestimonialWhereInput = {
      status: "PUBLISHED",
      ...(params?.featured !== undefined && { isFeatured: params.featured }),
    };
    return prisma.testimonial.findMany({
      where,
      orderBy: { order: "asc" },
      take: params?.limit || undefined,
      include: {
        client: { select: { id: true, title: true, logo: true } },
        employee: {
          select: {
            id: true,
            name: true,
            avatar: true,
            profile: { select: { designation: true } },
          },
        },
        caseStudies: { select: { id: true, title: true, slug: true } },
        services: { select: { id: true, title: true, slug: true } },
      },
    });
  },
  async create(data: Prisma.TestimonialCreateInput) {
    return prisma.testimonial.create({ data });
  },
  async update(id: string, data: Prisma.TestimonialUpdateInput) {
    return prisma.testimonial.update({ where: { id }, data });
  },
  async softDelete(id: string) {
    return prisma.testimonial.update({
      where: { id },
      data: { archivedAt: new Date(), status: "ARCHIVED" },
    });
  },
  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "testimonial", id);
      return tx.testimonial.delete({ where: { id } });
    });
  },
};
