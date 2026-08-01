"use client";
import { create } from "zustand";
type SkillSectionState = {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  [key: string]: any;
};

const initialState = {
  selectedCategory: "",
};

export const useSkillSectionStore = create<SkillSectionState>((set) => ({
  ...initialState,
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  reset: () => set({ page: 1 } as any),
}));
