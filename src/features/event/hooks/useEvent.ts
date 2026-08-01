"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "../api/event.api";
import { CreateEventPayload, EventApiQueryParams, PublicEventQueryParams, UpdateEventPayload } from "../types/event.types";

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventPayload) => eventApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", "published"] });
    },
  });
};

export const useEvent = (id: string) =>
  useQuery({
    queryKey: ["events", id],
    queryFn: () => eventApi.getById(id),
    enabled: !!id,
  });

export const useEventBySlug = (slug: string) =>
  useQuery({
    queryKey: ["events", "slug", slug],
    queryFn: () => eventApi.getBySlug(slug),
    enabled: !!slug,
  });

export const useEvents = (params?: EventApiQueryParams) =>
  useQuery({
    queryKey: ["events", params],
    queryFn: () => eventApi.getAll(params),
  });

export const usePublishedEvents = (params?: PublicEventQueryParams) =>
  useQuery({
    queryKey: ["events", "published", params],
    queryFn: () => eventApi.getPublished(params),
  });

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventPayload }) =>
      eventApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["events", "slug"] });
      queryClient.invalidateQueries({ queryKey: ["events", "published"] });
    },
  });
};
