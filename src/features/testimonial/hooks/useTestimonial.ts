"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { testimonialApi } from "../api/testimonial.api";
import { CreateTestimonialPayload, TestimonialQueryParams, UpdateTestimonialPayload } from "../types/testimonial.types";

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTestimonialPayload) => testimonialApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["testimonials"] }),
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => testimonialApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({
        queryKey: ["testimonials", "published"],
      });
    },
  });
};

export const usePublishedTestimonials = (featured?: boolean, limit?: number) =>
  useQuery({
    queryKey: ["testimonials", "published", { featured, limit }],
    queryFn: () => testimonialApi.getPublished({ featured, limit }),
  });

export const useTestimonial = (id: string) =>
  useQuery({
    queryKey: ["testimonials", id],
    queryFn: () => testimonialApi.getById(id),
    enabled: !!id,
  });

export const useTestimonials = (params?: TestimonialQueryParams) =>
  useQuery({
    queryKey: ["testimonials", params],
    queryFn: () => testimonialApi.getAll(params),
  });

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTestimonialPayload }) =>
      testimonialApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({
        queryKey: ["testimonials", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["testimonials", "published"],
      });
    },
  });
};
