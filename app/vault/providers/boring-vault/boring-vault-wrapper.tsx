"use client";

import React, { useEffect } from "react";
import { useSetAtom } from "jotai";

import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { useBoringVaultV1 } from "boring-vault-ui";
import toast from "react-hot-toast";
import { ErrorAlert } from "@/components/composables";
import { VAULT_BASE_TOKEN, VAULT_DECIMALS } from "./boring-vault-provider";
import { BoringVault, boringVaultAtom } from "@/store/vault/atom/boring-vault";

export const BoringVaultWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const setBoringVault = useSetAtom(boringVaultAtom);

  const { address } = useAccount();

  const {
    isBoringV1ContextReady,
    fetchTotalAssets,
    fetchShareValue,
    fetchUserShares,
    fetchUserUnlockTime,
  } = useBoringVaultV1();

  useEffect(() => {
    (async () => {
      if (!isBoringV1ContextReady) {
        return;
      }

      try {
        let boring_vault: BoringVault;
        const base_asset = {
          address: VAULT_BASE_TOKEN.address,
          decimals: VAULT_BASE_TOKEN.decimals,
        };
        const total_value_locked = await fetchTotalAssets();
        const share_price = await fetchShareValue();

        boring_vault = {
          base_asset,
          total_value_locked,
          share_price,
        };

        if (address) {
          const user_shares = await fetchUserShares(address);
          const user_shares_in_base_asset =
            (user_shares * 10 ** VAULT_DECIMALS * share_price) /
            10 ** VAULT_BASE_TOKEN.decimals;

          const user_unlock_time = await fetchUserUnlockTime(address);

          boring_vault = {
            ...boring_vault,
            user: {
              address,
              total_shares: user_shares,
              total_shares_in_base_asset: user_shares_in_base_asset,
              unlock_time: user_unlock_time,
            },
          };
        }

        setBoringVault(boring_vault);
      } catch (error) {
        toast.custom(
          <ErrorAlert message="Something went wrong, while fetching vault data." />
        );
        console.error("Error:", error);
      }
    })();
  }, [isBoringV1ContextReady, address]);

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  );
});
