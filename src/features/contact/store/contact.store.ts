"use client";
import { create } from "zustand";
export type ContactStatusFilter = "" | "NEW" | "READ" | "REPLIED" | "ARCHIVED";
type ContactStoreState = {
  page: number;
  statusFilter: ContactStatusFilter;
  setPage: (page: number) => void;
  setStatusFilter: (statusFilter: ContactStatusFilter) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  statusFilter: "" as ContactStatusFilter,
};
export const useContactStore = create<ContactStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  reset: () => set({ page: 1 } as any),
}));
