"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { faqApi } from "../api/faq.api";
import { CreateFaqPayload, FaqQueryParams, PublicFaqQueryParams, UpdateFaqPayload } from "../types/faq.types";

export const useCreateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFaqPayload) => faqApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faqs"] }),
  });
};

export const useDeleteFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => faqApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs", "published"] });
    },
  });
};

export const useFaq = (id: string) =>
  useQuery({
    queryKey: ["faqs", id],
    queryFn: () => faqApi.getById(id),
    enabled: !!id,
  });

export const useFaqs = (params?: FaqQueryParams) =>
  useQuery({
    queryKey: ["faqs", params],
    queryFn: () => faqApi.getAll(params),
  });

export const usePublishedFaqs = (params?: PublicFaqQueryParams) =>
  useQuery({
    queryKey: ["faqs", "published", params],
    queryFn: () => faqApi.getPublished(params),
  });

export const useUpdateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFaqPayload }) => faqApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["faqs", "published"] });
    },
  });
};
