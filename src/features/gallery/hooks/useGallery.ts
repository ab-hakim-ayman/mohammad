"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { galleryApi } from "../api/gallery.api";
import { CreateGalleryItemPayload, CreateGalleryPayload, GalleryQueryParams, PublicGalleryQueryParams, UpdateGalleryItemPayload, UpdateGalleryPayload } from "../types/gallery.types";

export const useAddGalleryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ galleryId, data }: { galleryId: string; data: CreateGalleryItemPayload }) =>
      galleryApi.addItem(galleryId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["galleries"] }),
  });
};

export const useCreateGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGalleryPayload) => galleryApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["galleries"] }),
  });
};

export const useDeleteGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => galleryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      queryClient.invalidateQueries({ queryKey: ["galleries", "published"] });
    },
  });
};

export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => galleryApi.deleteItem(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["galleries"] }),
  });
};

export const useGalleries = (params?: GalleryQueryParams) =>
  useQuery({
    queryKey: ["galleries", params],
    queryFn: () => galleryApi.getAll(params),
  });

export const useGallery = (id: string) =>
  useQuery({
    queryKey: ["galleries", id],
    queryFn: () => galleryApi.getById(id),
    enabled: !!id,
  });

export const useGalleryBySlug = (slug: string) =>
  useQuery({
    queryKey: ["galleries", "slug", slug],
    queryFn: () => galleryApi.getBySlug(slug),
    enabled: !!slug,
  });

export const usePublishedGalleries = (params?: PublicGalleryQueryParams) =>
  useQuery({
    queryKey: ["galleries", "published", params],
    queryFn: () => galleryApi.getPublished(params),
  });

export const useUpdateGallery = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGalleryPayload }) =>
      galleryApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      queryClient.invalidateQueries({ queryKey: ["galleries", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["galleries", "slug"] });
      queryClient.invalidateQueries({ queryKey: ["galleries", "published"] });
    },
  });
};

export const useUpdateGalleryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: string; data: UpdateGalleryItemPayload }) =>
      galleryApi.updateItem(itemId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["galleries"] }),
  });
};
