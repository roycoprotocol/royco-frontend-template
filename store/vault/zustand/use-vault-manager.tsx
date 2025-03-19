import { create } from "zustand";

import { TypedRoycoMarketActionType } from "royco/market";
import { MarketActionType } from "../../market-manager-props";

export interface VaultManagerState {
  actionType: TypedRoycoMarketActionType;
  setActionType: (actionType: TypedRoycoMarketActionType) => void;
}

export const useVaultManager = create<VaultManagerState>((set) => ({
  actionType: MarketActionType.supply.id,
  setActionType: (actionType: TypedRoycoMarketActionType) =>
    set({ actionType }),
}));
