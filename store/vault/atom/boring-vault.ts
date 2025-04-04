import { atom } from "jotai";

export interface BoringVault {
  baseAsset: {
    address: string;
    decimals: number;
    price: number;
    allowWithdraws: boolean;
    secondsToMaturity: number;
    minimumSecondsToDeadline: number;
    minDiscount: number;
    maxDiscount: number;
    minimumShares: number;
  };
  chainId: number;
  totalValueLockedInBaseAsset: number;
  sharePriceInBaseAsset: number;
  decimals: number;
  account: {
    address: string;
    sharesInBaseAsset: number;
    sharesInUSD: number;
    unlockTime: number;
    withdrawals: {
      token: any;
      amountInBaseAsset: number;
      createdAt: number;
      status: string;
    }[];
  };
}

export const boringVaultAtom = atom<BoringVault | null>(null);
