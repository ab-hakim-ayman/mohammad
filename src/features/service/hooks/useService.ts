"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceApi } from "../api/service.api";
import { CreateServicePayload, PublicServiceQueryParams, ServiceQueryParams, UpdateServicePayload } from "../types/service.types";

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateServicePayload) => serviceApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["services", "published"] });
    },
  });
};

export const usePublishedServices = (params?: PublicServiceQueryParams) =>
  useQuery({
    queryKey: ["services", "published", params],
    queryFn: () => serviceApi.getPublished(params),
  });

export const useService = (id: string) =>
  useQuery({
    queryKey: ["services", id],
    queryFn: () => serviceApi.getById(id),
    enabled: !!id,
  });

export const useServiceBySlug = (slug: string) =>
  useQuery({
    queryKey: ["services", "slug", slug],
    queryFn: () => serviceApi.getBySlug(slug),
    enabled: !!slug,
  });

export const useServices = (params?: ServiceQueryParams) =>
  useQuery({
    queryKey: ["services", params],
    queryFn: () => serviceApi.getAll(params),
  });

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServicePayload }) =>
      serviceApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["services", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["services", "slug"] });
      queryClient.invalidateQueries({ queryKey: ["services", "published"] });
    },
  });
};
