import create from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist((set) => ({
    token: null,
    userId: null,
    setToken: (token) => set((state) => ({ ...state, token })),
    setUserId: (userId) => set((state) => ({ ...state, userId })),
  }))
);
