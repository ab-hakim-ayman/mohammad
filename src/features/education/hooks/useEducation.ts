"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { educationApi } from "../api/education.api";
import {
  EducationApiQueryParams,
  CreateEducationPayload,
  PublicEducationQueryParams,
  UpdateEducationPayload,
} from "../types/education.types";

export const useEducation = (id: string) =>
  useQuery({
    queryKey: ["educations", id],
    queryFn: () => educationApi.getById(id),
    enabled: !!id,
  });

export const useEducations = (params?: EducationApiQueryParams) =>
  useQuery({
    queryKey: ["educations", params],
    queryFn: () => educationApi.getAll(params),
  });

export const useCreateEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEducationPayload) => educationApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["educations"] }),
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => educationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educations"] });
      queryClient.invalidateQueries({ queryKey: ["educations", "published"] });
    },
  });
};

export const usePublishedEducations = (params?: PublicEducationQueryParams) =>
  useQuery({
    queryKey: ["educations", "published", params],
    queryFn: () => educationApi.getPublished(params),
  });

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEducationPayload }) =>
      educationApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["educations"] });
      queryClient.invalidateQueries({ queryKey: ["educations", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["educations", "published"] });
    },
  });
};
