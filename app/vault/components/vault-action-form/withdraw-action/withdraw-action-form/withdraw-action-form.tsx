import React, { useMemo } from "react";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import {
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { InputAmountSelector } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-action-form/action-params/composables";
import { withdrawFormSchema } from "../withdraw-action";
import { boringVaultAtom } from "@/store/vault/atom/boring-vault";

import { useAtomValue } from "jotai";
import formatNumber from "@/utils/numbers";
import { WarningAlert } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-action-form/action-params/composables/warning-alert";
import { SlideUpWrapper } from "@/components/animations";
export const WithdrawActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    withdrawForm: UseFormReturn<z.infer<typeof withdrawFormSchema>>;
  }
>(({ className, withdrawForm, ...props }, ref) => {
  const boringVault = useAtomValue(boringVaultAtom);

  const balance = useMemo(() => {
    return boringVault?.user?.total_shares_in_base_asset;
  }, [boringVault]);

  const hasSufficientBalance = useMemo(() => {
    const amount = withdrawForm.getValues("amount");

    if (!balance || !amount) {
      return true;
    }

    return balance >= parseFloat(amount || "0");
  }, [balance, withdrawForm.watch("amount")]);

  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      <SecondaryLabel>Amount</SecondaryLabel>

      <InputAmountSelector
        containerClassName="mt-2"
        currentValue={withdrawForm.watch("amount")}
        setCurrentValue={(value) => {
          withdrawForm.setValue("amount", value);
        }}
        Prefix={() => {
          return (
            <div
              onClick={() => {
                withdrawForm.setValue("amount", balance?.toString() ?? "");
              }}
              className={cn(
                "flex cursor-pointer items-center justify-center",
                "text-xs font-300 text-secondary underline decoration-tertiary decoration-dotted underline-offset-[3px]",
                "transition-all duration-200 ease-in-out hover:opacity-80"
              )}
            >
              Max
            </div>
          );
        }}
        Suffix={() => {
          return <SecondaryLabel className="text-black">USDC</SecondaryLabel>;
        }}
      />

      {/**
       * Balance
       */}
      <TertiaryLabel className="mt-1 justify-end space-x-1">
        <span>Balance:</span>

        <span className="flex items-center justify-center">
          <span>{formatNumber(balance || 0)}</span>
          <span className="ml-1">USDC</span>
        </span>
      </TertiaryLabel>

      {/**
       * Insufficient balance indicator
       */}
      {!hasSufficientBalance && (
        <SlideUpWrapper className="mt-3" delay={0.4}>
          <WarningAlert>
            WARNING: You don't have sufficient balance.
          </WarningAlert>
        </SlideUpWrapper>
      )}
    </div>
  );
});
