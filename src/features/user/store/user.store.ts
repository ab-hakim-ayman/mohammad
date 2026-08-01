"use client";
import { create } from "zustand";
type UserUIState = {
  search: string;
  page: number;
  limit: number;
  sort: string;
  role: string;
  status: string;
  selectedUserId: string | null;
  isInviteModalOpen: boolean;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  [key: string]: any;
};

const initialState = {
  page: 1,
  limit: 10,
  sort: "createdAt_desc",
  role: "all",
  status: "all",
  selectedUserId: null,
  isInviteModalOpen: false,
  search: "",
};
export const useUserStore = create<UserUIState>()((set) => ({
  ...initialState,
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit: any) => set({ limit, page: 1 } as any),
  setSort: (sort: any) => set({ sort, page: 1 } as any),
  setRole: (role: any) => set({ role, page: 1 }),
  setStatus: (status: any) => set({ status, page: 1 }),
  selectUser: (id: string) => set({ selectedUserId: id }),
  openInviteModal: () => set({ isInviteModalOpen: true }),
  closeInviteModal: () => set({ isInviteModalOpen: false }),
}));
