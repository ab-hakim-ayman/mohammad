import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import type { ToolQueryValidated } from "../types/tool.types";

const toolInclude = {
  categories: { select: { id: true, title: true, slug: true } },
  createdBy: { select: { id: true, name: true, email: true } },
  updatedBy: { select: { id: true, name: true, email: true } },
} as const;

export const toolRepository = {
  async findAll(params: ToolQueryValidated) {
    const { page = 1, limit = 10, search, categories, sort, status, isFeatured, engineType } = params;
    const where: Prisma.ToolWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { shortDesc: { contains: search, mode: "insensitive" } },
          { categories: { some: { title: { contains: search, mode: "insensitive" } } } },
          { actionKey: { contains: search, mode: "insensitive" } },
          { componentKey: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(categories && {
        categories: {
          some: {
            OR: [
              { id: categories },
              { slug: categories },
              { title: { equals: categories, mode: "insensitive" } },
            ],
          },
        },
      }),
      ...(status !== undefined && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(engineType !== undefined && { engineType }),
    };

    let orderBy: Prisma.ToolOrderByWithRelationInput = { order: "asc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "order_asc") orderBy = { order: "asc" };

    const [data, total] = await Promise.all([
      prisma.tool.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: toolInclude,
      }),
      prisma.tool.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async findById(id: string) {
    return prisma.tool.findUnique({
      where: { id },
      include: toolInclude,
    });
  },

  async findBySlug(slug: string) {
    return prisma.tool.findUnique({
      where: { slug },
      include: toolInclude,
    });
  },

  async findPublished(params?: { categories?: string; featured?: boolean; limit?: number; search?: string }) {
    const where: Prisma.ToolWhereInput = {
      status: "PUBLISHED",
      ...(params?.categories && {
        categories: {
          some: {
            OR: [
              { id: params.categories },
              { slug: params.categories },
              { title: { equals: params.categories, mode: "insensitive" } },
            ],
          },
        },
      }),
      ...(params?.featured !== undefined && { isFeatured: params.featured }),
      ...(params?.search && {
        OR: [
          { title: { contains: params.search, mode: "insensitive" } },
          { shortDesc: { contains: params.search, mode: "insensitive" } },
          { categories: { some: { title: { contains: params.search, mode: "insensitive" } } } },
        ],
      }),
    };

    return prisma.tool.findMany({
      where,
      orderBy: { order: "asc" },
      take: params?.limit || undefined,
      include: toolInclude,
    });
  },

  async create(data: Prisma.ToolCreateInput) {
    return prisma.tool.create({ data, include: toolInclude });
  },

  async update(id: string, data: Prisma.ToolUpdateInput) {
    return prisma.tool.update({ where: { id }, data, include: toolInclude });
  },

  async softDelete(id: string) {
    return prisma.tool.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date() },
    });
  },

  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "TOOL", id);
      return tx.tool.delete({ where: { id } });
    });
  },
};
