import { apiClient } from "@/shared/lib";
import { Gallery, CreateGalleryPayload, UpdateGalleryPayload, GalleryQueryParams, PublicGalleryQueryParams, CreateGalleryItemPayload, UpdateGalleryItemPayload } from "../types/gallery.types";

export const galleryApi = {
  getPublished: (params?: PublicGalleryQueryParams) =>
    apiClient.get<Gallery[]>("/api/public/galleries", params),

  getAll: (params?: GalleryQueryParams) =>
    apiClient.paginated<Gallery>("/api/admin/galleries", params),

  getById: (id: string) => apiClient.get<Gallery>("/api/admin/galleries/" + id),

  getBySlug: (slug: string) => apiClient.get<Gallery>("/api/public/galleries/" + slug),

  create: (data: CreateGalleryPayload) => apiClient.post<Gallery>("/api/admin/galleries", data),

  update: (id: string, data: UpdateGalleryPayload) =>
    apiClient.patch<Gallery>("/api/admin/galleries/" + id, data),

  delete: (id: string) => apiClient.delete<{ deleted: boolean }>("/api/admin/galleries/" + id),
  addItem: (galleryId: string, data: any) =>
    apiClient.post("/api/admin/galleries/" + galleryId + "/items", data),
  updateItem: (itemId: string, data: UpdateGalleryItemPayload) =>
    apiClient.patch("/api/admin/galleries/items/" + itemId, data),
  deleteItem: (itemId: string) =>
    apiClient.delete<{ deleted: boolean }>("/api/admin/galleries/items/" + itemId),
};
