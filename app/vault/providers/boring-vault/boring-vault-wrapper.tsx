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

const DEFAULT_VAULT_DECIMALS = 18;

export const BoringVaultWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { address } = useAccount();
  const { isLoading, isError, data } = useAtomValue(vaultMetadataAtom);

  console.log({ data });

  const setBoringVault = useSetAtom(boringVaultAtom);

  const {
    isBoringV1ContextReady,
    fetchTotalAssets,
    fetchShareValue,
    fetchUserShares,
    fetchUserUnlockTime,
    fetchBoringQueueAssetParams,
    depositStatus,
  } = useBoringVaultV1();

  useEffect(() => {
    (async () => {
      if (!isBoringV1ContextReady || !data || !address) {
        return;
      }

      try {
        const depositToken = data.depositTokens[0];

        const depositAssetParams = await fetchBoringQueueAssetParams({
          address: depositToken.contractAddress,
          decimals: depositToken.decimals,
        });

        const totalValueLockedInBaseAsset = await fetchTotalAssets();
        const sharePriceInBaseAsset = await fetchShareValue();

        const userShares = await fetchUserShares(address);
        const sharePrice = await fetchShareValue();

        const userSharesInBaseAsset =
          (userShares * 10 ** DEFAULT_VAULT_DECIMALS * sharePrice) /
          10 ** depositToken.decimals;

        const userSharesInUSD = userSharesInBaseAsset * depositToken.price;

        const userUnlockTime = await fetchUserUnlockTime(address);

        setBoringVault((boringVault: any) => ({
          ...boringVault,
          baseAsset: {
            address: depositToken.contractAddress,
            decimals: depositToken.decimals,
            price: depositToken.price,
            allowWithdraws: depositAssetParams.allowWithdraws,
            secondsToMaturity: depositAssetParams.secondsToMaturity,
            minimumSecondsToDeadline:
              depositAssetParams.minimumSecondsToDeadline,
            minDiscount: depositAssetParams.minDiscount,
            maxDiscount: depositAssetParams.maxDiscount,
            minimumShares: depositAssetParams.minimumShares,
          },
          chainId: data.chainId,
          totalValueLockedInBaseAsset,
          sharePriceInBaseAsset,
          decimals: DEFAULT_VAULT_DECIMALS,
          account: {
            address,
            sharesInBaseAsset: userSharesInBaseAsset,
            sharesInUSD: userSharesInUSD,
            unlockTime: userUnlockTime,
          },
        }));
      } catch (error) {
        toast.custom(
          <ErrorAlert message="Error: while fetching vault data." />
        );
      }
    })();
  }, [isBoringV1ContextReady, address, data, depositStatus]);

  if (isLoading) {
    return (
      <SlideUpWrapper className="flex w-full flex-col place-content-center items-center pt-16">
        <LoadingSpinner className="h-5 w-5" />
      </SlideUpWrapper>
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
