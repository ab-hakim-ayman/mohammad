"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/category.api";
import { CategoryQueryParams, CreateCategoryPayload, UpdateCategoryPayload } from "../types/category.types";

export const useCategories = (params?: CategoryQueryParams) =>
  useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoryApi.getAll(params),
  });

export const useCategory = (id: string) =>
  useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoryApi.getById(id),
    enabled: !!id,
  });

export const useCategoryBySlug = (slug: string) =>
  useQuery({
    queryKey: ["categories", "slug", slug],
    queryFn: () => categoryApi.getBySlug(slug),
    enabled: !!slug,
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryPayload) => categoryApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", "published"] });
    },
  });
};

export const usePublishedCategories = (limit?: number) =>
  useQuery({
    queryKey: ["categories", "published", { limit }],
    queryFn: () => categoryApi.getPublished({ limit }),
  });

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryPayload }) =>
      categoryApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["categories", "slug"] });
    },
  });
};
