import { apiClient } from "@/shared/lib";
import { Testimonial, CreateTestimonialPayload, UpdateTestimonialPayload, TestimonialQueryParams } from "../types/testimonial.types";

export const testimonialApi = {
  getPublished: (params?: { featured?: boolean; limit?: number }) =>
    apiClient.get<Testimonial[]>("/api/public/testimonials", params),

  getAll: (params?: TestimonialQueryParams) =>
    apiClient.paginated<Testimonial>("/api/admin/testimonials", params),
  getById: (id: string) => apiClient.get<Testimonial>(`/api/admin/testimonials/${id}`),
  create: (data: CreateTestimonialPayload) =>
    apiClient.post<Testimonial>("/api/admin/testimonials", data),
  update: (id: string, data: UpdateTestimonialPayload) =>
    apiClient.patch<Testimonial>(`/api/admin/testimonials/${id}`, data),
  delete: (id: string) => apiClient.delete<{ deleted: boolean }>(`/api/admin/testimonials/${id}`),
};
