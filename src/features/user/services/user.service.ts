import I18n from "@/shared/components/I18n";
import bcrypt from "bcryptjs";
import { AppError } from "@/core/server/http/errors";
import { generateSecureToken } from "@/core/server/security/token";
import { sendInviteEmail } from "@/core/server/mail";
import {
  canAssignRole,
  canManageUser,
  MANAGEMENT_ROLES,
  type CurrentUser,
} from "@/core/server/security/auth";
import { authRepository } from "@/features/auth/server";
import { recordAuditEvent  } from "@/features/audit/utils/audit.helper";
import { syncMediaAttachments  } from "@/features/media/utils/media-attachment-sync";
import { userRepository } from "../repositories/user.repository";
import {
  CreateUserSchema,
  InviteUserSchema,
  UpdateUserRoleSchema,
  UpdateUserSchema,
  UpdateUserStatusSchema,
} from "../schemas/user.schema";
import type {
  CreateUserPayload,
  InviteUserPayload,
  UpdateUserPayload,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
  UserQueryValidated,
} from "../types/user.types";
function ensureTargetActorPermission(actor: CurrentUser, targetRole: string) {
  if (targetRole === "OWNER" && actor.role !== "OWNER") {
    throw AppError.forbidden("Only owners can manage owner accounts");
  }
}
export const userService = {
  async getAll(params: UserQueryValidated) {
    return userRepository.findAll(params);
  },
  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw AppError.notFound("User not found");
    return user;
  },
  async create(actor: CurrentUser, data: CreateUserPayload) {
    const validated = CreateUserSchema.parse(data);
    if (!MANAGEMENT_ROLES.includes(actor.role)) {
      throw AppError.forbidden("User management access required");
    }
    ensureTargetActorPermission(actor, validated.role);
    const existing = await userRepository.findByEmail(validated.email);
    if (existing && existing.status !== "INACTIVE") {
      throw AppError.conflict("User with this email already exists");
    }
    const password = validated.password ? await bcrypt.hash(validated.password, 12) : null;
    const status = validated.status ?? (password ? "ACTIVE" : "INVITED");
    const result = existing
      ? await userRepository.update(existing.id, {
          name: validated.name,
          avatar: validated.avatar,
          phone: validated.phone,
          role: validated.role,
          status,
          profile: validated.profile,
        })
      : await userRepository.create({ ...validated, password, status });
    await userRepository.ensureProfile(result.id, validated.profile as any);
    if (password) {
      await userRepository.updatePassword(result.id, password);
    }
    const savedUser = await userRepository.findById(result.id);
    await syncMediaAttachments(
      "user",
      result.id,
      [
        {
          fieldName: "avatar",
          value: savedUser?.avatar ?? result.avatar ?? null,
          usageType: "AVATAR",
          isPrimary: true,
          altText: validated.avatarAlt,
          isNewUpload: validated.avatarAlt != null,
        },
      ],
      actor.id
    );
    await recordAuditEvent({
      actor: { id: actor.id },
      action: "CREATE",
      entityType: "user",
      entityId: result.id,
      newValues: savedUser
        ? {
            email: savedUser.email,
            name: savedUser.name,
            role: savedUser.role,
            status: savedUser.status,
          }
        : {
            email: validated.email,
            name: validated.name || null,
            role: validated.role,
            status,
          },
    });
    return savedUser;
  },
  async update(actor: CurrentUser, id: string, data: UpdateUserPayload) {
    const validated = UpdateUserSchema.parse(data);
    const existing = await userRepository.findById(id);
    if (!existing) throw AppError.notFound("User not found");
    if (!canManageUser(actor, existing)) {
      throw AppError.forbidden("You cannot manage this user");
    }
    if (validated.role) {
      ensureTargetActorPermission(actor, validated.role);
      if (!canAssignRole(actor.role, validated.role)) {
        throw AppError.forbidden("You cannot assign this role");
      }
    }
    const previous = existing;
    const updated = await userRepository.update(id, {
      ...validated,
      profile: validated.profile,
    });
    if (validated.profile) {
      await userRepository.ensureProfile(id, validated.profile as any);
    }
    await syncMediaAttachments(
      "user",
      id,
      [
        {
          fieldName: "avatar",
          value: updated.avatar,
          usageType: "AVATAR",
          isPrimary: true,
          altText: validated.avatarAlt,
          isNewUpload: validated.avatarAlt != null,
        },
      ],
      actor.id
    );
    await recordAuditEvent({
      actor: { id: actor.id },
      action: "UPDATE",
      entityType: "user",
      entityId: id,
      oldValues: {
        email: previous.email,
        name: previous.name,
        role: previous.role,
        status: previous.status,
      },
      newValues: {
        email: updated.email,
        name: updated.name,
        role: updated.role,
        status: updated.status,
      },
    });
    return updated;
  },
  async delete(actor: CurrentUser, id: string) {
    const existing = await userRepository.findById(id);
    if (!existing) throw AppError.notFound("User not found");
    if (!canManageUser(actor, existing)) {
      throw AppError.forbidden("You cannot manage this user");
    }
    if (existing.role === "OWNER" && actor.role !== "OWNER") {
      throw AppError.forbidden("Only owners can delete owner accounts");
    }
    const removed = await userRepository.delete(id);
    await recordAuditEvent({
      actor: { id: actor.id },
      action: "DELETE",
      entityType: "user",
      entityId: id,
      oldValues: {
        email: existing.email,
        name: existing.name,
        role: existing.role,
        status: existing.status,
      },
    });
    return removed;
  },
  async updateRole(actor: CurrentUser, id: string, data: UpdateUserRolePayload) {
    const validated = UpdateUserRoleSchema.parse(data);
    const existing = await userRepository.findById(id);
    if (!existing) throw AppError.notFound("User not found");
    if (!canManageUser(actor, existing)) {
      throw AppError.forbidden("You cannot manage this user");
    }
    ensureTargetActorPermission(actor, validated.role);
    if (!canAssignRole(actor.role, validated.role)) {
      throw AppError.forbidden("You cannot assign this role");
    }
    const updated = await userRepository.updateRole(id, validated.role);
    await recordAuditEvent({
      actor: { id: actor.id },
      action: "ROLE_CHANGE",
      entityType: "user",
      entityId: id,
      oldValues: { role: existing.role },
      newValues: { role: validated.role },
    });
    return updated;
  },
  async updateStatus(actor: CurrentUser, id: string, data: UpdateUserStatusPayload) {
    const validated = UpdateUserStatusSchema.parse(data);
    const existing = await userRepository.findById(id);
    if (!existing) throw AppError.notFound("User not found");
    if (!canManageUser(actor, existing)) {
      throw AppError.forbidden("You cannot manage this user");
    }
    if (existing.role === "OWNER" && actor.role !== "OWNER") {
      throw AppError.forbidden("Only owners can change owner status");
    }
    const updated = await userRepository.updateStatus(id, validated.status);
    await recordAuditEvent({
      actor: { id: actor.id },
      action: "STATUS_CHANGE",
      entityType: "user",
      entityId: id,
      oldValues: { status: existing.status },
      newValues: { status: validated.status },
    });
    return updated;
  },
  async invite(actor: CurrentUser, data: InviteUserPayload) {
    const validated = InviteUserSchema.parse(data);
    if (!MANAGEMENT_ROLES.includes(actor.role)) {
      throw AppError.forbidden("User management access required");
    }
    ensureTargetActorPermission(actor, validated.role);
    if (!canAssignRole(actor.role, validated.role)) {
      throw AppError.forbidden("You cannot assign this role");
    }
    const token = generateSecureToken(24);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const existing = await userRepository.findByEmail(validated.email);
    const user = existing
      ? await userRepository.update(existing.id, {
          name: validated.name,
          avatar: existing.avatar,
          phone: validated.phone,
          role: validated.role,
          status: "INVITED",
          profile: { fullName: validated.name || existing.name || null } as any,
        })
      : await userRepository.create({
          email: validated.email,
          name: validated.name,
          phone: validated.phone,
          role: validated.role,
          status: "INVITED",
          password: null,
        });
    await userRepository.ensureProfile(user.id, {
      fullName: validated.name || user.name || null,
    } as any);
    await syncMediaAttachments(
      "user",
      user.id,
      [
        {
          fieldName: "avatar",
          value: user.avatar,
          usageType: "AVATAR",
          isPrimary: true,
        },
      ],
      actor.id
    );
    await authRepository.createInvitation({
      email: validated.email,
      token,
      role: validated.role,
      invitedById: actor.id,
      expiresAt,
    });
    await sendInviteEmail({
      to: validated.email,
      token,
      recipientName: validated.name || user.name,
      invitedByName: actor.name || actor.email,
      role: validated.role,
      expiresAt,
    });
    await recordAuditEvent({
      actor: { id: actor.id },
      action: "INVITE",
      entityType: "user",
      entityId: existing?.id || null,
      newValues: {
        email: validated.email,
        role: validated.role,
        status: "INVITED",
      },
    });
    return { user: await userRepository.findById(user.id), token, expiresAt };
  },
  async resendInvite(actor: CurrentUser, id: string) {
    const existing = await userRepository.findById(id);
    if (!existing) throw AppError.notFound("User not found");
    if (!canManageUser(actor, existing)) {
      throw AppError.forbidden("You cannot manage this user");
    }
    if (existing.role === "OWNER" && actor.role !== "OWNER") {
      throw AppError.forbidden("Only owners can manage owner invitations");
    }
    const token = generateSecureToken(24);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    await authRepository.createInvitation({
      email: existing.email,
      token,
      role: existing.role,
      invitedById: actor.id,
      expiresAt,
    });
    await sendInviteEmail({
      to: existing.email,
      token,
      recipientName: existing.name,
      invitedByName: actor.name || actor.email,
      role: existing.role,
      expiresAt,
    });
    await userRepository.updateStatus(id, "INVITED");
    await recordAuditEvent({
      actor: { id: actor.id },
      action: "INVITE",
      entityType: "user",
      entityId: id,
      newValues: {
        email: existing.email,
        role: existing.role,
        status: "INVITED",
      },
    });
    return { user: await userRepository.findById(id), token, expiresAt };
  },
};
