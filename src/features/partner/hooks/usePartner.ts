"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { partnerApi } from "../api/partner.api";
import { CreatePartnerPayload, PartnerQueryParams, PublicPartnerQueryParams, UpdatePartnerPayload } from "../types/partner.types";

export const useCreatePartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePartnerPayload) => partnerApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partners"] }),
  });
};

export const useDeletePartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partnerApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      queryClient.invalidateQueries({ queryKey: ["partners", "published"] });
    },
  });
};

export const usePartner = (id: string) =>
  useQuery({
    queryKey: ["partners", id],
    queryFn: () => partnerApi.getById(id),
    enabled: !!id,
  });

export const usePartners = (params?: PartnerQueryParams) =>
  useQuery({
    queryKey: ["partners", params],
    queryFn: () => partnerApi.getAll(params),
  });

export const usePublishedPartners = (params?: PublicPartnerQueryParams) =>
  useQuery({
    queryKey: ["partners", "published", params],
    queryFn: () => partnerApi.getPublished(params),
  });

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePartnerPayload }) =>
      partnerApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      queryClient.invalidateQueries({ queryKey: ["partners", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["partners", "published"] });
    },
  });
};
