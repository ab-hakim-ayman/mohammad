import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import { TagQueryValidated } from "../types/tag.types";

const relationSummary = { select: { id: true, title: true, slug: true } };

const tagInclude = {
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      status: true,
      profile: { select: { fullName: true, headline: true, avatar: true, designation: true } },
    },
  },
  updatedBy: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      status: true,
      profile: { select: { fullName: true, headline: true, avatar: true, designation: true } },
    },
  },
  blogs: { select: { id: true, title: true, slug: true } },
  projects: { select: { id: true, title: true, slug: true } },
  services: { select: { id: true, title: true, slug: true } },
  caseStudies: { select: { id: true, title: true, slug: true } },
  technologies: { select: { id: true, title: true } },
  skills: { select: { id: true, title: true } },
} as const;

export const tagRepository = {
  async findAll(params: TagQueryValidated) {
    const { page = 1, limit = 10, search, sort, status } = params;
    const where: Prisma.TagWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status !== undefined && { status }),
    };
    let orderBy: Prisma.TagOrderByWithRelationInput = { title: "asc" };
    if (sort === "title_desc") orderBy = { title: "desc" };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    const [data, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: tagInclude,
      }),
      prisma.tag.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findById(id: string) {
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: tagInclude,
    });
    return tag;
  },
  async findBySlug(slug: string) {
    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: tagInclude,
    });
    return tag;
  },
  async findByName(name: string) {
    const tag = await prisma.tag.findFirst({ where: { title: name } });
    return tag;
  },
  async findPublished(limit?: number) {
    const tags = await prisma.tag.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { title: "asc" },
      take: limit,
      include: tagInclude,
    });
    return tags;
  },
  async create(data: Prisma.TagCreateInput) {
    return prisma.tag.create({ data });
  },
  async update(id: string, data: Prisma.TagUpdateInput) {
    return prisma.tag.update({ where: { id }, data });
  },
  async softDelete(id: string) {
    return prisma.tag.update({
      where: { id },
      data: { status: "ARCHIVED", archivedAt: new Date(), publishedAt: null },
    });
  },
  async hardDelete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "tag", id);
      return tx.tag.delete({ where: { id } });
    });
  },
};
