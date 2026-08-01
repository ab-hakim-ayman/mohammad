"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "../api/project.api";
import { CreateProjectPayload, ProjectApiQueryParams, PublicProjectQueryParams, UpdateProjectPayload } from "../types/project.types";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectPayload) => projectApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", "published"] });
    },
  });
};

export const useProject = (id: string) =>
  useQuery({
    queryKey: ["projects", id],
    queryFn: () => projectApi.getById(id),
    enabled: !!id,
  });

export const useProjectBySlug = (slug: string) =>
  useQuery({
    queryKey: ["projects", "slug", slug],
    queryFn: () => projectApi.getBySlug(slug),
    enabled: !!slug,
  });

export const useProjects = (params?: ProjectApiQueryParams) =>
  useQuery({
    queryKey: ["projects", params],
    queryFn: () => projectApi.getAll(params),
  });

export const usePublishedProjects = (params?: PublicProjectQueryParams) =>
  useQuery({
    queryKey: ["projects", "published", params],
    queryFn: () => projectApi.getPublished(params),
  });

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectPayload }) =>
      projectApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["projects", "slug"] });
      queryClient.invalidateQueries({ queryKey: ["projects", "published"] });
    },
  });
};
