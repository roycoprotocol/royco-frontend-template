"use client";

import { cn } from "@/lib/utils";
import { CachedWallet, TypedCachedWallet, useGlobalStates } from "@/store";
import React, { useEffect, useState } from "react";
import { isCachedWalletValid } from "./utils";
import { useAccount } from "wagmi";
import { isEqual } from "lodash";

export const WalletCacher = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address, isConnected } = useAccount();
  const { cachedWallet, setCachedWallet } = useGlobalStates();

  // Validate the wallets from localStorage
  const validateWallets = async () => {
    // Get wallets from localStorage
    const storedWallet = localStorage.getItem("wallet");
    if (!storedWallet) return;

    try {
      const wallet: CachedWallet = JSON.parse(storedWallet);

      const isValid = await isCachedWalletValid({
        account_address: address,
        proof: wallet?.proof,
      });

      // Update localStorage if any wallets were removed
      if (!isValid) {
        localStorage.removeItem("wallet");
      }
    } catch (error) {
      console.error("Error validating cached wallet:", error);

      // Delete all wallets from localStorage
      localStorage.removeItem("wallet");
    }
  };

  // Set the wallets from localStorage
  const setWallet = () => {
    // Now retrieve the wallets from localStorage
    const storedWallet = localStorage.getItem("wallet");
    if (!storedWallet) return;

    const wallet: CachedWallet = JSON.parse(storedWallet);

    if (!isEqual(cachedWallet, wallet)) {
      setCachedWallet(wallet);
    }
  };

  const refreshWallet = async () => {
    await validateWallets();
    setWallet();
  };

  useEffect(() => {
    refreshWallet();
  }, [address, isConnected]);

  return null;
});
