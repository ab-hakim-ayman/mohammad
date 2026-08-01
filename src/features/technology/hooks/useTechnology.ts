"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { technologyApi } from "../api/technology.api";
import { CreateTechnologyPayload, TechnologyQueryParams, UpdateTechnologyPayload } from "../types/technology.types";

export const useCreateTechnology = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTechnologyPayload) => technologyApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["technologies"] }),
  });
};

export const useDeleteTechnology = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => technologyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technologies"] });
      queryClient.invalidateQueries({
        queryKey: ["technologies", "published"],
      });
    },
  });
};

export const usePublishedTechnologies = (category?: string, limit?: number) =>
  useQuery({
    queryKey: ["technologies", "published", { category, limit }],
    queryFn: () => technologyApi.getPublished({ category, limit }),
  });

export const useTechnologies = (params?: TechnologyQueryParams) =>
  useQuery({
    queryKey: ["technologies", params],
    queryFn: () => technologyApi.getAll(params),
  });

export const useTechnology = (id: string) =>
  useQuery({
    queryKey: ["technologies", id],
    queryFn: () => technologyApi.getById(id),
    enabled: !!id,
  });

export const useUpdateTechnology = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTechnologyPayload }) =>
      technologyApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["technologies"] });
      queryClient.invalidateQueries({
        queryKey: ["technologies", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["technologies", "published"],
      });
    },
  });
};
