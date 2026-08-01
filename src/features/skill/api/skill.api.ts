import { apiClient } from "@/shared/lib";
import { Skill, CreateSkillPayload, UpdateSkillPayload, SkillQueryParams } from "../types/skill.types";

export const skillApi = {
  getPublished: (params?: { category?: string; limit?: number }) =>
    apiClient.get<Skill[]>("/api/public/skills", params),
  getCategories: () => apiClient.get<string[]>("/api/admin/skills/categories"),

  getAll: (params?: SkillQueryParams) => apiClient.paginated<Skill>("/api/admin/skills", params),
  getById: (id: string) => apiClient.get<Skill>(`/api/admin/skills/${id}`),
  create: (data: CreateSkillPayload) => apiClient.post<Skill>("/api/admin/skills", data),
  update: (id: string, data: UpdateSkillPayload) =>
    apiClient.patch<Skill>(`/api/admin/skills/${id}`, data),
  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/skills/${id}`),
};
