import { apiClient } from "@/shared/lib";
import { Specialization, CreateSpecializationPayload, UpdateSpecializationPayload, SpecializationQueryParams } from "../types/specialization.types";

export const specializationApi = {
  getPublished: () => apiClient.get<Specialization[]>("/api/public/specializations"),

  getAll: (params?: SpecializationQueryParams) =>
    apiClient.paginated<Specialization>("/api/admin/specializations", params),
  getById: (id: string) => apiClient.get<Specialization>(`/api/admin/specializations/${id}`),
  create: (data: CreateSpecializationPayload) =>
    apiClient.post<Specialization>("/api/admin/specializations", data),
  update: (id: string, data: UpdateSpecializationPayload) =>
    apiClient.patch<Specialization>(`/api/admin/specializations/${id}`, data),
  delete: (id: string) =>
    apiClient.delete<{ deleted: boolean }>(`/api/admin/specializations/${id}`),
};
