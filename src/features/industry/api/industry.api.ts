import { apiClient } from "@/shared/lib";
import { Industry, CreateIndustryPayload, UpdateIndustryPayload, IndustryQueryParams } from "../types/industry.types";

export const industryApi = {
  getPublished: (params?: { limit?: number }) =>
    apiClient.get<Industry[]>("/api/public/industries", params),
  getBySlug: (slug: string) => apiClient.get<Industry>(`/api/public/industries/${slug}`),

  getAll: (params?: IndustryQueryParams) =>
    apiClient.paginated<Industry>("/api/admin/industries", params),
  getById: (id: string) => apiClient.get<Industry>(`/api/admin/industries/${id}`),
  create: (data: CreateIndustryPayload) => apiClient.post<Industry>("/api/admin/industries", data),
  update: (id: string, data: UpdateIndustryPayload) =>
    apiClient.patch<Industry>(`/api/admin/industries/${id}`, data),
  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/industries/${id}`),
};
