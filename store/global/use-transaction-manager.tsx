import { create } from "zustand";

export enum MarketTransactionType {
  ClaimIncentives = "claimIncentives",
}

export type TypeTransactionDetail = {
  type: MarketTransactionType;

  title?: string;
  successTitle?: string;
  description?: string;

  steps: Array<{ id: string } & Record<string, any>>;

  info?: {
    label: string;
    value: string;
  }[];

  warning?: React.ReactNode;

  token?: {
    amount: number;
    data: any;
  };
};

export interface TransactionManagerState {
  transactions: TypeTransactionDetail;
  setTransactions: (transactions: TypeTransactionDetail) => void;
}

export const useTransactionManager = create<TransactionManagerState>((set) => ({
  // @ts-ignore
  transactions: null,
  setTransactions: (transactions: TypeTransactionDetail) =>
    set({ transactions }),
}));
