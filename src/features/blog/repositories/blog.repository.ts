import I18n from "@/shared/components/I18n";

import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { BlogQueryValidated } from "../types/blog.types";

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
const blogInclude = {
  categories: { select: { id: true, title: true, slug: true } },
  tags: { select: { id: true, title: true, slug: true } },
} as const;

const blogPublicInclude = {
  categories: {
    where: { status: "PUBLISHED" },
    select: { id: true, title: true, slug: true },
  },
  tags: {
    where: { status: "PUBLISHED" },
    select: { id: true, title: true, slug: true },
  },
  createdBy: { select: auditUserSelect },
} as const;

export const blogRepository = {
  async findAll(params: BlogQueryValidated) {
    const {
      page = 1,
      limit = 10,
      search,
      sort,
      status,

      isFeatured,
      category,
      tag,
    } = params;
    const where: Prisma.BlogWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { excerpt: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(category && { categories: { some: { slug: category } } }),
      ...(tag && { tags: { some: { slug: tag } } }),
    };
    let orderBy: Prisma.BlogOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "title_asc") orderBy = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "publishedAt_desc") orderBy = { publishedAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    const [data, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          categories: { select: { id: true, title: true, slug: true } },
          tags: { select: { id: true, title: true, slug: true } },
          createdBy: { select: auditUserSelect },
          updatedBy: { select: auditUserSelect },
        },
      }),
      prisma.blog.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findById(id: string) {
    return prisma.blog.findUnique({
      where: { id },
      include: {
        categories: { select: { id: true, title: true, slug: true } },
        tags: { select: { id: true, title: true, slug: true } },
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },
  async findBySlug(slug: string) {
    return prisma.blog.findUnique({
      where: { slug },
      include: {
        categories: { select: { id: true, title: true, slug: true } },
        tags: { select: { id: true, title: true, slug: true } },
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },
  async findPublicBySlug(slug: string) {
    return prisma.blog.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: blogPublicInclude,
    });
  },
  async findRelatedBlogs(blogId: string, categorySlugs: string[], tagSlugs: string[]) {
    return prisma.blog.findMany({
      where: {
        id: { not: blogId },
        status: "PUBLISHED",
        OR: [
          { categories: { some: { slug: { in: categorySlugs } } } },
          { tags: { some: { slug: { in: tagSlugs } } } },
        ],
      },
      take: 3,
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      include: blogPublicInclude,
    });
  },
  async findPublished(params: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
  }) {
    const { page = 1, limit = 10, category, tag, search } = params;
    const where: Prisma.BlogWhereInput = {
      status: "PUBLISHED",
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { excerpt: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { categories: { some: { slug: category } } }),
      ...(tag && { tags: { some: { slug: tag } } }),
    };
    const [data, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { publishedAt: "desc" },
        include: blogPublicInclude,
      }),
      prisma.blog.count({ where }),
    ]);
    return { data, total, page, limit };
  },
  async create(data: Prisma.BlogCreateInput, categories?: string[], tags?: string[]) {
    return prisma.blog.create({
      data: {
        ...data,
        categories: categories ? { connect: categories.map((id) => ({ id })) } : undefined,
        tags: tags ? { connect: tags.map((id) => ({ id })) } : undefined,
      },
      include: {
        categories: { select: { id: true, title: true, slug: true } },
        tags: { select: { id: true, title: true, slug: true } },
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },
  async update(id: string, data: Prisma.BlogUpdateInput, categories?: string[], tags?: string[]) {
    return prisma.blog.update({
      where: { id },
      data: {
        ...data,
        categories: categories ? { set: categories.map((id) => ({ id })) } : undefined,
        tags: tags ? { set: tags.map((id) => ({ id })) } : undefined,
      },
      include: {
        categories: { select: { id: true, title: true, slug: true } },
        tags: { select: { id: true, title: true, slug: true } },
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },
  async softDelete(id: string) {
    return prisma.blog.update({
      where: { id },
      data: { archivedAt: new Date(), status: "ARCHIVED" },
    });
  },
  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      const { cleanupMediaAttachmentsForEntity } = await import("@/shared/utils/media-cleanup");
      await cleanupMediaAttachmentsForEntity(tx, "blog", id);
      return tx.blog.delete({ where: { id } });
    });
  },
};
