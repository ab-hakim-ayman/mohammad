import { apiClient } from "@/shared/lib";
import { Hero, CreateHeroPayload, UpdateHeroPayload, HeroQueryParams } from "../types/hero.types";

export const heroApi = {
  getActive: () => apiClient.get<Hero>("/api/public/heroes"),

  getAll: (params?: HeroQueryParams) => apiClient.paginated<Hero>("/api/admin/heroes", params),
  getById: (id: string) => apiClient.get<Hero>(`/api/admin/heroes/${id}`),
  create: (data: CreateHeroPayload) => apiClient.post<Hero>("/api/admin/heroes", data),
  update: (id: string, data: UpdateHeroPayload) =>
    apiClient.patch<Hero>(`/api/admin/heroes/${id}`, data),
  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/heroes/${id}`),
};
