import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useAccount } from "wagmi";

import { InputAmountSelector } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-action-form/action-params/composables";
import {
  PrimaryLabel,
  SecondaryLabel,
  TertiaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { depositFormSchema } from "../deposit-action";
import { useAccountBalance } from "royco/hooks";
import { useAtom, useAtomValue } from "jotai";
import { parseRawAmountToTokenAmount } from "royco/utils";
import { SlideUpWrapper } from "@/components/animations";
import { WarningAlert } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-action-form/action-params/composables/warning-alert";
import { LoadingSpinner } from "@/components/composables";
import formatNumber from "@/utils/numbers";
import { vaultMetadataAtom } from "@/store/vault/vault-manager";
import { TokenDisplayer } from "@/components/common";
import { InfoTip } from "@/app/_components/common/info-tip";
import { InfoCard } from "@/app/_components/common/info-card";
import { AnnualYieldAssumption } from "@/app/vault/common/annual-yield-assumption";
import { EnsoShortcutsWidget } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-manager/market-action-form/action-params/supply-action/components/enso-shortcuts-widget.tsx/enso-shortcuts-widget";
import { Button } from "@/components/ui/button";
import { showEnsoShortcutsWidgetAtom } from "@/store/global";
import { DottedBracket } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/icons/dotted-bracket";

export const DepositActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    depositForm: UseFormReturn<z.infer<typeof depositFormSchema>>;
  }
>(({ className, depositForm, ...props }, ref) => {
  const { address } = useAccount();
  const [showEnsoWidget, setShowEnsoWidget] = useAtom(
    showEnsoShortcutsWidgetAtom
  );

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

    if (isLoadingWalletBalance || !amount) {
      return true;
    }

    return (balance || 0) >= parseFloat(amount || "0");
  }, [isLoadingWalletBalance, balance, depositForm.watch("amount")]);

  const dailyYieldAmount = useMemo(() => {
    const amount = parseFloat(depositForm.getValues("amount") || "0");

    if (!amount) {
      return 0;
    }

    return (amount * data.yieldRate * token.price) / 365;
  }, [depositForm.watch("amount")]);

  return (
    <div ref={ref} className={cn("flex grow flex-col", className)} {...props}>
      <SlideUpWrapper delay={0.1}>
        <div className="flex items-end justify-between">
          <PrimaryLabel className="text-sm font-normal">Amount</PrimaryLabel>

          <TertiaryLabel
            onClick={() => {
              depositForm.setValue("amount", balance?.toString() ?? "");
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
          currentValue={depositForm.watch("amount")}
          setCurrentValue={(value) => {
            depositForm.setValue("amount", value);
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
        <SecondaryLabel className="space-x-1 border-t border-_divider_ pt-1 text-xs font-medium tracking-wide text-_secondary_">
          <span>AVAILABLE:</span>

          <span className="flex items-center justify-center">
            {isLoadingWalletBalance ? (
              <LoadingSpinner className="ml-1 h-4 w-4" />
            ) : (
              <span>
                {formatNumber(
                  balance || 0,
                  { type: "number" },
                  {
                    mantissa: 6,
                  }
                )}
              </span>
            )}
            <span className="ml-1">{token.symbol}</span>
          </span>
        </SecondaryLabel>

        <div className="mt-1">
          <EnsoShortcutsWidget
            token={token.contractAddress}
            symbol={token.symbol}
            chainId={data.chainId}
          >
            <div className="flex w-full justify-end">
              <Button
                size="sm"
                variant="secondary"
                className="rounded-sm"
                onClick={() => setShowEnsoWidget(!showEnsoWidget)}
              >
                <div className="flex items-center gap-2">
                  <DottedBracket className="h-5 w-5 text-inherit" />
                  <span>Get {token.symbol}</span>
                </div>
              </Button>
            </div>
          </EnsoShortcutsWidget>
        </div>
      </SlideUpWrapper>

      {/**
       * Insufficient balance indicator
       */}
      {!hasSufficientBalance && (
        <SlideUpWrapper className="mt-3">
          <WarningAlert className="min-h-10 place-content-center rounded-sm">
            WARNING: You don't have sufficient balance.
          </WarningAlert>
        </SlideUpWrapper>
      )}

      {/* <SlideUpWrapper delay={0.2} className="mt-6">
        <PrimaryLabel className="text-sm font-normal">
          Projected Yield
        </PrimaryLabel>

        <div className="my-3 flex items-end gap-2">
          <div className="font-fragmentMono text-2xl font-normal">
            {formatNumber(data.yieldRate, {
              type: "percent",
            })}
          </div>

          <SecondaryLabel className="mb-1">
            {formatNumber(dailyYieldAmount, {
              type: "currency",
            }) + " per day"}
          </SecondaryLabel>
        </div>

        <SecondaryLabel className="mt-1 text-xs font-medium text-_secondary_">
          <div className="flex items-center gap-1">
            <span className="flex gap-1">
              Based on
              <span className="border-b-2 border-dotted border-current">
                Current
              </span>
              APY
            </span>

            <InfoTip contentClassName="max-w-[400px]">
              Estimated APY reflects the Vault's current performance based on
              token prices and market allocations. It excludes compounding,
              duration, and future changes in token value. Vault curators
              regularly rebalance and reallocate. Actual rewards may vary.
            </InfoTip>
          </div>
        </SecondaryLabel>
      </SlideUpWrapper> */}
    </div>
  );
});
