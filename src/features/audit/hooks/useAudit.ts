"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { auditApi } from "../api/audit.api";
import type { AuditLogQueryParams } from "../types/audit.types";

export const useAuditLog = (id: string) =>
  useQuery({
    queryKey: ["audit-logs", id],
    queryFn: () => auditApi.getById(id),
    enabled: !!id,
  });

export const useAuditLogs = (params?: AuditLogQueryParams) =>
  useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => auditApi.getAll(params),
  });

export const useDeleteAuditLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => auditApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    },
  });
};
