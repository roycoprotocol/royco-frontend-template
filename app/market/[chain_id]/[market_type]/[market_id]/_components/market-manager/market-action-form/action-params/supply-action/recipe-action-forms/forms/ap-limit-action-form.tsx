import React, { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketActionFormSchema } from "../../../../market-action-form-schema";
import {
  IncentiveTokenSelector,
  InputExpirySelector,
} from "../../../composables";
import { InputAmountWrapper } from "../../components/input-amount-wrapper";
import { FundingSourceSelector } from "../../components/funding-source-selector";
import { RoycoMarketType } from "royco/market";
import { useActiveMarket } from "../../../../../../hooks";
import { SlideUpWrapper } from "@/components/animations";
import { FormInputLabel } from "@/components/composables";
import { IncentiveAmountWrapper } from "../../components/incentive-amount-wrapper";
import { IncentiveYieldWrapper } from "../../components/incentive-yield-wrapper";
import { parseTokenAmountToRawAmount } from "royco/utils";

export const APR_LOCKUP_CONSTANT = 365 * 24 * 60 * 60;

export const APLimitActionForm = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
  }
>(({ className, marketActionForm, ...props }, ref) => {
  const { currentMarketData, marketMetadata, currentHighestOffers } =
    useActiveMarket();

  const highestIncentiveData = useMemo(() => {
    if (marketMetadata.market_type === RoycoMarketType.recipe.id) {
      if (
        !currentHighestOffers ||
        currentHighestOffers.ip_offers.length === 0 ||
        currentHighestOffers.ip_offers[0].tokens_data.length === 0
      ) {
        return null;
      }

      return currentHighestOffers.ip_offers[0].tokens_data[0];
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

    const lockupTime = parseInt(currentMarketData?.lockup_time || "0");

    let incentiveAmount = "0";
    if (incentiveToken.price) {
      incentiveAmount = (
        (apr * inputAmountUsd * lockupTime) /
        (incentiveToken.price * APR_LOCKUP_CONSTANT)
      ).toString();
    }

    const rawIncentiveAmount = parseTokenAmountToRawAmount(
      incentiveAmount,
      incentiveToken.decimals
    );

    const updatedIncentiveTokens = marketActionForm
      .watch("incentive_tokens")
      .map((t) =>
        t.id === incentiveToken.id
          ? {
              ...t,
              amount: incentiveAmount,
              raw_amount: rawIncentiveAmount,
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
    const incentiveAmountUsd = incentiveToken.amount * incentiveToken.price;

    const lockupTime = parseInt(currentMarketData?.lockup_time || "0");

    let apr = 0;
    if (inputAmountUsd > 0 && lockupTime > 0) {
      apr =
        (incentiveAmountUsd * APR_LOCKUP_CONSTANT) /
        (inputAmountUsd * lockupTime);
    }

    marketActionForm.setValue("annual_change_ratio", (apr * 100).toString());
  };

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      {/**
       * Funding Source Selector
       */}
      <SlideUpWrapper
        layout="position"
        layoutId="motion:market:supply-action:funding-source-selector"
        delay={0.1}
      >
        <FundingSourceSelector
          fundingVaultAddress={marketActionForm.watch("funding_vault") || ""}
          onSelectFundingVaultAddress={(value) => {
            marketActionForm.setValue("funding_vault", value);
          }}
        />
      </SlideUpWrapper>

      {/**
       * Incentive Yield
       */}
      <div className="mt-2">
        <SlideUpWrapper
          layout="position"
          layoutId="motion:market:supply-action:incentive-yield-wrapper"
          delay={0.2}
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
      </div>

      {/**
       * Input Amount
       */}
      <div className="mt-2">
        <SlideUpWrapper
          layout="position"
          layoutId="motion:market:supply-action:input-amount-wrapper"
          delay={0.3}
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
      <div className="mt-2">
        <SlideUpWrapper
          layout="position"
          layoutId="motion:market:supply-action:incentive-token-selector"
          delay={0.4}
        >
          <FormInputLabel size="sm" label="Incentives Requested" />

          <IncentiveTokenSelector
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
      </div>

      {/**
       * Incentive Amount
       */}
      <div className="mt-2">
        <SlideUpWrapper
          layout="position"
          layoutId="motion:market:supply-action:incentive-amount-wrapper"
          delay={0.5}
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
                  amount: value.amount,
                  raw_amount: value.rawAmount,
                }
              );
            }}
          />
        </SlideUpWrapper>
      </div>

      {/**
       * Input Expiry
       */}
      <div className="mt-4">
        <SlideUpWrapper
          layout="position"
          layoutId="motion:market:supply-action:input-expiry-selector"
          delay={0.6}
        >
          <InputExpirySelector marketActionForm={marketActionForm} />
        </SlideUpWrapper>
      </div>
    </div>
  );
});
