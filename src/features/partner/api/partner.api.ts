import { apiClient } from "@/shared/lib";
import { Partner, CreatePartnerPayload, UpdatePartnerPayload, PartnerQueryParams, PublicPartnerQueryParams } from "../types/partner.types";

export const partnerApi = {
  getPublished: (params?: PublicPartnerQueryParams) =>
    apiClient.get<Partner[]>("/api/public/partners", params),

  getAll: (params?: PartnerQueryParams) =>
    apiClient.paginated<Partner>("/api/admin/partners", params),

  getById: (id: string) => apiClient.get<Partner>("/api/admin/partners/" + id),

  create: (data: CreatePartnerPayload) => apiClient.post<Partner>("/api/admin/partners", data),

  update: (id: string, data: UpdatePartnerPayload) =>
    apiClient.patch<Partner>("/api/admin/partners/" + id, data),

  delete: (id: string) => apiClient.delete<{ deleted: boolean }>("/api/admin/partners/" + id),
};
