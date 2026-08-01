"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aboutApi } from "../api/about.api";
import { CreateAboutPayload } from "../types/about.types";

export const useAdminAbout = () =>
  useQuery({ queryKey: ["about", "admin"], queryFn: aboutApi.getAdmin });

export const useSaveAbout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAboutPayload) => aboutApi.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
    },
  });
};

export const usePublishedAbout = () =>
  useQuery({
    queryKey: ["about", "published"],
    queryFn: aboutApi.getPublished,
  });
