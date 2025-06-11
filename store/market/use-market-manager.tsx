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

export enum MarketTransactionType {
  ClaimIncentives = "claimIncentives",
}

export type TypeMarketTransaction = {
  type: MarketTransactionType;
  title: string;
  successTitle?: string;
  description?: string;
  metadata?: {
    label: string;
    value: string;
  }[];
  steps: any[];
  warnings?: React.ReactNode;
  token: {
    amount: number;
    data: any;
  };
};

export interface MarketManagerState {
  detailsOption: TypeMarketDetailsOption;
  setDetailsOption: (detailsOption: TypeMarketDetailsOption) => void;

  transactions: TypeMarketTransaction;
  setTransactions: (transactions: TypeMarketTransaction) => void;

  reload: boolean;
  setReload: (reload: boolean) => void;
}

export const useMarketManager = create<MarketManagerState>((set) => ({
  detailsOption: TypeMarketDetailsOption.Overview,
  setDetailsOption: (detailsOption: TypeMarketDetailsOption) =>
    set({ detailsOption }),

  // @ts-ignore
  transactions: null,
  setTransactions: (transactions: TypeMarketTransaction) =>
    set({ transactions }),

  reload: false,
  setReload: (reload: boolean) => set({ reload }),
}));
