"use client";
import { create } from "zustand";
import type { AuditAction } from "../types/audit.types";
type AuditUIState = {
  page: number;
  limit: number;
  sort: "createdAt_desc" | "createdAt_asc";
  actorId: string;
  action: AuditAction | "all";
  entityType: string;
  entityId: string;
  from: string;
  to: string;
  selectedAuditLogId: string | null;
  setPage: (page: number) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  limit: 10,
  sort: "createdAt_desc" as const,
  actorId: "",
  action: "all" as const,
  entityType: "",
  entityId: "",
  from: "",
  to: "",
  selectedAuditLogId: null,
};
export const useAuditStore = create<AuditUIState>()((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setLimit: (limit: any) => set({ limit, page: 1 } as any),
  setSort: (sort: any) => set({ sort, page: 1 } as any),
  setActorId: (actorId: any) => set({ actorId, page: 1 }),
  setAction: (action: any) => set({ action, page: 1 }),
  setEntityType: (entityType: any) => set({ entityType, page: 1 }),
  setEntityId: (entityId: any) => set({ entityId, page: 1 }),
  setFrom: (from: any) => set({ from, page: 1 }),
  setTo: (to: any) => set({ to, page: 1 }),
  selectAuditLog: (selectedAuditLogId: string | null) => set({ selectedAuditLogId }),
  resetFilters: () => set({ ...initialState }),
}));
