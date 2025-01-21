"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { RoyaltyFormSchema } from "./royalty-form-schema";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { useTotalWalletBalance, useTotalWalletsBalance } from "../hooks";
import { LoadingSpinner, SpringNumber } from "@/components/composables";
import { shortAddress } from "royco/utils";
import { useImmer } from "use-immer";
import { isEqual } from "lodash";
import { produce } from "immer";
import { AlertCircleIcon } from "lucide-react";

export const WalletListTabRowContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "flex flex-row items-center justify-between text-sm font-normal text-black",
        className
      )}
    />
  );
});

export const WalletListTableRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    wallet: {
      proof: string;
      account_address: string;
      balance?: number;
    };
  }
>(({ className, wallet, ...props }, ref) => {
  return (
    <WalletListTabRowContainer>
      <div>{shortAddress(wallet.account_address)}</div>

      <div>
        {wallet.proof === "" ? (
          <div className="flex flex-row items-center gap-1 rounded-md bg-error px-[0.3rem] py-[0.1rem] text-xs text-white">
            <AlertCircleIcon strokeWidth={2} className="h-3 w-3 stroke-white" />
            <div>Proof Missing</div>
          </div>
        ) : wallet.balance === undefined ? (
          <LoadingSpinner className="h-4 w-4" />
        ) : (
          <SpringNumber
            previousValue={0}
            currentValue={wallet.balance ?? 0}
            numberFormatOptions={{
              style: "currency",
              currency: "USD",
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }}
          />
        )}
      </div>
    </WalletListTabRowContainer>
  );
});

export const WalletListTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    royaltyForm: UseFormReturn<z.infer<typeof RoyaltyFormSchema>>;
  }
>(({ className, royaltyForm, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className={cn("flex flex-col gap-2", className)}>
      {royaltyForm.watch("wallets").map((wallet) => {
        return (
          <WalletListTableRow
            key={`join:wallet:${wallet.account_address}`}
            wallet={wallet}
          />
        );
      })}
      <div className="h-px w-full bg-divider" />{" "}
      <WalletListTabRowContainer>
        <div>Total Assets</div>
        <div>
          <SpringNumber
            previousValue={0}
            currentValue={royaltyForm
              .watch("wallets")
              .filter((wallet) => wallet.balance !== undefined)
              .reduce((acc, curr) => acc + (curr.balance ?? 0), 0)}
            numberFormatOptions={{
              style: "currency",
              currency: "USD",
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }}
          />
        </div>
      </WalletListTabRowContainer>
    </div>
  );
});
