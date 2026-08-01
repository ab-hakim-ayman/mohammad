"use client";
import { create } from "zustand";
type SiteInfoStatusFilter = "" | "DRAFT" | "PUBLISHED" | "ARCHIVED";
type SiteInfoStoreState = {
  page: number;
  statusFilter: SiteInfoStatusFilter;
  setPage: (page: number) => void;
  setStatusFilter: (statusFilter: SiteInfoStatusFilter) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  statusFilter: "" as SiteInfoStatusFilter,
};
export const useSiteInfoStore = create<SiteInfoStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  reset: () => set({ page: 1 } as any),
}));
