"use client";
import { create } from "zustand";
export type BlogStatusFilter = "" | "DRAFT" | "PUBLISHED" | "ARCHIVED";
type BlogStoreState = {
  page: number;
  statusFilter: BlogStatusFilter;
  setPage: (page: number) => void;
  setStatusFilter: (statusFilter: BlogStatusFilter) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  statusFilter: "" as BlogStatusFilter,
};
export const useBlogStore = create<BlogStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  reset: () => set({ page: 1 } as any),
}));
