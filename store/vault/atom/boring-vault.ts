import { SpecificBoringPositionResponse } from "@/app/api/royco/data-contracts";
import { atom } from "jotai";

export type BoringVaultToken = {
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

export type BoringVaultWithdrawal = {
  token: BoringVaultToken;
  amountInBaseAsset: number;
  createdAt: number;
  status: string;
};

export type BoringVaultRewards = SpecificBoringPositionResponse;

export interface BoringVault {
  baseAsset: BoringVaultToken;
  chainId: number;
  totalValueLockedInBaseAsset: number;
  sharePriceInBaseAsset: number;
  decimals: number;
  account: {
    address: string;
    sharesInBaseAsset: number;
    sharesInUsd: number;
    unlockTime: number;
    withdrawals: BoringVaultWithdrawal[] | [];
    rewards: BoringVaultRewards;
  };
}

export const boringVaultAtom = atom<BoringVault | null>(null);
