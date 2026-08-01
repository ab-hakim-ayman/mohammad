"use client";
import { create } from "zustand";
export type PartnerStatusFilter = "" | "DRAFT" | "PUBLISHED" | "ARCHIVED";
type PartnerStoreState = {
  page: number;
  statusFilter: PartnerStatusFilter;
  setPage: (page: number) => void;
  setStatusFilter: (statusFilter: PartnerStatusFilter) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  statusFilter: "" as PartnerStatusFilter,
};
export const usePartnerStore = create<PartnerStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  reset: () => set({ page: 1 } as any),
}));
