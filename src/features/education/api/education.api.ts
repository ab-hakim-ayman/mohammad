import { apiClient } from "@/shared/lib";
import {
  Education,
  CreateEducationPayload,
  UpdateEducationPayload,
  EducationApiQueryParams,
  PublicEducationQueryParams,
} from "../types/education.types";

export const educationApi = {
  getPublished: (params?: PublicEducationQueryParams) =>
    apiClient.paginated<Education>("/api/public/educations", params),
  getByIdPublic: (id: string) => apiClient.get<Education>(`/api/public/educations/${id}`),

  getAll: (params?: EducationApiQueryParams) =>
    apiClient.paginated<Education>("/api/admin/educations", params),
  getById: (id: string) => apiClient.get<Education>(`/api/admin/educations/${id}`),
  create: (data: CreateEducationPayload) => apiClient.post<Education>("/api/admin/educations", data),
  update: (id: string, data: UpdateEducationPayload) =>
    apiClient.patch<Education>(`/api/admin/educations/${id}`, data),
  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/educations/${id}`),
};
