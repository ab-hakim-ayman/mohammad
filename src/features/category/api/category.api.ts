import { apiClient } from "@/shared/lib";
import { Category, CreateCategoryPayload, UpdateCategoryPayload, CategoryQueryParams } from "../types/category.types";

export const categoryApi = {
  getPublished: (params?: { limit?: number }) =>
    apiClient.get<Category[]>("/api/public/categories", params),
  getBySlug: (slug: string) => apiClient.get<Category>(`/api/public/categories/${slug}`),

  getAll: (params?: CategoryQueryParams) =>
    apiClient.paginated<Category>("/api/admin/categories", params),
  getById: (id: string) => apiClient.get<Category>(`/api/admin/categories/${id}`),
  create: (data: CreateCategoryPayload) => apiClient.post<Category>("/api/admin/categories", data),
  update: (id: string, data: UpdateCategoryPayload) =>
    apiClient.patch<Category>(`/api/admin/categories/${id}`, data),
  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/categories/${id}`),
};
