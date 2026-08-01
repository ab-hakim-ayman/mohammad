"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { caseStudyApi } from "../api/case-study.api";
import { CreateCaseStudyPayload, UpdateCaseStudyPayload } from "../types/case-study.types";

export const useCaseStudies = (params?: any) =>
  useQuery({
    queryKey: ["case-studies", params],
    queryFn: () => caseStudyApi.getAll(params),
  });

export const useCaseStudy = (id: string) =>
  useQuery({
    queryKey: ["case-studies", id],
    queryFn: () => caseStudyApi.getById(id),
    enabled: !!id,
  });

export const useCaseStudyBySlug = (slug: string) =>
  useQuery({
    queryKey: ["case-studies", "slug", slug],
    queryFn: () => caseStudyApi.getBySlug(slug),
    enabled: !!slug,
  });

export const useCreateCaseStudy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCaseStudyPayload) => caseStudyApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["case-studies"] }),
  });
};

export const useDeleteCaseStudy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => caseStudyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-studies"] });
      queryClient.invalidateQueries({
        queryKey: ["case-studies", "published"],
      });
    },
  });
};

export const usePublishedCaseStudies = (params?: any) =>
  useQuery({
    queryKey: ["case-studies", "published", params],
    queryFn: () => caseStudyApi.getPublished(params),
  });

export const useUpdateCaseStudy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCaseStudyPayload }) =>
      caseStudyApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["case-studies"] });
      queryClient.invalidateQueries({
        queryKey: ["case-studies", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["case-studies", "slug"] });
      queryClient.invalidateQueries({
        queryKey: ["case-studies", "published"],
      });
    },
  });
};
