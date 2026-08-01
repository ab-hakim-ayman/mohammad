import { apiClient } from "@/shared/lib";
import { Service, CreateServicePayload, UpdateServicePayload, ServiceQueryParams, PublicServiceQueryParams } from "../types/service.types";

export const serviceApi = {
  getPublished: (params?: PublicServiceQueryParams) =>
    apiClient.paginated<Service>("/api/public/services", params),

  getBySlug: (slug: string) => apiClient.get<Service>("/api/public/services/" + slug),

  getAll: (params?: ServiceQueryParams) =>
    apiClient.paginated<Service>("/api/admin/services", params),

  getById: (id: string) => apiClient.get<Service>("/api/admin/services/" + id),

  create: (data: CreateServicePayload) => apiClient.post<Service>("/api/admin/services", data),

  update: (id: string, data: UpdateServicePayload) =>
    apiClient.patch<Service>("/api/admin/services/" + id, data),

  delete: (id: string) => apiClient.delete<{ deleted: boolean }>("/api/admin/services/" + id),
};
