import { apiClient } from "@/shared/lib";
import { Blog, CreateBlogPayload, UpdateBlogPayload, BlogApiQueryParams, PublicBlogQueryParams } from "../types/blog.types";

export const blogApi = {
  getPublished: (params?: PublicBlogQueryParams) =>
    apiClient.paginated<Blog>("/api/public/blogs", params),
  getBySlug: (slug: string) => apiClient.get<Blog>(`/api/public/blogs/${slug}`),

  getAll: (params?: BlogApiQueryParams) => apiClient.paginated<Blog>("/api/admin/blogs", params),
  getById: (id: string) => apiClient.get<Blog>(`/api/admin/blogs/${id}`),
  create: (data: CreateBlogPayload) => apiClient.post<Blog>("/api/admin/blogs", data),
  update: (id: string, data: UpdateBlogPayload) =>
    apiClient.patch<Blog>(`/api/admin/blogs/${id}`, data),
  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/blogs/${id}`),
};
