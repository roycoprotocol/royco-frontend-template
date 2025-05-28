"use client";

import { parseTokenAmountToRawAmount } from "royco/utils";
import { UseFormReturn } from "react-hook-form";
import { FormInputLabel, SecondaryLabel } from "../../../../../composables";
import { InputAmountSelector } from "../../composables";
import { MarketActionFormSchema } from "../../../market-action-form-schema";
import { z } from "zod";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import React from "react";
import { cn } from "@/lib/utils";
import { RoycoMarketType } from "royco/market";
import { useAtomValue } from "jotai";
import { loadableEnrichedMarketAtom } from "@/store/market/atoms";

export const IncentiveAmountWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
    onAmountChange?: (value: { amount: number; rawAmount: string }) => void;
  }
>(({ className, marketActionForm, onAmountChange, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  const selectedIncentiveToken =
    marketActionForm.watch("incentive_tokens")?.[0] || null;

  const handleAmountChange = (value: string) => {
    const amount = value;
    const rawAmount = parseTokenAmountToRawAmount(
      amount,
      selectedIncentiveToken.decimals ?? 0
    );

    if (enrichedMarket?.marketType === RoycoMarketType.vault.value) {
      const updatedIncentiveTokens = marketActionForm
        .watch("incentive_tokens")
        .map((t) =>
          t.id === selectedIncentiveToken.id
            ? { ...t, distribution: amount }
            : t
        );

      marketActionForm.setValue("incentive_tokens", updatedIncentiveTokens);
    } else {
      const updatedIncentiveTokens = marketActionForm
        .watch("incentive_tokens")
        .map((t) =>
          t.id === selectedIncentiveToken.id
            ? { ...t, amount: value, raw_amount: rawAmount }
            : t
        );

      marketActionForm.setValue("incentive_tokens", updatedIncentiveTokens);
    }

    if (onAmountChange) {
      onAmountChange({ amount: parseFloat(amount || "0"), rawAmount });
    }
  };

  if (!selectedIncentiveToken) {
    return (
      <div ref={ref} className={cn("contents", className)} {...props}>
        <AlertIndicator className="w-full rounded-md border border-dashed">
          No add. incentives offered
        </AlertIndicator>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("contents", className)} {...props}>
      <FormInputLabel size="sm" label="Incentives Requested" />

      {/**
       * Input amount selector
       */}
      <InputAmountSelector
        containerClassName="mt-2"
        currentValue={
          enrichedMarket?.marketType === RoycoMarketType.vault.value
            ? (selectedIncentiveToken.distribution ?? "")
            : (selectedIncentiveToken.amount ?? "")
        }
        setCurrentValue={(value) => handleAmountChange(value)}
        Suffix={() => {
          return (
            <div className="flex shrink-0 items-center">
              <TokenDisplayer
                size={4}
                tokens={[selectedIncentiveToken]}
                symbols={false}
              />
              {enrichedMarket?.marketType === RoycoMarketType.vault.value ? (
                <SecondaryLabel className="font-gt font-light text-black">
                  {selectedIncentiveToken.symbol} / YEAR
                </SecondaryLabel>
              ) : (
                <SecondaryLabel className="font-gt font-light text-black">
                  {selectedIncentiveToken.symbol}
                </SecondaryLabel>
              )}
            </div>
          );
        }}
      />
    </div>
  );
});
