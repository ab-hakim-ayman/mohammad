import I18n from "@/shared/components/I18n";
import bcrypt from "bcryptjs";
import { AppError } from "@/core/server/http/errors";
import { generateToken } from "@/core/server/security/auth";
import { generateSecureToken } from "@/core/server/security/token";
import { authRepository } from "../repositories/auth.repository";
import { userRepository } from "@/features/user/server";
import { recordAuditEvent  } from "@/features/audit/utils/audit.helper";
import { sendPasswordResetEmail } from "@/core/server/mail";
import { AcceptInvitePayload, AuthTokenVerification, ChangePasswordPayload, ForgotPasswordPayload, LoginPayload, ResetPasswordPayload, VerifyTokenPayload } from "../types/auth.types";

const RESET_TTL_MS = 1000 * 60 * 60;
async function getUserOrThrow(email: string) {
  const user = await authRepository.findByEmail(email);
  if (!user) {
    throw AppError.invalidCredentials();
  }
  return user;
}
export const authService = {
  async login(credentials: LoginPayload) {
    const { email, password } = credentials;
    const user = await getUserOrThrow(email);
    if (!user.passwordHash) {
      throw AppError.invalidCredentials();
    }
    if (user.status !== "ACTIVE" && user.role !== "OWNER") {
      throw AppError.forbidden("Account is not active");
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw AppError.invalidCredentials();
    }
    const token = await generateToken(user.id);
    const updatedUser = await authRepository.updateLastLogin(user.id);
    await recordAuditEvent({
      actor: { id: user.id },
      action: "LOGIN",
      entityType: "auth",
      entityId: user.id,
      newValues: { email: user.email, role: user.role, status: user.status },
    });
    return { token, user: updatedUser };
  },
  async acceptInvite(payload: AcceptInvitePayload) {
    const { token, password, name, phone } = payload;
    const invitation = await authRepository.findInvitationByToken(token);
    if (!invitation) {
      throw AppError.notFound("Invitation not found");
    }
    if (invitation.acceptedAt) {
      throw AppError.conflict("Invitation already accepted");
    }
    if (invitation.expiresAt.getTime() < Date.now()) {
      throw AppError.forbidden("Invitation token expired");
    }
    const user = await userRepository.findByEmail(invitation.email);
    if (!user) {
      throw AppError.notFound("User not found");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await userRepository.update(user.id, {
      name: name ?? user.name,
      phone: phone ?? user.phone,
      role: invitation.role,
      status: "ACTIVE",
      isVerified: true,
    });
    await userRepository.updatePassword(user.id, hashedPassword);
    await userRepository.ensureProfile(user.id, {
      fullName: name ?? user.name ?? undefined,
    });
    await authRepository.markInvitationAccepted(token);
    await recordAuditEvent({
      actor: { id: user.id },
      action: "ACCEPT_INVITE",
      entityType: "auth",
      entityId: user.id,
      newValues: { email: user.email, role: invitation.role },
    });
    const tokenValue = await generateToken(user.id);
    const updatedUser = await authRepository.updateLastLogin(user.id);
    return { token: tokenValue, user: updatedUser };
  },
  async forgotPassword(payload: ForgotPasswordPayload) {
    const { email } = payload;
    const user = await userRepository.findByEmail(email);
    if (!user || user.status !== "ACTIVE") {
      return { success: true };
    }
    const token = generateSecureToken(24);
    const expiresAt = new Date(Date.now() + RESET_TTL_MS);
    await authRepository.createPasswordResetToken({
      email,
      token,
      expiresAt,
      userId: user.id,
    });
    await sendPasswordResetEmail({
      to: email,
      token,
      recipientName: user.name,
    });
    await recordAuditEvent({
      actor: { id: user.id },
      action: "RESET_PASSWORD",
      entityType: "auth",
      entityId: user.id,
      newValues: { email },
    });
    return { success: true };
  },
  async resetPassword(payload: ResetPasswordPayload) {
    const { token, password } = payload;
    const resetToken = await authRepository.findPasswordResetToken(token);
    if (!resetToken) {
      throw AppError.notFound("Reset token not found");
    }
    if (resetToken.usedAt) {
      throw AppError.conflict("Reset token already used");
    }
    if (resetToken.expiresAt.getTime() < Date.now()) {
      throw AppError.forbidden("Reset token expired");
    }
    const user = resetToken.user;
    if (!user) {
      throw AppError.notFound("User not found");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await userRepository.updatePassword(user.id, hashedPassword);
    await userRepository.updateStatus(user.id, "ACTIVE");
    await authRepository.markPasswordResetTokenUsed(token);
    await recordAuditEvent({
      actor: { id: user.id },
      action: "RESET_PASSWORD",
      entityType: "auth",
      entityId: user.id,
      newValues: { email: user.email },
    });
    return { success: true };
  },
  async changePassword(userId: string, payload: ChangePasswordPayload) {
    const { currentPassword, newPassword } = payload;
    const user = await authRepository.findById(userId);
    if (!user || !user.passwordHash) {
      throw AppError.notFound("User not found");
    }
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw AppError.invalidCredentials();
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await userRepository.updatePassword(userId, hashedPassword);
    await recordAuditEvent({
      actor: { id: userId },
      action: "PASSWORD_CHANGE",
      entityType: "auth",
      entityId: userId,
    });
    return { success: true };
  },
  async verifyToken(payload: VerifyTokenPayload): Promise<AuthTokenVerification> {
    const { token, type } = payload;
    if (type === "invitation" || !type) {
      const invitation = await authRepository.findInvitationByToken(token);
      if (invitation) {
        return {
          valid: !invitation.acceptedAt && invitation.expiresAt.getTime() >= Date.now(),
          type: "invitation",
          email: invitation.email,
          role: invitation.role,
          expiresAt: invitation.expiresAt,
          acceptedAt: invitation.acceptedAt,
        };
      }
    }
    if (type === "reset" || !type) {
      const resetToken = await authRepository.findPasswordResetToken(token);
      if (resetToken) {
        return {
          valid: !resetToken.usedAt && resetToken.expiresAt.getTime() >= Date.now(),
          type: "reset",
          email: resetToken.user.email,
          expiresAt: resetToken.expiresAt,
          usedAt: resetToken.usedAt,
        };
      }
    }
    return { valid: false, type: null };
  },
};
