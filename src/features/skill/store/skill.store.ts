"use client";
import { create } from "zustand";
export type SkillSortOption = "createdAt_desc" | "createdAt_asc" | "order_asc" | "title_asc";
export type SkillUIState = {
  search: string;
  page: number;
  limit: number;
  sort: SkillSortOption;
  category: string;
  selectedSkillId: string | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  limit: 10,
  sort: "createdAt_desc" as SkillSortOption,
  category: "",
  selectedSkillId: null as string | null,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  search: "",
};
export const useSkillStore = create<SkillUIState>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit: any) => set({ limit, page: 1 } as any),
  setSort: (sort: any) => set({ sort, page: 1 } as any),
  setCategory: (category: any) => set({ category, page: 1 }),
  selectSkill: (selectedSkillId: string | null) => set({ selectedSkillId }),
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  openEditModal: (skillId: string) =>
    set({ isEditModalOpen: true, selectedSkillId: skillId ?? null }),
  closeEditModal: () => set({ isEditModalOpen: false }),
  resetFilters: () => set(initialState),
}));
