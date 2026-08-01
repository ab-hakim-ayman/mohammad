import { apiClient } from "@/shared/lib";
import { Event, CreateEventPayload, UpdateEventPayload, EventApiQueryParams, PublicEventQueryParams } from "../types/event.types";

export const eventApi = {
  getPublished: (params?: PublicEventQueryParams) =>
    apiClient.get<Event[]>("/api/public/events", params),

  getAll: (params?: EventApiQueryParams) => apiClient.paginated<Event>("/api/admin/events", params),

  getById: (id: string) => apiClient.get<Event>("/api/admin/events/" + id),

  getBySlug: (slug: string) => apiClient.get<Event>("/api/public/events/" + slug),

  create: (data: CreateEventPayload) => apiClient.post<Event>("/api/admin/events", data),

  update: (id: string, data: UpdateEventPayload) =>
    apiClient.patch<Event>("/api/admin/events/" + id, data),

  delete: (id: string) => apiClient.delete<{ deleted: boolean }>("/api/admin/events/" + id),
};
