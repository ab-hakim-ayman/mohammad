"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { specializationApi } from "../api/specialization.api";
import { CreateSpecializationPayload, SpecializationQueryParams, UpdateSpecializationPayload } from "../types/specialization.types";

export const useCreateSpecialization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSpecializationPayload) => specializationApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["specializations"] }),
  });
};

export const useDeleteSpecialization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => specializationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
      queryClient.invalidateQueries({
        queryKey: ["specializations", "published"],
      });
    },
  });
};

export const usePublishedSpecializations = () =>
  useQuery({
    queryKey: ["specializations", "published"],
    queryFn: specializationApi.getPublished,
  });

export const useSpecialization = (id: string) =>
  useQuery({
    queryKey: ["specializations", id],
    queryFn: () => specializationApi.getById(id),
    enabled: !!id,
  });

export const useSpecializations = (params?: SpecializationQueryParams) =>
  useQuery({
    queryKey: ["specializations", params],
    queryFn: () => specializationApi.getAll(params),
  });

export const useUpdateSpecialization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSpecializationPayload }) =>
      specializationApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
      queryClient.invalidateQueries({
        queryKey: ["specializations", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["specializations", "published"],
      });
    },
  });
};
