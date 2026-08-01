import { apiClient } from "@/shared/lib";
import { Achievement, CreateAchievementPayload, UpdateAchievementPayload, AchievementQueryParams, PublicAchievementQueryParams } from "../types/achievement.types";

export const achievementApi = {
  getPublished: (params?: PublicAchievementQueryParams) =>
    apiClient.get<Achievement[]>("/api/public/achievements", params),

  getAll: (params?: AchievementQueryParams) =>
    apiClient.paginated<Achievement>("/api/admin/achievements", params),

  getById: (id: string) => apiClient.get<Achievement>("/api/admin/achievements/" + id),

  create: (data: CreateAchievementPayload) =>
    apiClient.post<Achievement>("/api/admin/achievements", data),

  update: (id: string, data: UpdateAchievementPayload) =>
    apiClient.patch<Achievement>("/api/admin/achievements/" + id, data),

  delete: (id: string) => apiClient.delete<{ deleted: boolean }>("/api/admin/achievements/" + id),
};
