import prisma from "@/core/server/prisma";
import { Prisma } from "@prisma/client";
import { cleanupMediaAttachmentsForEntity } from "@/shared/utils/media-cleanup";

import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserQueryValidated,
  UserProfilePayload,
} from "../types/user.types";
import type { AccountStatus, UserRole } from "@/shared/types";

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
} as const;
const userSelect = {
  id: true,
  email: true,
  name: true,
  avatar: true,
  phone: true,
  role: true,
  status: true,
  isVerified: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  profile: { select: profileSelect },
} as const;
function buildOrderBy(sort: UserQueryValidated["sort"]): Prisma.UserOrderByWithRelationInput {
  if (sort === "createdAt_asc") return { createdAt: "asc" };
  if (sort === "email_asc") return { email: "asc" };
  if (sort === "email_desc") return { email: "desc" };
  if (sort === "name_asc") return { name: "asc" };
  if (sort === "name_desc") return { name: "desc" };
  if (sort === "role_asc") return { role: "asc" };
  if (sort === "role_desc") return { role: "desc" };
  if (sort === "status_asc") return { status: "asc" };
  if (sort === "status_desc") return { status: "desc" };
  if (sort === "lastLoginAt_asc") return { lastLoginAt: "asc" };
  if (sort === "lastLoginAt_desc") return { lastLoginAt: "desc" };
  return { createdAt: "desc" };
}
function buildWhere(
  params: Pick<UserQueryValidated, "search" | "role" | "status">
): Prisma.UserWhereInput {
  const { search, role, status } = params;
  return {
    ...(search && {
      OR: [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(role && { role }),
    ...(status && { status }),
  };
}
export const userRepository = {
  async findAll(params: UserQueryValidated) {
    const { page = 1, limit = 10 } = params;
    const where = buildWhere(params);
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: buildOrderBy(params.sort),
        select: userSelect,
      }),
      prisma.user.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: userSelect });
  },
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email }, select: userSelect });
  },
  async create(data: CreateUserPayload) {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name || null,
        avatar: data.avatar || null,
        phone: data.phone || null,
        role: data.role,
        status: data.status,
        passwordHash: data.password || null,
        profile: data.profile
          ? {
              create: {
                fullName: data.profile.fullName || data.name || null,
                headline: data.profile.headline || null,
                bio: data.profile.bio || null,
                avatar: data.profile.avatar || data.avatar || null,
                coverImage: data.profile.coverImage || null,
                designation: data.profile.designation || null,
                experienceYears: data.profile.experienceYears || null,
                skills: buildSkillLinks(data.profile.skills),
                githubUrl: data.profile.githubUrl || null,
                linkedinUrl: data.profile.linkedinUrl || null,
                portfolioUrl: data.profile.portfolioUrl || null,
                isPublic: data.profile.isPublic ?? false,
              },
            }
          : undefined,
      },
      select: userSelect,
    });
  },
  async update(id: string, data: UpdateUserPayload) {
    return prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        avatar: data.avatar,
        phone: data.phone,
        role: data.role,
        status: data.status,
        isVerified: data.isVerified,
        profile: data.profile
          ? {
              upsert: {
                create: {
                  fullName: data.profile.fullName || data.name || null,
                  headline: data.profile.headline || null,
                  bio: data.profile.bio || null,
                  avatar: data.profile.avatar || data.avatar || null,
                  coverImage: data.profile.coverImage || null,
                  designation: data.profile.designation || null,
                  experienceYears: data.profile.experienceYears || null,
                  skills: buildSkillLinks(data.profile.skills),
                  githubUrl: data.profile.githubUrl || null,
                  linkedinUrl: data.profile.linkedinUrl || null,
                  portfolioUrl: data.profile.portfolioUrl || null,
                  isPublic: data.profile.isPublic ?? false,
                },
                update: {
                  fullName: data.profile.fullName,
                  headline: data.profile.headline,
                  bio: data.profile.bio,
                  avatar: data.profile.avatar,
                  coverImage: data.profile.coverImage,
                  designation: data.profile.designation,
                  experienceYears: data.profile.experienceYears,
                  skills: replaceSkillLinks(data.profile.skills),
                  githubUrl: data.profile.githubUrl,
                  linkedinUrl: data.profile.linkedinUrl,
                  portfolioUrl: data.profile.portfolioUrl,
                  isPublic: data.profile.isPublic,
                },
              },
            }
          : undefined,
      },
      select: userSelect,
    });
  },
  async delete(id: string) {
    const user = await prisma.user.findUnique({ where: { id }, include: { profile: true } });
    if (!user) return { deleted: false };

    await prisma.$transaction(async (tx) => {
      await cleanupMediaAttachmentsForEntity(tx, "user", id);
      if (user.profile) {
        await cleanupMediaAttachmentsForEntity(tx, "profile", user.profile.id);
      }
      await tx.user.delete({ where: { id } });
    });
    return { deleted: true };
  },
  async updateRole(id: string, role: UserRole) {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: userSelect,
    });
  },
  async updateStatus(id: string, status: AccountStatus) {
    return prisma.user.update({
      where: { id },
      data: { status },
      select: userSelect,
    });
  },
  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: userSelect,
    });
  },
  async updateLastLogin(id: string) {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
      select: userSelect,
    });
  },
  async ensureProfile(userId: string, data?: Partial<UserProfilePayload>) {
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
  async getProfileByUserId(userId: string) {
    return prisma.profile.findUnique({
      where: { userId },
      select: profileSelect,
    });
  },
  async getProfileById(id: string) {
    return prisma.profile.findUnique({ where: { id }, select: profileSelect });
  },
  async listTeamProfiles() {
    return prisma.profile.findMany({
      where: {
        isPublic: true,
      },
      orderBy: [{ designation: "asc" }, { fullName: "asc" }],
      select: {
        ...profileSelect,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    });
  },
};
