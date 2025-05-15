import React from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../../../market-action-form-schema";
import { FundingSourceSelector } from "../../components/funding-source-selector";
import { InputAmountWrapper } from "../../components/input-amount-wrapper";
import { SlideUpWrapper } from "@/components/animations";
import { EnsoShortcutsWidget } from "../../components/enso-shortcuts-widget.tsx";
import { SONIC_CHAIN_ID } from "royco/sonic";
import { useAtomValue } from "jotai";
import { loadableEnrichedMarketAtom } from "@/store/market/atoms";
import { InfoIcon } from "lucide-react";
import { SecondaryLabel } from "../../../../../../composables";
import formatNumber from "@/utils/numbers";

export const APMarketActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {/**
       * Funding Source Selector
       */}
      <SlideUpWrapper delay={0.1}>
        <FundingSourceSelector
          fundingVaultAddress={marketActionForm.watch("funding_vault") || ""}
          onSelectFundingVaultAddress={(value) => {
            marketActionForm.setValue("funding_vault", value);
          }}
        />
      </SlideUpWrapper>

      {/**
       * Enso Shortcuts Widget
       */}
      {enrichedMarket?.chainId !== SONIC_CHAIN_ID && (
        <div className="mt-2">
          <EnsoShortcutsWidget
            token={enrichedMarket?.inputToken?.contractAddress!}
            symbol={enrichedMarket?.inputToken?.symbol ?? ""}
            chainId={enrichedMarket?.chainId!}
          />
        </div>
      )}

      {/**
       * Input Amount
       */}
      <div className="mt-3">
        <SlideUpWrapper delay={0.2}>
          <InputAmountWrapper marketActionForm={marketActionForm} />
        </SlideUpWrapper>
      </div>

      {/**
       * Min Deposit Indicator
       */}
      {enrichedMarket?.marketMetadata?.minDepositToken && (
        <div className="mt-3">
          <SlideUpWrapper delay={0.3}>
            <div className="rounded-xl border border-divider bg-z2 px-3 py-2 transition-all duration-200 ease-in-out hover:bg-focus">
              <div className="flex flex-row items-center gap-2">
                <InfoIcon className="h-4 w-4 text-secondary" />
                <div className="text-sm font-semibold text-secondary">INFO</div>
              </div>

              <SecondaryLabel className="mt-1 text-xs">
                Min. Deposit:{" "}
                {formatNumber(
                  enrichedMarket?.marketMetadata?.minDepositToken.tokenAmount,
                  {
                    type: "number",
                  }
                )}{" "}
                {enrichedMarket?.marketMetadata?.minDepositToken.symbol} (
                {formatNumber(
                  enrichedMarket?.marketMetadata?.minDepositToken
                    .tokenAmountUsd,
                  {
                    type: "currency",
                  }
                )}
                )
              </SecondaryLabel>
            </div>
          </SlideUpWrapper>
        </div>
      )}
    </div>
  );
});
