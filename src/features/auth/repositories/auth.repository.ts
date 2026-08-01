import prisma from "@/core/server/prisma";
import type { UserRole } from "@/shared/types";
import { AuthUser } from "../types/auth.types";

const authUserSelect = {
  id: true,
  email: true,
  passwordHash: true,
  name: true,
  avatar: true,
  phone: true,
  role: true,
  status: true,
  isVerified: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  profile: {
    select: {
      id: true,
      fullName: true,
      headline: true,
      bio: true,
      avatar: true,
      coverImage: true,
      designation: true,
      experienceYears: true,
      skills: {
        select: {
          id: true,
          title: true,
          icon: true,
        },
      },
      githubUrl: true,
      linkedinUrl: true,
      portfolioUrl: true,
      isPublic: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const;
const publicUserSelect = {
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
  profile: {
    select: {
      id: true,
      fullName: true,
      headline: true,
      bio: true,
      avatar: true,
      coverImage: true,
      designation: true,
      experienceYears: true,
      skills: {
        select: {
          id: true,
          title: true,
          icon: true,
        },
      },
      githubUrl: true,
      linkedinUrl: true,
      portfolioUrl: true,
      isPublic: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const;
export const authRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email }, select: authUserSelect });
  },
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: authUserSelect });
  },
  async updateLastLogin(userId: string): Promise<AuthUser> {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
      select: publicUserSelect,
    });
  },
  async updatePassword(userId: string, passwordHash: string): Promise<AuthUser> {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
      select: publicUserSelect,
    });
  },
  async createInvitation(data: {
    email: string;
    token: string;
    role: UserRole;
    invitedById?: string | null;
    expiresAt: Date;
  }) {
    return prisma.userInvitation.create({
      data: {
        email: data.email,
        tokenHash: data.token,
        role: data.role,
        invitedById: data.invitedById,
        expiresAt: data.expiresAt,
      },
    });
  },
  async findInvitationByToken(token: string) {
    return prisma.userInvitation.findUnique({ where: { tokenHash: token } });
  },
  async findInvitationByEmail(email: string) {
    return prisma.userInvitation.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });
  },
  async markInvitationAccepted(token: string) {
    return prisma.userInvitation.update({
      where: { tokenHash: token },
      data: { acceptedAt: new Date() },
    });
  },
  async createPasswordResetToken(data: {
    email: string;
    token: string;
    expiresAt: Date;
    userId?: string | null;
  }) {
    if (!data.userId) {
      throw new Error("userId is required for password reset token creation");
    }
    return prisma.passwordResetToken.create({
      data: {
        tokenHash: data.token,
        expiresAt: data.expiresAt,
        userId: data.userId,
      },
    });
  },
  async findPasswordResetToken(token: string) {
    return prisma.passwordResetToken.findUnique({
      where: { tokenHash: token },
      include: { user: true },
    });
  },
  async markPasswordResetTokenUsed(token: string) {
    return prisma.passwordResetToken.update({
      where: { tokenHash: token },
      data: { usedAt: new Date() },
    });
  },
};
