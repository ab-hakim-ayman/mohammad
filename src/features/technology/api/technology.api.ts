import { apiClient } from "@/shared/lib";
import { Technology, CreateTechnologyPayload, UpdateTechnologyPayload, TechnologyQueryParams } from "../types/technology.types";

export const technologyApi = {
  getPublished: (params?: { category?: string; limit?: number }) =>
    apiClient.get<Technology[]>("/api/public/technologies", params),

  getAll: (params?: TechnologyQueryParams) =>
    apiClient.paginated<Technology>("/api/admin/technologies", params),
  getById: (id: string) => apiClient.get<Technology>(`/api/admin/technologies/${id}`),
  create: (data: CreateTechnologyPayload) =>
    apiClient.post<Technology>("/api/admin/technologies", data),
  update: (id: string, data: UpdateTechnologyPayload) =>
    apiClient.patch<Technology>(`/api/admin/technologies/${id}`, data),
  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/technologies/${id}`),
};
