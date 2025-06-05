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
import { useAtom, useAtomValue } from "jotai";
import {
  isTemptestFeeApplicable,
  loadableEnrichedMarketAtom,
} from "@/store/market/atoms";
import { useMarketManager } from "@/store/use-market-manager";
import { InfoIcon } from "lucide-react";
import { SecondaryLabel } from "../../../../../../composables";
import formatNumber from "@/utils/numbers";
import { Button } from "@/components/ui/button";
import { showEnsoShortcutsWidgetAtom } from "@/store/global";

export const APMarketActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);
  const [showEnsoWidget, setShowEnsoWidget] = useAtom(
    showEnsoShortcutsWidgetAtom
  );

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {/**
       * Funding Source Selector & Enso Shortcuts Widget
       */}
      <SlideUpWrapper delay={0.1}>
        <EnsoShortcutsWidget
          token={enrichedMarket?.inputToken.contractAddress!}
          symbol={enrichedMarket?.inputToken.symbol!}
          chainId={enrichedMarket?.chainId!}
        >
          <div className="flex-1">
            <FundingSourceSelector
              fundingVaultAddress={
                marketActionForm.watch("funding_vault") || ""
              }
              onSelectFundingVaultAddress={(value) => {
                marketActionForm.setValue("funding_vault", value);
              }}
            />
          </div>

          {enrichedMarket?.chainId !== SONIC_CHAIN_ID && (
            <div className="mt-7">
              <Button
                size="sm"
                variant="outline"
                className="h-[33px] border-divider font-light"
                onClick={() => setShowEnsoWidget(!showEnsoWidget)}
              >
                Or get {enrichedMarket?.inputToken.symbol!}
              </Button>
            </div>
          )}
        </EnsoShortcutsWidget>
      </SlideUpWrapper>

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
                <div className="text-sm font-semibold text-secondary">
                  Minimum Deposit
                </div>
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

      {/**
       * Tempest Fees Indicator
       */}
      {isTemptestFeeApplicable(enrichedMarket?.id) && (
        <div className="mt-3">
          <SlideUpWrapper delay={0.3}>
            <div className="rounded-xl border border-divider bg-z2 px-3 py-2 transition-all duration-200 ease-in-out hover:bg-focus">
              <div className="flex flex-row items-center gap-2">
                <InfoIcon className="h-4 w-4 text-secondary" />
                <div className="text-sm font-semibold text-secondary">
                  Tempest Fees
                </div>
              </div>

              <SecondaryLabel className="mt-1 text-xs">
                ALM Fee on deposits: 0.65% / Performance Fee: 10%
              </SecondaryLabel>
            </div>
          </SlideUpWrapper>
        </div>
      )}
    </div>
  );
});
