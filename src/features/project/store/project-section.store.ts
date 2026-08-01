"use client";
import { create } from "zustand";
type ProjectSectionState = {
  page: number;
  setPage: (page: number) => void;
  reset: () => void;
};

export const useProjectSectionStore = create<any>((set: any) => ({
  page: 1,
  setPage: (page: any) => set({ page }),
  reset: () => set({ page: 1 } as any),
}));
