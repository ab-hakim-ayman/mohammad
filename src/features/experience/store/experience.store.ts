"use client";
import { create } from "zustand";

export type ExperienceStatusFilter = "" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

type ExperienceStoreState = {
  page: number;
  statusFilter: ExperienceStatusFilter;
  setPage: (page: number) => void;
  setStatusFilter: (statusFilter: ExperienceStatusFilter) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  statusFilter: "" as ExperienceStatusFilter,
};

export const useExperienceStore = create<ExperienceStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  reset: () => set({ page: 1 } as any),
}));
