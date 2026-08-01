import I18n from "@/shared/components/I18n";
import { apiClient } from "@/shared/lib";
import type {
  ProfilePayload,
  ProfileQueryParams,
  ProfileVisibilityPayload,
} from "../types/profile.types";
function buildQuery(params?: ProfileQueryParams) {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? "?" + query : "";
}
export const profileApi = {
  getAll: (params?: ProfileQueryParams) =>
    apiClient.get("/api/admin/profiles" + buildQuery(params)),
  getMe: () => apiClient.get("/api/admin/profiles/me"),
  updateMe: (data: ProfilePayload) => apiClient.patch("/api/admin/profiles/me", data),

  getById: (id: string) => apiClient.get("/api/admin/profiles/" + id),
  updateById: (id: string, data: ProfilePayload) =>
    apiClient.patch("/api/admin/profiles/" + id, data),
  updateVisibility: (id: string, data: ProfileVisibilityPayload) =>
    apiClient.patch("/api/admin/profiles/" + id + "/visibility", data),
  getTeamProfiles: () => apiClient.get("/api/public/profiles/team"),
};
