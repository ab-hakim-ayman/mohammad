"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { siteInfoApi } from "../api/site-info.api";
import { CreateSiteInfoPayload } from "../types/site-info.types";

export const useAdminSiteInfo = () =>
  useQuery({ queryKey: ["site-info", "admin"], queryFn: siteInfoApi.getAdmin });

export const usePublicSiteInfo = () =>
  useQuery({
    queryKey: ["site-info", "public"],
    queryFn: siteInfoApi.getPublic,
  });

export const useSaveSiteInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSiteInfoPayload) => siteInfoApi.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-info"] });
    },
  });
};
