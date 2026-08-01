import { apiClient } from "@/shared/lib";
import { Project, CreateProjectPayload, UpdateProjectPayload, ProjectApiQueryParams, PublicProjectQueryParams } from "../types/project.types";

export const projectApi = {
  getPublished: (params?: PublicProjectQueryParams) =>
    apiClient.paginated<Project>("/api/public/projects", params),
  getBySlug: (slug: string) => apiClient.get<Project>(`/api/public/projects/${slug}`),

  getAll: (params?: ProjectApiQueryParams) =>
    apiClient.paginated<Project>("/api/admin/projects", params),
  getById: (id: string) => apiClient.get<Project>(`/api/admin/projects/${id}`),
  create: (data: CreateProjectPayload) => apiClient.post<Project>("/api/admin/projects", data),
  update: (id: string, data: UpdateProjectPayload) =>
    apiClient.patch<Project>(`/api/admin/projects/${id}`, data),
  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/projects/${id}`),
};
