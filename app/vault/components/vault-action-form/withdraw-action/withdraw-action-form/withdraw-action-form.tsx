import React, { useMemo } from "react";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import {
  PrimaryLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { InputAmountSelector } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-action-form/action-params/composables";
import { withdrawFormSchema } from "../withdraw-action";
import { useAtomValue } from "jotai";
import formatNumber from "@/utils/numbers";
import { WarningAlert } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-action-form/action-params/composables/warning-alert";
import { SlideUpWrapper } from "@/components/animations";
import {
  vaultMetadataAtom,
  vaultManagerAtom,
} from "@/store/vault/vault-manager";
import { TokenDisplayer } from "@/components/common";

export const WithdrawActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    withdrawForm: UseFormReturn<z.infer<typeof withdrawFormSchema>>;
  }
>(({ className, withdrawForm, ...props }, ref) => {
  const vault = useAtomValue(vaultManagerAtom);

  const { data } = useAtomValue(vaultMetadataAtom);
  const token = useMemo(() => {
    return data?.depositTokens[0];
  }, [data]);

  const balance = useMemo(() => {
    return vault?.account?.sharesInBaseAsset;
  }, [vault]);

  const hasSufficientBalance = useMemo(() => {
    const amount = withdrawForm.getValues("amount");

    if (!amount) {
      return true;
    }

    return (balance || 0) >= parseFloat(amount || "0");
  }, [balance, withdrawForm.watch("amount")]);

  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      <SlideUpWrapper delay={0.1}>
        <div className="flex items-end justify-between">
          <PrimaryLabel className="text-sm font-normal">Amount</PrimaryLabel>

          <TertiaryLabel
            onClick={() => {
              withdrawForm.setValue("amount", balance?.toString() ?? "");
            }}
            className={cn(
              "flex cursor-pointer items-center justify-center text-xs font-normal text-_tertiary_ underline decoration-_divider_ underline-offset-2",
              "transition-all duration-200 ease-in-out hover:opacity-80"
            )}
          >
            Max
          </TertiaryLabel>
        </div>

        <InputAmountSelector
          containerClassName="my-3 bg-transparent border-none px-0"
          className="font-fragmentMono text-2xl font-normal"
          placeholder="0.00"
          currentValue={withdrawForm.watch("amount")}
          setCurrentValue={(value) => {
            withdrawForm.setValue("amount", value);
          }}
          Suffix={() => {
            return (
              <TokenDisplayer
                size={6}
                tokens={[token]}
                symbols={true}
                symbolClassName="text-primary text-base font-normal"
              />
            );
          }}
        />

        {/**
         * Balance
         */}
        <SecondaryLabel className="space-x-1 border-t border-_divider_ pt-1 text-xs font-medium text-_secondary_">
          <span>AVAILABLE BALANCE:</span>

          <span className="flex items-center justify-center">
            <span>{formatNumber(balance || 0)}</span>
            <span className="ml-1">{token.symbol}</span>
          </span>
        </SecondaryLabel>
      </SlideUpWrapper>

      {/**
       * Insufficient balance indicator
       */}
      {!hasSufficientBalance && (
        <SlideUpWrapper className="mt-3" delay={0.4}>
          <WarningAlert className="min-h-10 place-content-center rounded-sm">
            WARNING: You don't have sufficient balance.
          </WarningAlert>
        </SlideUpWrapper>
      )}
    </div>
  );
});
