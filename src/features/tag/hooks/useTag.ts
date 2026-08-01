"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tagApi } from "../api/tag.api";
import { CreateTagPayload, TagQueryParams, UpdateTagPayload } from "../types/tag.types";

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTagPayload) => tagApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tagApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["tags", "published"] });
    },
  });
};

export const usePublishedTags = (limit?: number) =>
  useQuery({
    queryKey: ["tags", "published", { limit }],
    queryFn: () => tagApi.getPublished({ limit }),
  });

export const useTag = (id: string) =>
  useQuery({
    queryKey: ["tags", id],
    queryFn: () => tagApi.getById(id),
    enabled: !!id,
  });

export const useTagBySlug = (slug: string) =>
  useQuery({
    queryKey: ["tags", "slug", slug],
    queryFn: () => tagApi.getBySlug(slug),
    enabled: !!slug,
  });

export const useTags = (params?: TagQueryParams) =>
  useQuery({
    queryKey: ["tags", params],
    queryFn: () => tagApi.getAll(params),
  });

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTagPayload }) => tagApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["tags", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tags", "slug"] });
    },
  });
};
