"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type AuthUIState = {
  emailDraft: string;
  rememberMe: boolean;
  showPassword: boolean;
  setEmailDraft: (emailDraft: string) => void;
  setRememberMe: (rememberMe: boolean) => void;
  togglePasswordVisibility: () => void;
  resetAuthUI: () => void;
};

const initialState = {
  emailDraft: "",
  rememberMe: false,
  showPassword: false,
};

export const useAuthStore = create<AuthUIState>()(
  persist(
    (set) => ({
      ...initialState,
      setEmailDraft: (emailDraft) => set({ emailDraft }),
      setRememberMe: (rememberMe) => set({ rememberMe }),
      togglePasswordVisibility: () => set((state) => ({ showPassword: !state.showPassword })),
      resetAuthUI: () => set({ ...initialState }),
    }),
    {
      name: "auth-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rememberMe: state.rememberMe,
        emailDraft: state.rememberMe ? state.emailDraft : "",
      }),
    }
  )
);
