import { create } from "zustand";

interface ExploreMarketState {
  hiddenTableColumns: string[];
  setHiddenTableColumns: (hiddenTableColumns: string[]) => void;
}

export const useExploreMarket = create<ExploreMarketState>((set) => ({
  hiddenTableColumns: [] as string[],
  setHiddenTableColumns: (hiddenTableColumns: string[]) =>
    set({ hiddenTableColumns }),
}));
