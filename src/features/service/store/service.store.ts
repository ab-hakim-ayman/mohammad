"use client";
import { create } from "zustand";
export type ServiceStatusFilter = "" | "DRAFT" | "PUBLISHED" | "ARCHIVED";
type ServiceStoreState = {
  page: number;
  statusFilter: ServiceStatusFilter;
  setPage: (page: number) => void;
  setStatusFilter: (statusFilter: ServiceStatusFilter) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  statusFilter: "" as ServiceStatusFilter,
};
export const useServiceStore = create<ServiceStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  reset: () => set({ page: 1 } as any),
}));
