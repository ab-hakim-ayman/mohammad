import { apiClient } from "@/shared/lib";
import type { Tool, CreateToolPayload, UpdateToolPayload, ToolQueryParams } from "../types/tool.types";

export const toolApi = {
  getPublished: (params?: { category?: string; featured?: boolean; limit?: number; search?: string }) =>
    apiClient.get<Tool[]>("/api/public/tools", params),

  getBySlug: (slug: string) =>
    apiClient.get<Tool>(`/api/public/tools/${slug}`),

  getAll: (params?: ToolQueryParams) =>
    apiClient.paginated<Tool>("/api/admin/tools", params),

  getById: (id: string) =>
    apiClient.get<Tool>(`/api/admin/tools/${id}`),

  create: (data: CreateToolPayload) =>
    apiClient.post<Tool>("/api/admin/tools", data),

  update: (id: string, data: UpdateToolPayload) =>
    apiClient.patch<Tool>(`/api/admin/tools/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<{ deleted: boolean }>(`/api/admin/tools/${id}`),
};
