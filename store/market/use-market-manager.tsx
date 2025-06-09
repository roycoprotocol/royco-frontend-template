import { create } from "zustand";

export enum TypeMarketDetailsOption {
  Overview = "overview",
  Positions = "positions",
}

export const MarketDetailsOptionMap = {
  [TypeMarketDetailsOption.Overview]: {
    value: TypeMarketDetailsOption.Overview,
    label: "Overview",
  },
  [TypeMarketDetailsOption.Positions]: {
    value: TypeMarketDetailsOption.Positions,
    label: "Your Position",
  },
};

export interface MarketManagerState {
  detailsOption: TypeMarketDetailsOption;
  setDetailsOption: (detailsOption: TypeMarketDetailsOption) => void;

  reload: boolean;
  setReload: (reload: boolean) => void;
}

export const useMarketManager = create<MarketManagerState>((set) => ({
  detailsOption: TypeMarketDetailsOption.Overview,
  setDetailsOption: (detailsOption: TypeMarketDetailsOption) =>
    set({ detailsOption }),

  reload: false,
  setReload: (reload: boolean) => set({ reload }),
}));
