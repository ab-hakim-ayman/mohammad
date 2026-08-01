"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { heroApi } from "../api/hero.api";
import { CreateHeroPayload, HeroQueryParams, UpdateHeroPayload } from "../types/hero.types";

export const useActiveHero = () =>
  useQuery({ queryKey: ["heroes", "active"], queryFn: heroApi.getActive });

export const useCreateHero = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHeroPayload) => heroApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["heroes"] }),
  });
};

export const useDeleteHero = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => heroApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroes"] });
      queryClient.invalidateQueries({ queryKey: ["heroes", "active"] });
    },
  });
};

export const useHero = (id: string) =>
  useQuery({
    queryKey: ["heroes", id],
    queryFn: () => heroApi.getById(id),
    enabled: !!id,
  });

export const useHeroes = (params?: HeroQueryParams) =>
  useQuery({
    queryKey: ["heroes", params],
    queryFn: () => heroApi.getAll(params),
  });

export const useUpdateHero = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHeroPayload }) => heroApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["heroes"] });
      queryClient.invalidateQueries({ queryKey: ["heroes", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["heroes", "active"] });
    },
  });
};
