import { VaultDepositToken } from "@/app/api/royco/data-contracts";
import { create } from "zustand";

export enum TypeVaultManagerAction {
  Deposit = "deposit",
  Withdraw = "withdraw",
}

export const VaultManagerActionMap = {
  [TypeVaultManagerAction.Deposit]: {
    value: TypeVaultManagerAction.Deposit,
    label: "Deposit",
  },
  [TypeVaultManagerAction.Withdraw]: {
    value: TypeVaultManagerAction.Withdraw,
    label: "Withdraw",
  },
};

export type TypeVaultTransaction = {
  type: "deposit" | "withdraw" | "cancelWithdraw" | "claimIncentives";
  title: string;
  description?: {
    label: string;
    value: string;
  }[];
  steps: any[];
  token: {
    amount: number;
    data: any;
  };
};

export interface VaultManagerState {
  action: TypeVaultManagerAction;
  setAction: (action: TypeVaultManagerAction) => void;

  transactions: TypeVaultTransaction;
  setTransactions: (transactions: TypeVaultTransaction) => void;

  reload: boolean;
  setReload: (reload: boolean) => void;

  isContractLoading: boolean;
  setIsContractLoading: (isContractLoading: boolean) => void;
}

export const useVaultManager = create<VaultManagerState>((set) => ({
  action: TypeVaultManagerAction.Deposit,
  setAction: (action: TypeVaultManagerAction) => set({ action }),

  // @ts-ignore
  transactions: null,
  setTransactions: (transactions: TypeVaultTransaction) =>
    set({ transactions }),

  reload: false,
  setReload: (reload: boolean) => set({ reload }),

  isContractLoading: false,
  setIsContractLoading: (isContractLoading: boolean) =>
    set({ isContractLoading }),
}));
