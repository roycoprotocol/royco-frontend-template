import { atom } from "jotai";

export interface BoringVault {
  base_asset: {
    address: string;
    decimals: number;
  };

  chain_id: number;
  total_value_locked: number;
  share_price: number;
  decimals: number;

  user?: {
    address: string;
    total_shares: number;
    total_shares_in_base_asset: number;
    unlock_time: number;
  };

  transactions: {
    deposit: {
      initiated: boolean;
      loading: boolean;
      success?: boolean;
      error?: string;
      tx_hash?: string;
    };
    withdraw: {
      initiated: boolean;
      loading: boolean;
      success?: boolean;
      error?: string;
      tx_hash?: string;
    };
  };
}

export const boringVaultAtom = atom<BoringVault | null>(null);
