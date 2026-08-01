"use client";
import { create } from "zustand";

type AchievementStoreState = {
  page: number;
  setPage: (page: number) => void;
  reset: () => void;
};

export const useAchievementStore = create<any>((set: any) => ({
  page: 1,
  setPage: (page: any) => set({ page }),
  reset: () => set({ page: 1 } as any),
}));
