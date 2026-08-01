"use client";
import { create } from "zustand";
type BlogSectionState = {
  page: number;
  setPage: (page: number) => void;
  reset: () => void;
};

export const useBlogSectionStore = create<any>((set: any) => ({
  page: 1,
  setPage: (page: any) => set({ page }),
  reset: () => set({ page: 1 } as any),
}));
