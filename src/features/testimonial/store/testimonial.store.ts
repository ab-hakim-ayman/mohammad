"use client";
import { create } from "zustand";
export type TestimonialFilter = "all" | "published" | "featured";
type TestimonialStoreState = {
  page: number;
  filter: TestimonialFilter;
  setPage: (page: number) => void;
  setFilter: (filter: TestimonialFilter) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  filter: "all" as TestimonialFilter,
};
export const useTestimonialStore = create<TestimonialStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setFilter: (filter) => set({ filter, page: 1 }),
  reset: () => set({ page: 1 } as any),
}));
