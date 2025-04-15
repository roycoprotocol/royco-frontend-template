import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useAccount } from "wagmi";

import { InputAmountSelector } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-action-form/action-params/composables";
import {
  PrimaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { depositFormSchema } from "../deposit-action";
import { useAccountBalance } from "royco/hooks";
import { useAtomValue } from "jotai";
import { parseRawAmountToTokenAmount } from "royco/utils";
import { SlideUpWrapper } from "@/components/animations";
import { WarningAlert } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-action-form/action-params/composables/warning-alert";
import { LoadingSpinner } from "@/components/composables";
import formatNumber from "@/utils/numbers";
import { vaultMetadataAtom } from "@/store/vault/vault-manager";
import { TokenDisplayer } from "@/components/common";

export const DepositActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    depositForm: UseFormReturn<z.infer<typeof depositFormSchema>>;
  }
>(({ className, depositForm, ...props }, ref) => {
  const { address } = useAccount();

  const { data } = useAtomValue(vaultMetadataAtom);
  const token = useMemo(() => {
    return data?.depositTokens[0];
  }, [data]);

  const { isLoading: isLoadingWalletBalance, data: walletBalance } =
    useAccountBalance({
      chain_id: data.chainId,
      account: address ?? "",
      tokens: token.contractAddress ? [token.contractAddress] : [],
    });

  const balance = useMemo(() => {
    if (isLoadingWalletBalance) {
      return;
    }
    const rawBalance = (walletBalance?.[0]?.raw_amount ?? "0").toString();
    return parseRawAmountToTokenAmount(rawBalance, token.decimals);
  }, [walletBalance]);

  const hasSufficientBalance = useMemo(() => {
    const amount = depositForm.getValues("amount");

    if (isLoadingWalletBalance || !balance || !amount) {
      return true;
    }

    return balance >= parseFloat(amount || "0");
  }, [isLoadingWalletBalance, balance, depositForm.watch("amount")]);

  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      <SlideUpWrapper delay={0.1}>
        <PrimaryLabel className="text-sm font-normal">Amount</PrimaryLabel>

        <InputAmountSelector
          containerClassName="mt-2"
          currentValue={depositForm.watch("amount")}
          setCurrentValue={(value) => {
            depositForm.setValue("amount", value);
          }}
          Prefix={() => {
            return (
              <div
                onClick={() => {
                  depositForm.setValue("amount", balance?.toString() ?? "");
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
            return (
              <TokenDisplayer
                size={4}
                tokens={[token]}
                symbols={true}
                symbolClassName="text-primary text-xs font-semibold"
              />
            );
          }}
        />

        {/**
         * Balance
         */}
        <TertiaryLabel className="mt-1 justify-end space-x-1">
          <span>Balance:</span>

          <span className="flex items-center justify-center">
            {isLoadingWalletBalance ? (
              <LoadingSpinner className="ml-1 h-4 w-4" />
            ) : (
              <span>{formatNumber(balance || 0)}</span>
            )}
            <span className="ml-1">{token.symbol}</span>
          </span>
        </TertiaryLabel>
      </SlideUpWrapper>

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
