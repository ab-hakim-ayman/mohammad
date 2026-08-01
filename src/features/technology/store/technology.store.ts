"use client";
import { create } from "zustand";
export type TechnologyStatusFilter = "" | "DRAFT" | "PUBLISHED" | "ARCHIVED";
type TechnologyStoreState = {
  page: number;
  statusFilter: TechnologyStatusFilter;
  setPage: (page: number) => void;
  setStatusFilter: (statusFilter: TechnologyStatusFilter) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  statusFilter: "" as TechnologyStatusFilter,
};
export const useTechnologyStore = create<TechnologyStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  reset: () => set({ page: 1 } as any),
}));
