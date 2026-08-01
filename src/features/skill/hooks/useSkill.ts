"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { skillApi } from "../api/skill.api";
import { CreateSkillPayload, SkillQueryParams, UpdateSkillPayload } from "../types/skill.types";

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSkillPayload) => skillApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["skills", "categories"] });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => skillApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["skills", "published"] });
      queryClient.invalidateQueries({ queryKey: ["skills", "categories"] });
    },
  });
};

export const usePublishedSkills = (category?: string, limit?: number) =>
  useQuery({
    queryKey: ["skills", "published", { category, limit }],
    queryFn: () => skillApi.getPublished({ category, limit }),
  });

export const useSkill = (id: string) =>
  useQuery({
    queryKey: ["skills", id],
    queryFn: () => skillApi.getById(id),
    enabled: !!id,
  });

export const useSkillCategories = () =>
  useQuery({
    queryKey: ["skills", "categories"],
    queryFn: skillApi.getCategories,
  });

export const useSkills = (params?: SkillQueryParams) =>
  useQuery({
    queryKey: ["skills", params],
    queryFn: () => skillApi.getAll(params),
  });

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSkillPayload }) =>
      skillApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["skills", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["skills", "published"] });
      queryClient.invalidateQueries({ queryKey: ["skills", "categories"] });
    },
  });
};
