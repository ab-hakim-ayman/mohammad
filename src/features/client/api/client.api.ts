import { apiClient } from "@/shared/lib";
import { Client, CreateClientPayload, UpdateClientPayload, ClientQueryParams, PublicClientQueryParams } from "../types/client.types";

export const clientApi = {
  getPublished: (params?: PublicClientQueryParams) =>
    apiClient.get<Client[]>("/api/public/clients", params),

  getAll: (params?: ClientQueryParams) => apiClient.paginated<Client>("/api/admin/clients", params),

  getById: (id: string) => apiClient.get<Client>("/api/admin/clients/" + id),

  create: (data: CreateClientPayload) => apiClient.post<Client>("/api/admin/clients", data),

  update: (id: string, data: UpdateClientPayload) =>
    apiClient.patch<Client>("/api/admin/clients/" + id, data),

  delete: (id: string) => apiClient.delete<{ deleted: boolean }>("/api/admin/clients/" + id),
};
