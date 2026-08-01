"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "../api/client.api";
import { ClientQueryParams, CreateClientPayload, PublicClientQueryParams, UpdateClientPayload } from "../types/client.types";

export const useClient = (id: string) =>
  useQuery({
    queryKey: ["clients", id],
    queryFn: () => clientApi.getById(id),
    enabled: !!id,
  });

export const useClients = (params?: ClientQueryParams) =>
  useQuery({
    queryKey: ["clients", params],
    queryFn: () => clientApi.getAll(params),
  });

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClientPayload) => clientApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clients"] }),
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients", "published"] });
    },
  });
};

export const usePublishedClients = (params?: PublicClientQueryParams) =>
  useQuery({
    queryKey: ["clients", "published", params],
    queryFn: () => clientApi.getPublished(params),
  });

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientPayload }) =>
      clientApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["clients", "published"] });
    },
  });
};
