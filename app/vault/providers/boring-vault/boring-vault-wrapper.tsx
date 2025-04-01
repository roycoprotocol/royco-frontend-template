"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSetAtom } from "jotai";
import { vaultContractProviderMap } from "royco/vault";
import { useParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { useBoringVaultV1 } from "boring-vault-ui";
import toast from "react-hot-toast";
import { ErrorAlert, LoadingSpinner } from "@/components/composables";
import { boringVaultAtom } from "@/store/vault/atom/boring-vault";
import { SlideUpWrapper } from "@/components/animations";

export const BoringVaultWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { chain_id, vault_id } = useParams();

  const setBoringVault = useSetAtom(boringVaultAtom);

  const [isLoading, setIsLoading] = useState(false);

  const vault = useMemo(() => {
    const chainId = chain_id?.toString()?.toLowerCase();
    const vaultId = vault_id?.toString()?.toLowerCase();

    const _vault = vaultContractProviderMap.find(
      (v) => v.id === `${chainId}_${vaultId}`
    );
    return _vault;
  }, [vault_id]);

  const { address } = useAccount();

  const {
    isBoringV1ContextReady,
    fetchTotalAssets,
    fetchShareValue,
    fetchUserShares,
    fetchUserUnlockTime,
    depositStatus,
  } = useBoringVaultV1();

  useEffect(() => {
    (async () => {
      if (!isBoringV1ContextReady || !vault) {
        return;
      }

      setIsLoading(true);

      try {
        const base_asset = {
          address: vault.baseToken.address,
          decimals: vault.baseToken.decimals,
        };
        const decimals = vault.decimals;
        const total_value_locked = await fetchTotalAssets();
        const share_price = await fetchShareValue();
        const chain_id = vault.chainId;

        setBoringVault((boringVault: any) => ({
          ...boringVault,
          base_asset,
          total_value_locked,
          share_price,
          decimals,
          chain_id,
        }));
      } catch (error) {
        toast.custom(
          <ErrorAlert message="Something went wrong, while fetching vault data." />
        );
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isBoringV1ContextReady, vault]);

  useEffect(() => {
    (async () => {
      if (!isBoringV1ContextReady || !vault) {
        return;
      }

      if (!address) {
        return;
      }

      try {
        const user_shares = await fetchUserShares(address);
        const share_price = await fetchShareValue();

        const user_shares_in_base_asset =
          (user_shares * 10 ** vault.decimals * share_price) /
          10 ** vault.baseToken.decimals;

        const user_unlock_time = await fetchUserUnlockTime(address);

        setBoringVault((boringVault: any) => ({
          ...boringVault,
          user: {
            address,
            total_shares: user_shares,
            total_shares_in_base_asset: user_shares_in_base_asset,
            unlock_time: user_unlock_time,
          },
        }));
      } catch (error) {
        toast.custom(
          <ErrorAlert message="Something went wrong, while fetching vault data." />
        );
        console.error("Error:", error);
      }
    })();
  }, [isBoringV1ContextReady, address, vault]);

  useEffect(() => {
    if (!isBoringV1ContextReady) {
      return;
    }

    setBoringVault((boringVault: any) => ({
      ...boringVault,
      transactions: {
        deposit: depositStatus,
      },
    }));
  }, [isBoringV1ContextReady, depositStatus]);

  if (isLoading) {
    return (
      <SlideUpWrapper className="flex w-full flex-col place-content-center items-center pt-16">
        <LoadingSpinner />
      </SlideUpWrapper>
    );
  }

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  );
});
