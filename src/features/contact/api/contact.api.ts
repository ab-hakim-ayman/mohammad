import { apiClient } from "@/shared/lib";
import { Contact, CreateContactPayload, UpdateContactPayload, ContactQueryValidated } from "../types/contact.types";

export const contactApi = {
  submit: (data: CreateContactPayload) => apiClient.post<Contact>("/api/contacts", data),

  getAll: (params?: ContactQueryValidated) =>
    apiClient.paginated<Contact>("/api/admin/contacts", params),

  getById: (id: string) => apiClient.get<Contact>(`/api/admin/contacts/${id}`),

  update: (id: string, data: UpdateContactPayload) =>
    apiClient.patch<Contact>(`/api/admin/contacts/${id}`, data),

  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/contacts/${id}`),
};
