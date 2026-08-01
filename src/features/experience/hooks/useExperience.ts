"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { experienceApi } from "../api/experience.api";
import {
  ExperienceApiQueryParams,
  CreateExperiencePayload,
  PublicExperienceQueryParams,
  UpdateExperiencePayload,
} from "../types/experience.types";

export const useExperience = (id: string) =>
  useQuery({
    queryKey: ["experiences", id],
    queryFn: () => experienceApi.getById(id),
    enabled: !!id,
  });

export const useExperiences = (params?: ExperienceApiQueryParams) =>
  useQuery({
    queryKey: ["experiences", params],
    queryFn: () => experienceApi.getAll(params),
  });

export const useCreateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExperiencePayload) => experienceApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["experiences"] }),
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => experienceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      queryClient.invalidateQueries({ queryKey: ["experiences", "published"] });
    },
  });
};

export const usePublishedExperiences = (params?: PublicExperienceQueryParams) =>
  useQuery({
    queryKey: ["experiences", "published", params],
    queryFn: () => experienceApi.getPublished(params),
  });

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExperiencePayload }) =>
      experienceApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      queryClient.invalidateQueries({ queryKey: ["experiences", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["experiences", "published"] });
    },
  });
};
