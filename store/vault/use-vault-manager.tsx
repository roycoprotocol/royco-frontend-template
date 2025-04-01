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

export interface VaultManagerState {
  actionType: TypeVaultManagerAction;
  setActionType: (actionType: TypeVaultManagerAction) => void;

  transaction: any;
  setTransaction: (transactions: any) => void;
}

export const useVaultManager = create<VaultManagerState>((set) => ({
  actionType: TypeVaultManagerAction.Deposit,
  setActionType: (actionType: TypeVaultManagerAction) => set({ actionType }),

  transaction: null,
  setTransaction: (transaction: any) => set({ transaction }),
}));
