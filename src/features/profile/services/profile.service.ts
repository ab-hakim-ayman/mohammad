import I18n from "@/shared/components/I18n";
import { AppError } from "@/core/server/http/errors";
import { profileRepository } from "../repositories/profile.repository";
import { syncMediaAttachments  } from "@/features/media/utils/media-attachment-sync";
import { ProfileSchema, ProfileVisibilitySchema } from "../schemas/profile.schema";
import type {
  ProfilePayload,
  ProfileVisibilityPayload,
  ProfileQueryValidated,
} from "../types/profile.types";
import type { CurrentUser } from "@/core/server/security/auth";
export const profileService = {
  async getAll(params: ProfileQueryValidated) {
    return profileRepository.findAll(params);
  },
  async getMe(userId: string) {
    const profile = await profileRepository.ensureByUserId(userId);
    return profile;
  },
  async updateMe(userId: string, data: ProfilePayload, actorId?: string | null) {
    const validated = ProfileSchema.parse(data);
    const profile = await profileRepository.ensureByUserId(userId, validated);
    await syncMediaAttachments(
      "profile",
      profile.id,
      [
        {
          fieldName: "avatar",
          value: profile.avatar,
          usageType: "AVATAR",
          isPrimary: true,
          altText: validated.avatarAlt,
          isNewUpload: validated.avatarAlt != null,
        },
        {
          fieldName: "coverImage",
          value: profile.coverImage,
          usageType: "COVER",
          altText: validated.coverImageAlt,
          isNewUpload: validated.coverImageAlt != null,
        },
      ],
      actorId
    );
    return profile;
  },
  async getById(id: string) {
    const profile = await profileRepository.findById(id);
    if (!profile) throw AppError.notFound("Profile not found");
    return profile;
  },
  async updateById(actor: CurrentUser, id: string, data: ProfilePayload) {
    const validated = ProfileSchema.parse(data);
    const profile = await profileRepository.findById(id);
    if (!profile) throw AppError.notFound("Profile not found");
    if (actor.role !== "OWNER" && actor.role !== "ADMIN" && profile.userId !== actor.id) {
      throw AppError.forbidden("You cannot manage this profile");
    }
    const updatedProfile = await profileRepository.updateById(id, validated);
    await syncMediaAttachments(
      "profile",
      updatedProfile.id,
      [
        {
          fieldName: "avatar",
          value: updatedProfile.avatar,
          usageType: "AVATAR",
          isPrimary: true,
          altText: validated.avatarAlt,
          isNewUpload: validated.avatarAlt != null,
        },
        {
          fieldName: "coverImage",
          value: updatedProfile.coverImage,
          usageType: "COVER",
          altText: validated.coverImageAlt,
          isNewUpload: validated.coverImageAlt != null,
        },
      ],
      actor.id
    );
    return updatedProfile;
  },
  async updateVisibility(actor: CurrentUser, id: string, data: ProfileVisibilityPayload) {
    const validated = ProfileVisibilitySchema.parse(data);
    const profile = await profileRepository.findById(id);
    if (!profile) throw AppError.notFound("Profile not found");
    if (actor.role !== "OWNER" && actor.role !== "ADMIN" && profile.userId !== actor.id) {
      throw AppError.forbidden("You cannot manage this profile");
    }
    return profileRepository.updateVisibility(id, validated);
  },
  async getTeamProfiles() {
    return profileRepository.getTeamProfiles();
  },
};
