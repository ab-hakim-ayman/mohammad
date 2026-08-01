import { apiClient } from "@/shared/lib";
import {
  Experience,
  CreateExperiencePayload,
  UpdateExperiencePayload,
  ExperienceApiQueryParams,
  PublicExperienceQueryParams,
} from "../types/experience.types";

export const experienceApi = {
  getPublished: (params?: PublicExperienceQueryParams) =>
    apiClient.paginated<Experience>("/api/public/experiences", params),
  getByIdPublic: (id: string) => apiClient.get<Experience>(`/api/public/experiences/${id}`),

  getAll: (params?: ExperienceApiQueryParams) =>
    apiClient.paginated<Experience>("/api/admin/experiences", params),
  getById: (id: string) => apiClient.get<Experience>(`/api/admin/experiences/${id}`),
  create: (data: CreateExperiencePayload) => apiClient.post<Experience>("/api/admin/experiences", data),
  update: (id: string, data: UpdateExperiencePayload) =>
    apiClient.patch<Experience>(`/api/admin/experiences/${id}`, data),
  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/experiences/${id}`),
};
