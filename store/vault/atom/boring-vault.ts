import { atom } from "jotai";

import { SpecificBoringPositionResponse, VaultDepositToken } from "royco/api";

export type BoringVaultToken = VaultDepositToken;

export type BoringVaultContracts = {
  vault: string;
  teller: string;
  accountant: string;
  lens: string;
  boringQueue: string;
};

export type BoringVaultWithdrawal = {
  token: BoringVaultToken;
  amountInBaseAsset: number;
  createdAt: number;
  status: string;
  metadata: any;
};

export type BoringVaultRewards = SpecificBoringPositionResponse;

export interface BoringVault {
  baseAsset: BoringVaultToken;
  chainId: number;
  contracts: BoringVaultContracts;
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
