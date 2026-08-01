"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mediaApi } from "../api/media.api";
import type {
  MediaQueryValidated,
  MediaUpdatePayload,
  MediaUploadInput,
} from "../types/media.types";

export const useAttachMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Parameters<typeof mediaApi.attach>[1] }) =>
      (await mediaApi.attach(id, data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media"] }),
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await mediaApi.delete(id)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media"] }),
  });
};

export const useDetachMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (attachmentId: string) => (await mediaApi.detach(attachmentId)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media"] }),
  });
};

export const useMedia = (params?: MediaQueryValidated) =>
  useQuery({
    queryKey: ["media", params],
    queryFn: async () => (await mediaApi.getAll(params)).data,
  });

export const useMediaItem = (id: string) =>
  useQuery({
    queryKey: ["media", id],
    queryFn: async () => (await mediaApi.getById(id)).data,
    enabled: !!id,
  });

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: MediaUpdatePayload }) =>
      (await mediaApi.update(id, data)).data,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      queryClient.invalidateQueries({ queryKey: ["media", variables.id] });
    },
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: MediaUploadInput) => (await mediaApi.upload(input)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media"] }),
  });
};
