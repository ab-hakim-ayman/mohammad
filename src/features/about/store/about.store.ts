"use client";
import { create } from "zustand";
type AboutStoreState = {
  page: number;
  setPage: (page: number) => void;
  reset: () => void;
};

export const useAboutStore = create<any>((set: any) => ({
  page: 1,
  setPage: (page: any) => set({ page }),
  reset: () => set({ page: 1 } as any),
}));
