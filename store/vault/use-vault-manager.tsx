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
  description?: {
    title: string;
    description: string;
  }[];
  steps: {
    type: string;
    label: string;
  }[];
  form: {
    token: VaultDepositToken | any;
    amount: number;
  };
  txStatus?: "loading" | "error" | "success";
  txHash?: string;
};

export interface VaultManagerState {
  actionType: TypeVaultManagerAction;
  setActionType: (actionType: TypeVaultManagerAction) => void;

  transaction: TypeVaultTransaction;
  setTransaction: (transaction: TypeVaultTransaction) => void;

  refreshManager: boolean;
  setRefreshManager: (refreshManager: boolean) => void;

  refreshMetadata: boolean;
  setRefreshMetadata: (refreshMetadata: boolean) => void;
}

export const useVaultManager = create<VaultManagerState>((set) => ({
  actionType: TypeVaultManagerAction.Deposit,
  setActionType: (actionType: TypeVaultManagerAction) => set({ actionType }),

  // @ts-ignore
  transaction: null,
  setTransaction: (transaction: TypeVaultTransaction) => set({ transaction }),

  refreshManager: false,
  setRefreshManager: (refreshManager: boolean) => set({ refreshManager }),

  refreshMetadata: false,
  setRefreshMetadata: (refreshMetadata: boolean) => set({ refreshMetadata }),
}));
