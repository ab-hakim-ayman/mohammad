"use client";
import { create } from "zustand";
type GalleryStoreState = {
  page: number;
  statusFilter: string;
  setPage: (page: number) => void;
  setStatusFilter: (filter: string) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  statusFilter: "",
};
export const useGalleryStore = create<GalleryStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  reset: () => set({ page: 1 } as any),
}));
