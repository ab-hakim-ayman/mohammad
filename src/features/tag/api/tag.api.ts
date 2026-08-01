import { apiClient } from "@/shared/lib";
import { Tag, CreateTagPayload, UpdateTagPayload, TagQueryParams } from "../types/tag.types";

export const tagApi = {
  getPublished: (params?: { limit?: number }) => apiClient.get<Tag[]>("/api/public/tags", params),
  getBySlug: (slug: string) => apiClient.get<Tag>(`/api/public/tags/${slug}`),

  getAll: (params?: TagQueryParams) => apiClient.paginated<Tag>("/api/admin/tags", params),
  getById: (id: string) => apiClient.get<Tag>(`/api/admin/tags/${id}`),
  create: (data: CreateTagPayload) => apiClient.post<Tag>("/api/admin/tags", data),
  update: (id: string, data: UpdateTagPayload) =>
    apiClient.patch<Tag>(`/api/admin/tags/${id}`, data),
  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/tags/${id}`),
};
