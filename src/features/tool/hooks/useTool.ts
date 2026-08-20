"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toolApi } from "../api/tool.api";
import type {
  CreateToolPayload,
  ToolQueryParams,
  UpdateToolPayload,
} from "../types/tool.types";

export const useCreateTool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateToolPayload) => toolApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
  });
};

export const useDeleteTool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toolApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tools", "published"] });
    },
  });
};

export const usePublishedTools = (params?: { category?: string; featured?: boolean; limit?: number; search?: string }) =>
  useQuery({
    queryKey: ["tools", "published", params],
    queryFn: () => toolApi.getPublished(params),
  });

export const useTools = (params?: ToolQueryParams) =>
  useQuery({
    queryKey: ["tools", params],
    queryFn: () => toolApi.getAll(params),
  });

export const useTool = (id: string) =>
  useQuery({
    queryKey: ["tools", id],
    queryFn: () => toolApi.getById(id),
    enabled: !!id,
  });

export const useToolBySlug = (slug: string) =>
  useQuery({
    queryKey: ["tools", "slug", slug],
    queryFn: () => toolApi.getBySlug(slug),
    enabled: !!slug,
  });

export const useUpdateTool = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateToolPayload }) =>
      toolApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tools", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tools", "published"] });
    },
  });
};
