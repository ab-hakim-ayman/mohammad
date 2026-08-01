"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";
import type {
  ProfilePayload,
  ProfileQueryParams,
  ProfileVisibilityPayload,
} from "../types/profile.types";

export const useMyProfile = () =>
  useQuery({ queryKey: ["profile", "me"], queryFn: profileApi.getMe });

export const useProfile = (id: string) =>
  useQuery({
    queryKey: ["profile", id],
    queryFn: () => profileApi.getById(id),
    enabled: !!id,
  });

export const useProfiles = (params?: ProfileQueryParams) =>
  useQuery({
    queryKey: ["profiles", params],
    queryFn: () => profileApi.getAll(params),
  });

export const useTeamProfiles = () =>
  useQuery({
    queryKey: ["profile", "team"],
    queryFn: profileApi.getTeamProfiles,
  });

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfilePayload) => profileApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProfilePayload }) =>
      profileApi.updateById(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["profile", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

export const useUpdateProfileVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProfileVisibilityPayload }) =>
      profileApi.updateVisibility(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["profile", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};
