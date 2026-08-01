"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogApi } from "../api/blog.api";
import { BlogApiQueryParams, CreateBlogPayload, PublicBlogQueryParams, UpdateBlogPayload } from "../types/blog.types";

export const useBlog = (id: string) =>
  useQuery({
    queryKey: ["blogs", id],
    queryFn: () => blogApi.getById(id),
    enabled: !!id,
  });

export const useBlogBySlug = (slug: string) =>
  useQuery({
    queryKey: ["blogs", "slug", slug],
    queryFn: () => blogApi.getBySlug(slug),
    enabled: !!slug,
  });

export const useBlogs = (params?: BlogApiQueryParams) =>
  useQuery({
    queryKey: ["blogs", params],
    queryFn: () => blogApi.getAll(params),
  });

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBlogPayload) => blogApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogs"] }),
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "published"] });
    },
  });
};

export const usePublishedBlogs = (params?: PublicBlogQueryParams) =>
  useQuery({
    queryKey: ["blogs", "published", params],
    queryFn: () => blogApi.getPublished(params),
  });

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogPayload }) => blogApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "slug"] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "published"] });
    },
  });
};
