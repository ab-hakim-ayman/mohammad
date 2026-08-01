import I18n from "@/shared/components/I18n";
import { NextRequest } from "next/server";
import { AppError } from "../http/errors";
import { prisma } from "../prisma";
import { generateToken, verifyToken } from "./token";
import { ACCOUNT_STATUSES, USER_ROLES, type AccountStatus, type UserRole } from "@/shared/types";

export { generateToken, verifyToken };

export const STAFF_ROLES: UserRole[] = ["OWNER", "ADMIN", "MANAGER", "HR", "CONTENT_MANAGER"];
export const MANAGEMENT_ROLES: UserRole[] = ["OWNER", "ADMIN"];

export interface CurrentUserProfile {
  id: string;
  fullName: string | null;
  headline: string | null;
  bio: string | null;
  avatar: string | null;
  coverImage: string | null;
  designation: string | null;
  experienceYears: number | null;
  skills: Array<{
    id: string;
    title: string;
    icon: string | null;
  }>;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  phone: string | null;
  role: UserRole;
  status: AccountStatus;
  isVerified: boolean;
  lastLoginAt: Date | null;
  profile: CurrentUserProfile | null;
  createdAt: Date;
  updatedAt: Date;
}

const currentUserSelect = {
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

function isActiveStatus(status: AccountStatus) {
  return status === "ACTIVE";
}

export async function getCurrentUser(request: NextRequest): Promise<CurrentUser | null> {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: currentUserSelect,
  });

  if (!user || !isActiveStatus(user.status)) {
    return null;
  }

  return user;
}

export async function requireAuth(request: NextRequest): Promise<CurrentUser> {
  const user = await getCurrentUser(request);
  if (!user) {
    throw AppError.unauthorized("Unauthorized");
  }
  return user;
}

export async function requireActiveUser(request: NextRequest): Promise<CurrentUser> {
  return requireAuth(request);
}

export async function requireRole(
  request: NextRequest,
  allowedRoles: UserRole | UserRole[]
): Promise<CurrentUser> {
  const user = await requireAuth(request);
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!roles.includes(user.role)) {
    throw AppError.forbidden("Forbidden");
  }
  return user;
}

export function canAssignRole(actorRole: UserRole, targetRole: UserRole): boolean {
  if (actorRole === "OWNER") return true;
  if (actorRole === "ADMIN") {
    return targetRole !== "OWNER" && targetRole !== "ADMIN";
  }
  return false;
}

export function canManageUser(
  actor: Pick<CurrentUser, "role" | "status">,
  target: Pick<CurrentUser, "role" | "status">
): boolean {
  if (!isActiveStatus(actor.status)) return false;
  if (actor.role === "OWNER") return true;
  if (actor.role === "ADMIN") return target.role !== "OWNER";
  return false;
}

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value);
}

export function isAccountStatus(value: string): value is AccountStatus {
  return (ACCOUNT_STATUSES as readonly string[]).includes(value);
}
