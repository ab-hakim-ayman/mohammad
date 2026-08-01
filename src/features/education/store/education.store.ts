"use client";
import { create } from "zustand";

export type EducationStatusFilter = "" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

type EducationStoreState = {
  page: number;
  statusFilter: EducationStatusFilter;
  setPage: (page: number) => void;
  setStatusFilter: (statusFilter: EducationStatusFilter) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  statusFilter: "" as EducationStatusFilter,
};

export const useEducationStore = create<EducationStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  reset: () => set({ page: 1 } as any),
}));
