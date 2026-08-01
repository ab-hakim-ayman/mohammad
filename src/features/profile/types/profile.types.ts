import I18n from "@/shared/components/I18n";
import type { z } from "zod";
import type { ProfileQuerySchema, ProfileSchema } from "../schemas/profile.schema";
import type { UserProfileRecord, PublicTeamProfileRecord } from "@/features/user";
export type ProfilePayload = z.infer<typeof ProfileSchema>;
export type ProfileQueryValidated = z.infer<typeof ProfileQuerySchema>;
export type ProfileRecord = UserProfileRecord;
export type TeamProfileRecord = PublicTeamProfileRecord;
export interface AdminProfileUserRecord {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  phone: string | null;
  role: import("@/shared/types").UserRole;
  status: import("@/shared/types").AccountStatus;
  isVerified: boolean;
}
export interface AdminProfileRecord extends UserProfileRecord {
  user: AdminProfileUserRecord;
}
export interface ProfileVisibilityPayload {
  isPublic?: boolean;
}
export interface ProfileQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isPublic?: boolean;
  sort?: ProfileQueryValidated["sort"];
}
