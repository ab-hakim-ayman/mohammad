import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";
import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { SiteInfoQueryValidated } from "../types/site-info.types";

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

export const siteInfoRepository = {
  async findAll(params: SiteInfoQueryValidated) {
    const { page = 1, limit = 10, search, sort } = params;
    const where: Prisma.SiteInfoWhereInput = search
      ? {
          OR: [
            { siteTitle: { contains: search, mode: "insensitive" } },
            { companyTitle: { contains: search, mode: "insensitive" } },
            { tagline: { contains: search, mode: "insensitive" } },
            { businessType: { contains: search, mode: "insensitive" } },
          ],
          key: "main",
        }
      : { key: "main" };
    let orderBy: Prisma.SiteInfoOrderByWithRelationInput = {
      updatedAt: "desc",
    };
    if (sort === "createdAt_desc") orderBy = { createdAt: "desc" };
    if (sort === "createdAt_asc") orderBy = { createdAt: "asc" };
    if (sort === "updatedAt_asc") orderBy = { updatedAt: "asc" };
    if (sort === "siteTitle_asc") orderBy = { siteTitle: "asc" };
    if (sort === "siteTitle_desc") orderBy = { siteTitle: "desc" };
    const [data, total] = await Promise.all([
      prisma.siteInfo.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          createdBy: { select: auditUserSelect },
          updatedBy: { select: auditUserSelect },
        },
      }),
      prisma.siteInfo.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findCurrent() {
    return prisma.siteInfo.findUnique({
      where: { key: "main" },
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },
  async findById(id: string) {
    return prisma.siteInfo.findUnique({
      where: { id },
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },
  async create(data: Prisma.SiteInfoCreateInput) {
    return prisma.siteInfo.upsert({
      where: { key: "main" },
      update: { ...data, key: "main" },
      create: { ...data, key: "main" },
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },
  async update(id: string, data: Prisma.SiteInfoUpdateInput) {
    return prisma.siteInfo.update({
      where: { id },
      data,
      include: {
        createdBy: { select: auditUserSelect },
        updatedBy: { select: auditUserSelect },
      },
    });
  },
  async delete(id: string) {
    return prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "site-info", id);
      return tx.siteInfo.delete({ where: { id } });
    });
  },
};
