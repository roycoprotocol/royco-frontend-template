import { atom } from "jotai";

export interface BoringVault {
  base_asset: {
    address: string;
    decimals: number;
  };

  total_value_locked: number;
  share_price: number;

  user?: {
    address: string;
    total_shares: number;
    total_shares_in_base_asset: number;
    unlock_time: number;
  };
}

export const boringVaultAtom = atom<BoringVault | null>(null);
