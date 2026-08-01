"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { industryApi } from "../api/industry.api";
import { CreateIndustryPayload, IndustryQueryParams, UpdateIndustryPayload } from "../types/industry.types";

export const useCreateIndustry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIndustryPayload) => industryApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["industries"] }),
  });
};

export const useDeleteIndustry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => industryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["industries"] });
      queryClient.invalidateQueries({ queryKey: ["industries", "published"] });
    },
  });
};

export const useIndustries = (params?: IndustryQueryParams) =>
  useQuery({
    queryKey: ["industries", params],
    queryFn: () => industryApi.getAll(params),
  });

export const useIndustry = (id: string) =>
  useQuery({
    queryKey: ["industries", id],
    queryFn: () => industryApi.getById(id),
    enabled: !!id,
  });

export const useIndustryBySlug = (slug: string) =>
  useQuery({
    queryKey: ["industries", "slug", slug],
    queryFn: () => industryApi.getBySlug(slug),
    enabled: !!slug,
  });

export const usePublishedIndustries = (limit?: number) =>
  useQuery({
    queryKey: ["industries", "published", { limit }],
    queryFn: () => industryApi.getPublished({ limit }),
  });

export const useUpdateIndustry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIndustryPayload }) =>
      industryApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["industries"] });
      queryClient.invalidateQueries({ queryKey: ["industries", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["industries", "slug"] });
    },
  });
};
