import { apiClient } from "@/shared/lib";
import { About, CreateAboutPayload } from "../types/about.types";

export const aboutApi = {
  getPublished: () => apiClient.get<About>("/api/public/about"),
  getAdmin: () => apiClient.get<About | null>("/api/admin/about"),
  save: (data: CreateAboutPayload) => apiClient.put<About>("/api/admin/about", data),
};
