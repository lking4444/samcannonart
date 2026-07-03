import { create } from "zustand"

type UiState = {
  navOpen: boolean
  openNav: () => void
  closeNav: () => void
  toggleNav: () => void
}

export const useMobileNavStore = create<UiState>((set) => ({
  navOpen: false,
  openNav: () => set({ navOpen: true }),
  closeNav: () => set({ navOpen: false }),
  toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
}))