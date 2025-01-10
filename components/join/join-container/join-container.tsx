"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Cta } from "./cta";
import { LeaderboardStats } from "../leaderboard-stats";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoyaltyFormSchema } from "../royalty-form/royality-form-schema";
import { z } from "zod";
import { useGlobalStates } from "@/store";
import { useTotalWalletsBalance } from "../hooks";
import { isEqual } from "lodash";

export const JoinContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isUserInfoPaused, setIsUserInfoPaused } = useGlobalStates();

  const royaltyForm = useForm<z.infer<typeof RoyaltyFormSchema>>({
    resolver: zodResolver(RoyaltyFormSchema),
    defaultValues: {
      username: "",
      email: "",
      wallets: [],
    },
  });

  const updateUserInfoPaused = () => {
    if (royaltyForm.getValues("wallets").length > 0) {
      setIsUserInfoPaused(true);
    } else {
      setIsUserInfoPaused(false);
    }
  };

  const { data: totalWalletsBalance, isLoading: totalWalletsBalanceLoading } =
    useTotalWalletsBalance({
      wallets: royaltyForm
        .watch("wallets")
        .filter((wallet) => wallet.proof.length > 0)
        .map((wallet) => wallet.account_address.toLowerCase()),
    });

  const updateWalletsBalance = () => {
    if (!!totalWalletsBalance) {
      const currWallets = royaltyForm.watch("wallets");
      const newWallets = currWallets.map((wallet, index) => {
        const balanceIndex = totalWalletsBalance.findIndex(
          (balance) => balance.account_address === wallet.account_address
        );

        if (balanceIndex !== -1) {
          return {
            ...wallet,
            balance: totalWalletsBalance[balanceIndex].balance,
          };
        }

        return {
          ...wallet,
          balance: 0,
        };
      });

      if (!isEqual(currWallets, newWallets)) {
        royaltyForm.setValue("wallets", newWallets);
      }
    }
  };

  useEffect(() => {
    updateWalletsBalance();
  }, [totalWalletsBalance]);

  useEffect(() => {
    updateUserInfoPaused();
  }, [royaltyForm.watch("wallets")]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "w-full max-w-4xl rounded-2xl border border-divider bg-white",
        className
      )}
    >
      <Cta royaltyForm={royaltyForm} />

      <LeaderboardStats />
    </div>
  );
});
