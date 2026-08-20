"use client";

import { create } from "zustand";

export type ToolStatusFilter = "" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

type ToolStoreState = {
  page: number;
  statusFilter: ToolStatusFilter;
  selectedCategory: string;
  searchQuery: string;
  setPage: (page: number) => void;
  setStatusFilter: (statusFilter: ToolStatusFilter) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (search: string) => void;
  reset: () => void;
};

const initialState = {
  page: 1,
  statusFilter: "" as ToolStatusFilter,
  selectedCategory: "ALL",
  searchQuery: "",
};

export const useToolStore = create<ToolStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory, page: 1 }),
  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),
  reset: () => set(initialState),
}));
