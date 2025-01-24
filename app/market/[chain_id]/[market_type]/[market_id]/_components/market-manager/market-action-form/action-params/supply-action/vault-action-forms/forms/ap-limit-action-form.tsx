import React, { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../../../market-action-form-schema";
import { InputExpirySelector } from "../../../composables";
import { useMarketManager } from "@/store";
import { InputAmountWrapper } from "../../components/input-amount-wrapper";
import { SlideUpWrapper } from "@/components/animations";
import { IncentiveYieldWrapper } from "../../components/incentive-yield-wrapper";
import { useActiveMarket } from "../../../../../../hooks";
import { IncentiveAmountWrapper } from "../../components/incentive-amount-wrapper";
import { RoycoMarketType } from "royco/market";
import { BigNumber } from "ethers";
import { APR_LOCKUP_CONSTANT } from "../../recipe-action-forms/forms/ap-limit-action-form";
import { InfoIcon } from "lucide-react";
import { SecondaryLabel } from "../../../../../../composables";

export const APLimitActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { currentMarketData, marketMetadata, currentHighestOffers } =
    useActiveMarket();

  const { viewType } = useMarketManager();

  const highestIncentiveData = useMemo(() => {
    if (marketMetadata.market_type === RoycoMarketType.vault.id) {
      if (
        !currentMarketData ||
        currentMarketData.incentive_tokens_data.length === 0
      ) {
        return null;
      }

      return currentMarketData.incentive_tokens_data.find((token_data) => {
        return BigNumber.from(token_data.raw_amount ?? "0").gt(0);
      });
    }
  }, [currentMarketData, currentHighestOffers]);

  useEffect(() => {
    if (highestIncentiveData) {
      const token = {
        ...highestIncentiveData,
        total_supply: highestIncentiveData.total_supply?.toString() || "0",
        fdv: highestIncentiveData.fdv?.toString() || "0",
        token_id: highestIncentiveData.id,
      };

      delete (token as any).annual_change_ratio;
      delete (token as any).per_input_token;
      delete (token as any).rate_per_year;
      delete (token as any).raw_amount;
      delete (token as any).token_amount;
      delete (token as any).token_amount_usd;

      marketActionForm.setValue(
        "annual_change_ratio",
        (
          parseFloat(
            highestIncentiveData.annual_change_ratio?.toString() || "0"
          ) * 100
        ).toString()
      );
      marketActionForm.setValue("incentive_tokens", [token]);
    }
  }, [highestIncentiveData]);

  const selectedInputToken = useMemo(() => {
    if (!currentMarketData?.input_token_data) {
      return;
    }
    return currentMarketData.input_token_data;
  }, [currentMarketData]);
  const selectedIncentiveTokens = marketActionForm.watch("incentive_tokens");

  const updateIncentiveTokenAmount = (
    incentiveApr: string,
    inputTokenAmount: number,
    inputToken: any,
    incentiveToken: any
  ) => {
    const apr = parseFloat(incentiveApr || "0") / 100;
    const inputAmountUsd = inputTokenAmount * inputToken.price;

    let incentiveAmount = "0";
    if (incentiveToken.price) {
      incentiveAmount = (
        (apr * inputAmountUsd) /
        (incentiveToken.price * APR_LOCKUP_CONSTANT)
      ).toString();
    }

    const updatedIncentiveTokens = marketActionForm
      .watch("incentive_tokens")
      .map((t) =>
        t.id === incentiveToken.id
          ? {
              ...t,
              distribution: incentiveAmount,
            }
          : t
      );

    marketActionForm.setValue("incentive_tokens", updatedIncentiveTokens);
  };

  const updateIncentiveApr = (
    inputTokenAmount: number,
    inputToken: any,
    incentiveToken: any
  ) => {
    const inputAmountUsd = inputTokenAmount * inputToken.price;
    const incentiveAmountUsd =
      incentiveToken.distribution * incentiveToken.price;

    let apr = 0;
    if (inputAmountUsd > 0) {
      apr = (incentiveAmountUsd * APR_LOCKUP_CONSTANT) / inputAmountUsd;
    }

    marketActionForm.setValue("annual_change_ratio", (apr * 100).toString());
  };

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {/**
       * Incentive Yield
       */}
      <SlideUpWrapper
        layout="position"
        layoutId={`motion:market:vault:ap-limit:incentive-yield-wrapper:${viewType}`}
        delay={0.1}
      >
        <IncentiveYieldWrapper
          marketActionForm={marketActionForm}
          onYieldChange={(value) => {
            if (!selectedInputToken || selectedIncentiveTokens.length === 0) {
              return;
            }

            updateIncentiveTokenAmount(
              value,
              parseFloat(marketActionForm.watch("quantity.amount") || "0"),
              selectedInputToken,
              selectedIncentiveTokens[0]
            );
          }}
        />
      </SlideUpWrapper>

      {/**
       * Input Amount
       */}
      <div className="mt-3">
        <SlideUpWrapper
          layout="position"
          layoutId={`motion:market:vault:ap-limit:input-amount-wrapper:${viewType}`}
          delay={0.2}
        >
          <InputAmountWrapper
            marketActionForm={marketActionForm}
            onAmountChange={(value) => {
              if (!selectedInputToken || selectedIncentiveTokens.length === 0) {
                return;
              }

              updateIncentiveTokenAmount(
                marketActionForm.watch("annual_change_ratio"),
                value.amount,
                selectedInputToken,
                selectedIncentiveTokens[0]
              );
            }}
          />
        </SlideUpWrapper>
      </div>

      <hr className="my-3" />

      {/**
       * Incentive Token Selector
       */}
      {/* <div className="mt-3">
        <SlideUpWrapper
          layout="position"
          layoutId={`motion:market:vault:ap-limit:incentive-token-selector:${viewType}`}
          delay={0.4}
        >
          <FormInputLabel size="sm" label="Incentive Requested per USDC" />

          <IncentiveTokenSelector
            token_ids={currentMarketData?.base_incentive_ids ?? []}
            selected_token_ids={selectedIncentiveTokens.map(
              (token) => token.id
            )}
            onSelect={(token) => {
              const incentiveTokens =
                marketActionForm.watch("incentive_tokens");

              if (incentiveTokens.some((t) => t.id === token.id)) {
                marketActionForm.setValue("incentive_tokens", []);
              } else {
                marketActionForm.setValue("incentive_tokens", [token]);

                if (!selectedInputToken) {
                  return;
                }

                updateIncentiveTokenAmount(
                  marketActionForm.watch("annual_change_ratio"),
                  parseFloat(marketActionForm.watch("quantity.amount") || "0"),
                  selectedInputToken,
                  token
                );
              }
            }}
            className="mt-2"
          />
        </SlideUpWrapper>
      </div> */}

      {/**
       * Incentive Amount
       */}
      <div className="mt-3">
        <SlideUpWrapper
          layout="position"
          layoutId={`motion:market:vault:ap-limit:incentive-amount-wrapper:${viewType}`}
          delay={0.3}
        >
          <IncentiveAmountWrapper
            marketActionForm={marketActionForm}
            onAmountChange={(value) => {
              if (!selectedInputToken || selectedIncentiveTokens.length === 0) {
                return;
              }

              updateIncentiveApr(
                parseFloat(marketActionForm.watch("quantity.amount") || "0"),
                selectedInputToken,
                {
                  ...selectedIncentiveTokens[0],
                  distribution: value.amount,
                }
              );
            }}
          />
        </SlideUpWrapper>
      </div>

      {/**
       * Input Expiry
       */}
      <div className="mt-5">
        <SlideUpWrapper
          layout="position"
          layoutId={`motion:market:vault:ap-limit:input-expiry-selector:${viewType}`}
          delay={0.4}
        >
          <InputExpirySelector marketActionForm={marketActionForm} />
        </SlideUpWrapper>
      </div>

      {/**
       * Disclaimer
       */}
      <div className="mt-3">
        <SlideUpWrapper
          layout="position"
          layoutId={`motion:market:vault:ap-limit:disclaimer:${viewType}`}
          delay={0.1}
        >
          <div className="flex flex-row items-center gap-3 rounded-lg bg-z2 p-3">
            <InfoIcon className={cn("h-4 w-4 shrink-0 text-secondary")} />
            <SecondaryLabel className="break-normal text-xs">
              Your offer will be placed in the rate of incentives to input
              asset, not percentage APY.
            </SecondaryLabel>
          </div>
        </SlideUpWrapper>
      </div>
    </div>
  );
});
