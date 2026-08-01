"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { achievementApi } from "../api/achievement.api";
import { AchievementQueryParams, CreateAchievementPayload, PublicAchievementQueryParams, UpdateAchievementPayload } from "../types/achievement.types";

export const useAchievement = (id: string) =>
  useQuery({
    queryKey: ["achievements", id],
    queryFn: () => achievementApi.getById(id),
    enabled: !!id,
  });

export const useAchievements = (params?: AchievementQueryParams) =>
  useQuery({
    queryKey: ["achievements", params],
    queryFn: () => achievementApi.getAll(params),
  });

export const useCreateAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAchievementPayload) => achievementApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["achievements"] }),
  });
};

export const useDeleteAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => achievementApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      queryClient.invalidateQueries({
        queryKey: ["achievements", "published"],
      });
    },
  });
};

export const usePublishedAchievements = (params?: PublicAchievementQueryParams) =>
  useQuery({
    queryKey: ["achievements", "published", params],
    queryFn: () => achievementApi.getPublished(params),
  });

export const useUpdateAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAchievementPayload }) =>
      achievementApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      queryClient.invalidateQueries({
        queryKey: ["achievements", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["achievements", "published"],
      });
    },
  });
};
