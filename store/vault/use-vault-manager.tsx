import { create } from "zustand";

export enum TypeVaultDetailsOption {
  Overview = "overview",
  Positions = "positions",
}

export const VaultDetailsOptionMap = {
  [TypeVaultDetailsOption.Overview]: {
    value: TypeVaultDetailsOption.Overview,
    label: "Overview",
  },
  [TypeVaultDetailsOption.Positions]: {
    value: TypeVaultDetailsOption.Positions,
    label: "Positions",
  },
};

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

export enum VaultTransactionType {
  Deposit = "deposit",
  Withdraw = "withdraw",
  CancelWithdraw = "cancelWithdraw",
  ClaimIncentives = "claimIncentives",
  RecoverWithdraw = "recoverWithdraw",
  Approve = "approve",
}

export type TypeVaultTransaction = {
  type: VaultTransactionType;
  title: string;
  successTitle?: string;
  description?: string;
  metadata?: {
    label: string;
    value: string;
  }[];
  steps: any[];
  warnings?: string[];
  token: {
    amount: number;
    data: any;
  };
};

export interface VaultManagerState {
  detailsOption: TypeVaultDetailsOption;
  setDetailsOption: (detailsOption: TypeVaultDetailsOption) => void;

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
  detailsOption: TypeVaultDetailsOption.Overview,
  setDetailsOption: (detailsOption: TypeVaultDetailsOption) =>
    set({ detailsOption }),

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
