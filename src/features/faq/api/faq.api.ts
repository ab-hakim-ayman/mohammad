import { apiClient } from "@/shared/lib";
import { Faq, CreateFaqPayload, UpdateFaqPayload, FaqQueryParams, PublicFaqQueryParams } from "../types/faq.types";

export const faqApi = {
  getPublished: (params?: PublicFaqQueryParams) => apiClient.get<Faq[]>("/api/public/faqs", params),

  getAll: (params?: FaqQueryParams) => apiClient.paginated<Faq>("/api/admin/faqs", params),

  getById: (id: string) => apiClient.get<Faq>("/api/admin/faqs/" + id),

  create: (data: CreateFaqPayload) => apiClient.post<Faq>("/api/admin/faqs", data),

  update: (id: string, data: UpdateFaqPayload) =>
    apiClient.patch<Faq>("/api/admin/faqs/" + id, data),

  delete: (id: string) => apiClient.delete<{ deleted: boolean }>("/api/admin/faqs/" + id),
};
