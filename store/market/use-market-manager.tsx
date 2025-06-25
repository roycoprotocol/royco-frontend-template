import { create } from "zustand";

export enum TypeMarketDetailOption {
  Overview = "overview",
  Positions = "positions",
}

export const MarketDetailOptionMap = {
  [TypeMarketDetailOption.Overview]: {
    value: TypeMarketDetailOption.Overview,
    label: "Overview",
  },
  [TypeMarketDetailOption.Positions]: {
    value: TypeMarketDetailOption.Positions,
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
  detailOption: TypeMarketDetailOption;
  setDetailOption: (detailOption: TypeMarketDetailOption) => void;

  transactions: TypeMarketTransaction;
  setTransactions: (transactions: TypeMarketTransaction) => void;

  reload: boolean;
  setReload: (reload: boolean) => void;
}

export const useMarketManager = create<MarketManagerState>((set) => ({
  detailOption: TypeMarketDetailOption.Overview,
  setDetailOption: (detailOption: TypeMarketDetailOption) =>
    set({ detailOption }),

  // @ts-ignore
  transactions: null,
  setTransactions: (transactions: TypeMarketTransaction) =>
    set({ transactions }),

  reload: false,
  setReload: (reload: boolean) => set({ reload }),
}));
