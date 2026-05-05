import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      walletAddress: null,
      setWalletAddress: (walletAddress) => set({ walletAddress }),
    }),
    {
      name: 'expense-autopsy-app-state',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
