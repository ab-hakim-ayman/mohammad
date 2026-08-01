"use client";
import { create } from "zustand";
export type ProjectStatusFilter = "" | "DRAFT" | "PUBLISHED" | "ARCHIVED";
type ProjectStoreState = {
  page: number;
  statusFilter: ProjectStatusFilter;
  setPage: (page: number) => void;
  setStatusFilter: (statusFilter: ProjectStatusFilter) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  statusFilter: "" as ProjectStatusFilter,
};
export const useProjectStore = create<ProjectStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  reset: () => set({ page: 1 } as any),
}));
