"use client";

import React, { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { useBoringVaultV1 } from "boring-vault-ui";
import toast from "react-hot-toast";
import { ErrorAlert, LoadingSpinner } from "@/components/composables";
import { boringVaultAtom } from "@/store/vault/atom/boring-vault";
import { SlideUpWrapper } from "@/components/animations";
import { vaultMetadataAtom } from "@/store/vault/vault-metadata";
import { AlertIndicator } from "@/components/common";
import { chains } from "../../constants/chains";
import axios from "axios";
import { parseRawAmountToTokenAmount } from "royco/utils";
import { useVaultManager } from "@/store/vault/use-vault-manager";

const DEFAULT_WITHDRAWALS_API_URL =
  "https://api.sevenseas.capital/boringQueue/";
const DEFAULT_VAULT_DECIMALS = 18;

export const BoringVaultWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { address } = useAccount();
  const { isLoading, isError, data } = useAtomValue(vaultMetadataAtom);

  const setBoringVault = useSetAtom(boringVaultAtom);

  const { refreshManager, setRefreshManager } = useVaultManager();

  const {
    isBoringV1ContextReady,
    fetchTotalAssets,
    fetchShareValue,
    fetchUserShares,
    fetchUserUnlockTime,
    fetchBoringQueueAssetParams,
    depositStatus,
    boringQueueStatuses,
  } = useBoringVaultV1();

  const getBaseAsset = async (token: any) => {
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

  const getAccount = async (
    vaultAddress: string,
    address: string,
    sharePrice: number,
    token: any,
    chain: any
  ) => {
    const userShares = await fetchUserShares(address);
    const userSharesInBaseAsset =
      (userShares * 10 ** DEFAULT_VAULT_DECIMALS * sharePrice) /
      10 ** token.decimals;

    const userSharesInUSD = userSharesInBaseAsset * token.price;

    const userUnlockTime = await fetchUserUnlockTime(address);

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

    return {
      address,
      sharesInBaseAsset: userSharesInBaseAsset,
      sharesInUSD: userSharesInUSD,
      unlockTime: userUnlockTime,
      withdrawals,
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

        const baseAsset = await getBaseAsset(depositToken);

        const totalValueLockedInBaseAsset = await fetchTotalAssets();
        const sharePriceInBaseAsset = await fetchShareValue();

        const account = await getAccount(
          data.vaultAddress,
          address,
          sharePriceInBaseAsset,
          depositToken,
          chain
        );

        setBoringVault({
          baseAsset,
          chainId: data.chainId,
          totalValueLockedInBaseAsset,
          sharePriceInBaseAsset,
          decimals: DEFAULT_VAULT_DECIMALS,
          account,
        });
      } catch (error) {
        toast.custom(
          <ErrorAlert message="Error: while fetching vault data." />
        );
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
