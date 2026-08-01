import { Prisma } from "@prisma/client";
import prisma from "@/core/server/prisma";
import type {
  ProfilePayload,
  ProfileQueryValidated,
  ProfileVisibilityPayload,
} from "../types/profile.types";

const buildSkillLinks = (skills?: string[]) =>
  skills && skills.length > 0
    ? {
        connect: skills.map((title) => ({ title })),
      }
    : undefined;

const replaceSkillLinks = (skills?: string[]) =>
  skills !== undefined
    ? {
        set: [],
        ...(skills.length > 0 ? { connect: skills.map((title) => ({ title })) } : {}),
      }
    : undefined;

const profileSelect = {
  id: true,
  userId: true,
  fullName: true,
  headline: true,
  bio: true,
  avatar: true,
  coverImage: true,
  designation: true,
  experienceYears: true,
  skills: { select: { id: true, title: true, icon: true } },
  githubUrl: true,
  linkedinUrl: true,
  portfolioUrl: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      phone: true,
      role: true,
      status: true,
      isVerified: true,
    },
  },
} as const;
const profileOnlySelect = {
  id: true,
  userId: true,
  fullName: true,
  headline: true,
  bio: true,
  avatar: true,
  coverImage: true,
  designation: true,
  experienceYears: true,
  skills: { select: { id: true, title: true, icon: true } },
  githubUrl: true,
  linkedinUrl: true,
  portfolioUrl: true,
  isPublic: true,
  createdAt: true,
  updatedAt: true,
} as const;
function buildOrderBy(
  sort: ProfileQueryValidated["sort"]
): Prisma.ProfileOrderByWithRelationInput[] {
  if (sort === "createdAt_asc") return [{ createdAt: "asc" }];
  if (sort === "fullName_asc") return [{ fullName: "asc" }, { createdAt: "desc" }];
  if (sort === "fullName_desc") return [{ fullName: "desc" }, { createdAt: "desc" }];
  if (sort === "designation_asc") return [{ designation: "asc" }, { createdAt: "desc" }];
  if (sort === "designation_desc") return [{ designation: "desc" }, { createdAt: "desc" }];
  if (sort === "experienceYears_asc") return [{ experienceYears: "asc" }, { createdAt: "desc" }];
  if (sort === "experienceYears_desc") return [{ experienceYears: "desc" }, { createdAt: "desc" }];
  return [{ createdAt: "desc" }];
}
function buildWhere(
  params: Pick<ProfileQueryValidated, "search" | "isPublic">
): Prisma.ProfileWhereInput {
  const { search, isPublic } = params;
  return {
    ...(search && {
      OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { headline: { contains: search, mode: "insensitive" } },
        { designation: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
        { skills: { some: { title: { contains: search, mode: "insensitive" } } } },
      ],
    }),
    ...(isPublic !== undefined && { isPublic }),
  };
}
export const profileRepository = {
  async findAll(params: ProfileQueryValidated) {
    const { page = 1, limit = 10 } = params;
    const where = buildWhere(params);
    const [data, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: buildOrderBy(params.sort),
        select: profileSelect,
      }),
      prisma.profile.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findByUserId(userId: string) {
    return prisma.profile.findUnique({
      where: { userId },
      select: profileSelect,
    });
  },
  async findById(id: string) {
    return prisma.profile.findUnique({ where: { id }, select: profileSelect });
  },
  async ensureByUserId(userId: string, data?: Partial<ProfilePayload>) {
    return prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        fullName: data?.fullName || null,
        headline: data?.headline || null,
        bio: data?.bio || null,
        avatar: data?.avatar || null,
        coverImage: data?.coverImage || null,
        designation: data?.designation || null,
        experienceYears: data?.experienceYears || null,
        skills: buildSkillLinks(data?.skills),
        githubUrl: data?.githubUrl || null,
        linkedinUrl: data?.linkedinUrl || null,
        portfolioUrl: data?.portfolioUrl || null,
        isPublic: data?.isPublic ?? false,
      },
      update: {
        ...(data?.fullName !== undefined && { fullName: data.fullName }),
        ...(data?.headline !== undefined && { headline: data.headline }),
        ...(data?.bio !== undefined && { bio: data.bio }),
        ...(data?.avatar !== undefined && { avatar: data.avatar }),
        ...(data?.coverImage !== undefined && { coverImage: data.coverImage }),
        ...(data?.designation !== undefined && {
          designation: data.designation,
        }),
        ...(data?.experienceYears !== undefined && {
          experienceYears: data.experienceYears,
        }),
        ...(data?.skills !== undefined && {
          skills: replaceSkillLinks(data.skills),
        }),
        ...(data?.githubUrl !== undefined && { githubUrl: data.githubUrl }),
        ...(data?.linkedinUrl !== undefined && {
          linkedinUrl: data.linkedinUrl,
        }),
        ...(data?.portfolioUrl !== undefined && {
          portfolioUrl: data.portfolioUrl,
        }),
        ...(data?.isPublic !== undefined && { isPublic: data.isPublic }),
      },
      select: profileSelect,
    });
  },
  async updateById(id: string, data: ProfilePayload) {
    return prisma.profile.update({
      where: { id },
      data: {
        fullName: data.fullName,
        headline: data.headline,
        bio: data.bio,
        avatar: data.avatar,
        coverImage: data.coverImage,
        designation: data.designation,
        experienceYears: data.experienceYears,
        ...(data.skills !== undefined && {
          skills: replaceSkillLinks(data.skills),
        }),
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        portfolioUrl: data.portfolioUrl,
        isPublic: data.isPublic,
      },
      select: profileSelect,
    });
  },
  async updateVisibility(id: string, data: ProfileVisibilityPayload) {
    return prisma.profile.update({
      where: { id },
      data: {
        ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
      },
      select: profileOnlySelect,
    });
  },
  async getTeamProfiles() {
    return prisma.profile.findMany({
      where: {
        isPublic: true,
      },
      orderBy: [{ designation: "asc" }, { fullName: "asc" }],
      select: profileSelect,
    });
  },
};
