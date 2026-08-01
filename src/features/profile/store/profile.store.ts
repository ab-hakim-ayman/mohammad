import { create } from "zustand";
import type { ProfileQueryParams } from "../types/profile.types";
type ProfileVisibilityFilter = boolean | null;
type ProfileStoreState = {
  search: string;
  isPublic: ProfileVisibilityFilter;
  page: number;
  limit: number;
  sort: NonNullable<ProfileQueryParams["sort"]>;
  setSearch: (value: string) => void;
  setIsPublic: (value: ProfileVisibilityFilter) => void;
  setPage: (value: number) => void;
  [key: string]: any;
};

const initialState = {
  search: "",
  isPublic: null,
  page: 1,
  limit: 10,
  sort: "createdAt_desc" as const,
};
export const useProfileStore = create<ProfileStoreState>((set) => ({
  ...initialState,
  setSearch: (value) => set({ search: value, page: 1 }),
  setIsPublic: (value) => set({ isPublic: value, page: 1 }),
  setPage: (value) => set({ page: value }),
  setLimit: (limit: any) => set({ limit, page: 1 } as any),
  setSort: (sort: any) => set({ sort, page: 1 } as any),
  reset: () => set({ page: 1 } as any),
}));
