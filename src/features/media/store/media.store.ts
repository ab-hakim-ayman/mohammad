"use client";
import { create } from "zustand";
import type { MediaResourceType, MediaProvider } from "@/shared/types";
export type MediaSort =
  | "createdAt_desc"
  | "createdAt_asc"
  | "resourceType_asc"
  | "resourceType_desc"
  | "filename_asc"
  | "filename_desc";
export type MediaStoreState = {
  page: number;
  limit: number;
  search: string;
  sort: MediaSort;
  provider: "" | MediaProvider;
  resourceType: "" | MediaResourceType;
  folder: string;
  selectedMediaId: string | null;
  setPage: (page: number) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  limit: 12,
  search: "",
  sort: "createdAt_desc" as MediaSort,
  provider: "" as "" | MediaProvider,
  resourceType: "" as "" | MediaResourceType,
  folder: "",
  selectedMediaId: null as string | null,
};
export const useMediaStore = create<MediaStoreState>((set) => ({
  ...initialState,
  setPage: (page) => set({ page }),
  setLimit: (limit: any) => set({ limit, page: 1 } as any),
  setSearch: (search: string) => set({ search, page: 1 }),
  setSort: (sort: any) => set({ sort, page: 1 } as any),
  setProvider: (provider: any) => set({ provider, page: 1 }),
  setResourceType: (resourceType: any) => set({ resourceType, page: 1 }),
  setFolder: (folder: any) => set({ folder, page: 1 }),
  setSelectedMediaId: (selectedMediaId: string | null) =>
    set({ selectedMediaId: selectedMediaId as any }),
  reset: () => set({ page: 1 } as any),
}));
