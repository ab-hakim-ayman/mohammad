"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactApi } from "../api/contact.api";
import { ContactQueryValidated, CreateContactPayload, UpdateContactPayload } from "../types/contact.types";

export const useContact = (id: string) =>
  useQuery({
    queryKey: ["contacts", id],
    queryFn: () => contactApi.getById(id),
    enabled: !!id,
  });

export const useContacts = (params?: ContactQueryValidated) =>
  useQuery({
    queryKey: ["contacts", params],
    queryFn: () => contactApi.getAll(params),
  });

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useSubmitContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateContactPayload) => contactApi.submit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactPayload }) =>
      contactApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contacts", variables.id] });
    },
  });
};
