"use client";
import { create } from "zustand";
type FaqStatusFilter = "" | "published" | "unpublished";
type FaqStoreState = {
  page: number;
  search: string;
  category: string;
  statusFilter: FaqStatusFilter;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setStatusFilter: (statusFilter: FaqStatusFilter) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  search: "",
  category: "",
  statusFilter: "" as FaqStatusFilter,
};
export const useFaqStore = create<FaqStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setSearch: (search) => set({ search, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  reset: () => set({ page: 1 } as any),
}));
