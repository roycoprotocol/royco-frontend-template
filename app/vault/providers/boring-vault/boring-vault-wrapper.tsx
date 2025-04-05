"use client";

import React, { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { useBoringVaultV1 } from "boring-vault-ui";
import toast from "react-hot-toast";
import { ErrorAlert, LoadingSpinner } from "@/components/composables";
import {
  boringVaultAtom,
  BoringVaultRewards,
  BoringVaultToken,
  BoringVaultWithdrawal,
} from "@/store/vault/atom/boring-vault";
import { SlideUpWrapper } from "@/components/animations";
import {
  asyncVaultMetadataAtom,
  vaultMetadataAtom,
} from "@/store/vault/vault-metadata";
import { AlertIndicator } from "@/components/common";
import { chains } from "../../constants/chains";
import axios from "axios";
import { parseRawAmountToTokenAmount } from "royco/utils";
import { useVaultManager } from "@/store/vault/use-vault-manager";
import { api } from "@/app/api/royco";
import { VaultDepositToken } from "@/app/api/royco/data-contracts";

const DEFAULT_WITHDRAWALS_API_URL =
  "https://api.sevenseas.capital/boringQueue/";
const DEFAULT_VAULT_DECIMALS = 18;

export const BoringVaultWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { address } = useAccount();
  const { isLoading, isError, data } = useAtomValue(vaultMetadataAtom);

  const refresh = useSetAtom(asyncVaultMetadataAtom);
  const setBoringVault = useSetAtom(boringVaultAtom);

  const {
    refreshManager,
    setRefreshManager,
    refreshMetadata,
    setRefreshMetadata,
  } = useVaultManager();

  const {
    isBoringV1ContextReady,
    fetchTotalAssets,
    fetchShareValue,
    fetchUserShares,
    fetchUserUnlockTime,
    fetchBoringQueueAssetParams,
  } = useBoringVaultV1();

  const getBaseAsset = async ({
    token,
  }: {
    token: VaultDepositToken;
  }): Promise<BoringVaultToken> => {
    const params = await fetchBoringQueueAssetParams({
      address: token.contractAddress,
      decimals: token.decimals,
    });

    return {
      ...params,
      address: token.contractAddress,
      decimals: token.decimals,
      price: token.price,
    };
  };

  const getAccountWithdrawals = async ({
    chain,
    vaultAddress,
    address,
    token,
  }: {
    chain: any;
    vaultAddress: string;
    address: string;
    token: VaultDepositToken;
  }): Promise<BoringVaultWithdrawal[] | []> => {
    try {
      const response = await axios.get(
        `${DEFAULT_WITHDRAWALS_API_URL}/${chain.chainName}/${vaultAddress}/${address}`
      );
      const data = response.data?.Response;

      const withdrawals = [
        ...data.open_requests.map((item: any) => ({
          token,
          amountInBaseAsset: parseRawAmountToTokenAmount(
            item.metadata.amountOfAssets,
            token.decimals
          ),
          createdAt: item.metadata.creationTime,
          status: "initiated",
        })),
        ...data.expired_requests.map((item: any) => ({
          token,
          amountInBaseAsset: parseRawAmountToTokenAmount(
            item.metadata.amountOfAssets,
            token.decimals
          ),
          createdAt: item.metadata.creationTime,
          status: "expired",
        })),
        ...data.cancelled_requests.map((item: any) => ({
          token,
          amountInBaseAsset: parseRawAmountToTokenAmount(
            item.Request.metadata.amountOfAssets,
            token.decimals
          ),
          createdAt: item.Request.metadata.creationTime,
          status: "canceled",
        })),
        ...data.fulfilled_requests.map((item: any) => ({
          token,
          amountInBaseAsset: parseRawAmountToTokenAmount(
            item.metadata.amountOfAssets,
            token.decimals
          ),
          createdAt: item.metadata.creationTime,
          status: "completed",
        })),
      ].sort((a: any, b: any) => b.createdAt - a.createdAt);

      return withdrawals;
    } catch (error) {
      toast.custom(<ErrorAlert message="Error: User withdrawals not found." />);
      return [];
    }
  };

  const getAccountRewards = async ({
    chain,
    vaultAddress,
    address,
  }: {
    chain: any;
    vaultAddress: string;
    address: string;
  }): Promise<BoringVaultRewards> => {
    try {
      const response = await api.positionControllerGetSpecificBoringPosition(
        `${chain.chainId}_${vaultAddress}`,
        address
      );

      return response.data;
    } catch (error) {
      toast.custom(<ErrorAlert message="Error: User rewards not found." />);
      return {
        id: `${chain.chainId}_${vaultAddress}`,
        chainId: chain.chainId,
        vaultAddress,
        accountAddress: address,
        unclaimedRewardTokens: [],
        claimedRewardTokens: [],
      };
    }
  };

  const getAccount = async ({
    chain,
    vaultAddress,
    address,
    sharePrice,
    token,
  }: {
    chain: any;
    vaultAddress: string;
    address: string;
    sharePrice: number;
    token: VaultDepositToken;
  }) => {
    const userShares = await fetchUserShares(address);
    const userSharesInBaseAsset =
      (userShares * 10 ** DEFAULT_VAULT_DECIMALS * sharePrice) /
      10 ** token.decimals;

    const userSharesInUsd = userSharesInBaseAsset * token.price;

    const userUnlockTime = await fetchUserUnlockTime(address);

    const withdrawals = await getAccountWithdrawals({
      chain,
      vaultAddress,
      address,
      token,
    });

    const rewards = await getAccountRewards({
      chain,
      vaultAddress,
      address,
    });

    return {
      address,
      sharesInBaseAsset: userSharesInBaseAsset,
      sharesInUsd: userSharesInUsd,
      unlockTime: userUnlockTime,
      withdrawals,
      rewards,
    };
  };

  useEffect(() => {
    (async () => {
      if (!isBoringV1ContextReady || !data || !address) {
        return;
      }

      const chain = chains[Number(data.chainId) as keyof typeof chains];

      if (!chain) {
        return;
      }

      try {
        const depositToken = data.depositTokens[0];

        const baseAsset = await getBaseAsset({ token: depositToken });

        const totalValueLockedInBaseAsset = await fetchTotalAssets();
        const sharePriceInBaseAsset = await fetchShareValue();

        const account = await getAccount({
          chain,
          vaultAddress: data.vaultAddress,
          address,
          sharePrice: sharePriceInBaseAsset,
          token: depositToken,
        });

        setBoringVault({
          baseAsset,
          chainId: data.chainId,
          totalValueLockedInBaseAsset,
          sharePriceInBaseAsset,
          decimals: DEFAULT_VAULT_DECIMALS,
          account,
        });
      } catch (error) {
        toast.custom(<ErrorAlert message="Error: Vault data not found." />);
      } finally {
        setRefreshManager(false);
      }
    })();
  }, [isBoringV1ContextReady, address, data, refreshManager]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col place-content-center items-center pt-16">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  }

  if (isError) {
    return (
      <SlideUpWrapper className="flex w-full flex-col place-content-center items-center pt-16">
        <AlertIndicator
          className={cn(
            "h-96 w-full rounded-2xl border border-divider bg-white"
          )}
        >
          Unable to load vault data. Please check your connection and try again,
          or contact support if the issue persists.
        </AlertIndicator>
      </SlideUpWrapper>
    );
  }

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  );
});
