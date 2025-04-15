"use client";

import React, { useEffect, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useAccount } from "wagmi";
import { cn } from "@/lib/utils";
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
  loadableVaultMetadataAtom,
  vaultParamsAtom,
} from "@/store/vault/vault-manager";
import { AlertIndicator } from "@/components/common";
import { chains } from "../../constants/chains";
import axios from "axios";
import { parseRawAmountToTokenAmount } from "royco/utils";
import { useVaultManager } from "@/store/vault/use-vault-manager";
import { api } from "@/app/api/royco";
import { vaultContractProviderMap } from "royco/vault";
import BigNumber from "bignumber.js";

const DEFAULT_WITHDRAWALS_API_URL =
  "https://api.sevenseas.capital/boringQueue/";
const DEFAULT_VAULT_DECIMALS = 18;

export const BoringVaultWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { address } = useAccount();

  const vaultParams = useAtomValue(vaultParamsAtom);
  const { isLoading, isError, data, refetch } = useAtomValue(
    loadableVaultMetadataAtom
  );
  const setBoringVault = useSetAtom(boringVaultAtom);

  const vault = useMemo(() => {
    if (!vaultParams) {
      return null;
    }

    const chainId = vaultParams.chainId;
    const vaultId = vaultParams.vaultId;

    const _vault = vaultContractProviderMap.find(
      (v) => v.id === `${chainId}_${vaultId}`
    );
    return _vault;
  }, [vaultParams]);

  const { reload, setReload, setIsContractLoading } = useVaultManager();

  const {
    isBoringV1ContextReady,
    fetchTotalAssets,
    fetchShareValue,
    fetchUserShares,
    fetchUserUnlockTime,
  } = useBoringVaultV1();

  const getAccountWithdrawals = async ({
    chainId,
    vaultAddress,
    address,
    token,
  }: {
    chainId: number;
    vaultAddress: string;
    address: string;
    token: BoringVaultToken;
  }): Promise<BoringVaultWithdrawal[] | []> => {
    try {
      const chain = chains[chainId as keyof typeof chains];
      if (!chain) {
        return [];
      }

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
          createdAt: item.metadata.creationTime * 1000,
          status: "initiated",
          metadata: item.metadata,
        })),
        ...data.expired_requests.map((item: any) => ({
          token,
          amountInBaseAsset: parseRawAmountToTokenAmount(
            item.metadata.amountOfAssets,
            token.decimals
          ),
          createdAt: item.metadata.creationTime * 1000,
          status: "expired",
          metadata: item.metadata,
        })),
        ...data.cancelled_requests.map((item: any) => ({
          token,
          amountInBaseAsset: parseRawAmountToTokenAmount(
            item.Request.metadata.amountOfAssets,
            token.decimals
          ),
          createdAt: item.Request.metadata.creationTime * 1000,
          status: "canceled",
          metadata: item.Request.metadata,
        })),
        ...data.fulfilled_requests.map((item: any) => ({
          token,
          amountInBaseAsset: parseRawAmountToTokenAmount(
            item.metadata.amountOfAssets,
            token.decimals
          ),
          createdAt: item.metadata.creationTime * 1000,
          status: "completed",
          metadata: item.metadata,
        })),
      ].sort((a: any, b: any) => b.createdAt - a.createdAt);

      return withdrawals;
    } catch (error) {
      toast.custom(<ErrorAlert message="Error: User withdrawals not found." />);
      return [];
    }
  };

  const getAccountRewards = async ({
    chainId,
    vaultAddress,
    address,
  }: {
    chainId: number;
    vaultAddress: string;
    address: string;
  }): Promise<BoringVaultRewards> => {
    try {
      const response = await api.positionControllerGetSpecificBoringPosition(
        `${chainId}_${vaultAddress}`,
        address
      );

      return response.data;
    } catch (error) {
      toast.custom(<ErrorAlert message="Error: User rewards not found." />);
      return {
        id: `${chainId}_${vaultAddress}`,
        chainId: chainId,
        vaultAddress,
        accountAddress: address,
        unclaimedRewardTokens: [],
        claimedRewardTokens: [],
      };
    }
  };

  const getAccount = async ({
    chainId,
    vaultAddress,
    address,
    sharePrice,
    token,
  }: {
    chainId: number;
    vaultAddress: string;
    address: string;
    sharePrice: number;
    token: BoringVaultToken;
  }) => {
    const userShares = (await fetchUserShares(address)) || 0;

    const userSharesInBaseAsset = new BigNumber(userShares)
      .times(new BigNumber(10).pow(DEFAULT_VAULT_DECIMALS))
      .times(sharePrice)
      .div(new BigNumber(10).pow(token.decimals));

    const userSharesInUsd = userSharesInBaseAsset.times(token.price.toString());

    const userUnlockTime = (await fetchUserUnlockTime(address)) || 0;

    const userWithdrawals = await getAccountWithdrawals({
      chainId,
      vaultAddress,
      address,
      token,
    });

    const userRewards = await getAccountRewards({
      chainId,
      vaultAddress,
      address,
    });

    return {
      address,
      sharesInBaseAsset: userSharesInBaseAsset.toNumber(),
      sharesInUsd: userSharesInUsd.toNumber(),
      unlockTime: userUnlockTime * 1000,
      withdrawals: userWithdrawals,
      rewards: userRewards,
    };
  };

  const initializeBoringVault = async () => {
    if (!isBoringV1ContextReady || !vault || !data || !address) {
      return;
    }

    const token = data.depositTokens[0];
    if (!token) {
      return;
    }

    try {
      setIsContractLoading(true);

      const totalValueLockedInBaseAsset = (await fetchTotalAssets()) || 0;
      const sharePriceInBaseAsset = (await fetchShareValue()) || 0;

      const account = await getAccount({
        chainId: data.chainId,
        vaultAddress: data.vaultAddress,
        address,
        sharePrice: sharePriceInBaseAsset,
        token,
      });

      setBoringVault({
        baseAsset: token,
        chainId: data.chainId,
        contracts: {
          vault: vault.contracts.vault,
          teller: vault.contracts.teller,
          accountant: vault.contracts.accountant,
          lens: vault.contracts.lens,
          boringQueue: vault.contracts.boringQueue,
        },
        totalValueLockedInBaseAsset,
        sharePriceInBaseAsset,
        decimals: DEFAULT_VAULT_DECIMALS,
        account,
      });
    } catch (error) {
      console.log({ error });
      toast.custom(<ErrorAlert message="Error: Vault data not found." />);
    } finally {
      setIsContractLoading(false);
    }
  };

  useEffect(() => {
    initializeBoringVault();
  }, [isBoringV1ContextReady, address, data]);

  useEffect(() => {
    if (reload) {
      initializeBoringVault();
      refetch();

      setReload(false);
    }
  }, [reload]);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col place-content-center items-center pt-16">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  }

  if (isError || !data) {
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
