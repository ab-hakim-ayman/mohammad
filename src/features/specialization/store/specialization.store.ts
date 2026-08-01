"use client";
import { create } from "zustand";
export type SpecializationStatusFilter = "" | "DRAFT" | "PUBLISHED" | "ARCHIVED";
type SpecializationStoreState = {
  page: number;
  statusFilter: SpecializationStatusFilter;
  setPage: (page: number) => void;
  setStatusFilter: (statusFilter: SpecializationStatusFilter) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  statusFilter: "" as SpecializationStatusFilter,
};
export const useSpecializationStore = create<SpecializationStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  reset: () => set({ page: 1 } as any),
}));
