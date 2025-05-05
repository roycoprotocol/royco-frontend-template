"use client";

import {
  isSolidityAddressValid,
  parseRawAmount,
  parseRawAmountToTokenAmount,
  parseTokenAmountToRawAmount,
} from "royco/utils";
import { UseFormReturn } from "react-hook-form";
import { LoadingSpinner } from "@/components/composables";
import { SecondaryLabel } from "../../../../../composables";
import { SlideUpWrapper } from "@/components/animations";
import { InputAmountSelector } from "../../composables";
import { MarketActionFormSchema } from "../../../market-action-form-schema";
import { useActiveMarket } from "../../../../../hooks";
import {
  MarketOfferType,
  MarketType,
  MarketUserType,
  useMarketManager,
} from "@/store";
import { z } from "zod";
import { TokenDisplayer } from "@/components/common";
import React, { useMemo } from "react";
import { TertiaryLabel } from "../../../../../composables";
import { RoycoMarketFundingType } from "royco/market";
import { useAccountBalance, useVaultBalance } from "royco/hooks";
import { NULL_ADDRESS } from "royco/constants";
import { useAccount } from "wagmi";
import { WarningAlert } from "../../composables/warning-alert";
import { cn } from "@/lib/utils";
import formatNumber from "@/utils/numbers";
import { useAtomValue } from "jotai";
import { loadableEnrichedMarketAtom } from "@/store/market/atoms";

export const InputAmountWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
    onAmountChange?: (value: { amount: number; rawAmount: string }) => void;
  }
>(({ className, marketActionForm, onAmountChange, ...props }, ref) => {
  const { address } = useAccount();

  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);

  const { offerType, userType, fundingType } = useMarketManager();

  const { isLoading: isLoadingWalletBalance, data: walletBalanceData } =
    useAccountBalance({
      chain_id: enrichedMarket?.chainId ?? 1,
      account: address || "",
      tokens: enrichedMarket?.inputToken
        ? [enrichedMarket.inputToken.contractAddress]
        : [],
    });

  const { isLoading: isLoadingVaultBalance, data: vaultBalanceData } =
    useVaultBalance({
      chain_id: enrichedMarket?.chainId ?? 1,
      account: address || "",
      vault_address: isSolidityAddressValid(
        "address",
        marketActionForm.watch("funding_vault")
      )
        ? marketActionForm.watch("funding_vault")!
        : NULL_ADDRESS,
    });

  const rawUserBalance = useMemo(() => {
    if (isLoadingWalletBalance || isLoadingVaultBalance) {
      return;
    }

    if (fundingType === RoycoMarketFundingType.wallet.id) {
      return (walletBalanceData?.[0]?.raw_amount ?? "0").toString();
    }

    if (fundingType === RoycoMarketFundingType.vault.id) {
      if (
        enrichedMarket?.marketType === 0 ||
        (enrichedMarket?.marketType === 1 &&
          userType === MarketUserType.ap.id &&
          offerType === MarketOfferType.limit.id)
      ) {
        if (!vaultBalanceData || !enrichedMarket) {
          return;
        }

        if (vaultBalanceData.token_id !== enrichedMarket.inputToken?.id) {
          return;
        }

        return parseRawAmount(vaultBalanceData?.raw_amount ?? "0");
      }
    }

    return;
  }, [walletBalanceData, vaultBalanceData, fundingType]);

  const userBalance = useMemo(() => {
    if (!rawUserBalance) {
      return;
    }

    return parseRawAmountToTokenAmount(
      rawUserBalance,
      enrichedMarket?.inputToken?.decimals ?? 0
    );
  }, [rawUserBalance, enrichedMarket]);

  const usdUserBalance = useMemo(() => {
    if (!userBalance || !enrichedMarket) {
      return;
    }

    return userBalance * enrichedMarket.inputToken?.price;
  }, [userBalance, enrichedMarket]);

  const hasSufficientBalance = useMemo(() => {
    if (isLoadingWalletBalance || isLoadingVaultBalance) {
      return true;
    }

    if (offerType !== MarketOfferType.market.id) {
      return true;
    }

    if (userType !== MarketUserType.ap.id) {
      return true;
    }

    if (
      fundingType !== RoycoMarketFundingType.wallet.id &&
      fundingType !== RoycoMarketFundingType.vault.id
    ) {
      return true;
    }

    if (!rawUserBalance || !marketActionForm.watch("quantity.raw_amount")) {
      return true;
    }

    return (
      BigInt(parseRawAmount(rawUserBalance)) >=
      BigInt(parseRawAmount(marketActionForm.watch("quantity.raw_amount")))
    );
  }, [
    fundingType,
    offerType,
    userType,
    isLoadingWalletBalance,
    isLoadingVaultBalance,
    rawUserBalance,
    marketActionForm.watch("quantity.raw_amount"),
  ]);

  const fillableBalance = useMemo(() => {
    if (!enrichedMarket) {
      return;
    }

    return enrichedMarket?.inputToken?.totalFillableForAP ?? 0;
  }, [enrichedMarket]);

  const usdFillableBalance = useMemo(() => {
    if (!fillableBalance || !enrichedMarket) {
      return;
    }

    return fillableBalance * enrichedMarket.inputToken?.price;
  }, [fillableBalance, enrichedMarket]);

  const userInputAmountUsd = useMemo(() => {
    if (!enrichedMarket) {
      return;
    }

    const inputTokenPrice = enrichedMarket.inputToken?.price;
    const userInputAmount = parseFloat(
      marketActionForm.watch("quantity.amount") || "0"
    );

    return userInputAmount * inputTokenPrice;
  }, [marketActionForm.watch("quantity.amount"), enrichedMarket]);

  const isLoadingBalance = isLoadingWalletBalance || isLoadingVaultBalance;

  return (
    <div ref={ref} className={cn("contents", className)} {...props}>
      <div className={cn("flex flex-row items-center justify-between")}>
        <SecondaryLabel className="font-medium text-black">
          {userType === MarketUserType.ip.id
            ? "Desired Amount"
            : "Input Amount"}
        </SecondaryLabel>

        {/**
         * Balance indicator
         */}
        {enrichedMarket?.marketType === 0 &&
          userType === MarketUserType.ap.id && (
            <TertiaryLabel className="justify-end space-x-1">
              <span>Balance:</span>

              <span className="flex items-center justify-center">
                {isLoadingBalance ? (
                  <LoadingSpinner className="ml-1 h-4 w-4" />
                ) : (
                  <span>{formatNumber(userBalance || 0)}</span>
                )}
                <span className="ml-1">
                  {enrichedMarket?.inputToken?.symbol?.toUpperCase()}
                </span>
              </span>

              <span>
                {`(${formatNumber(usdUserBalance || 0, { type: "currency" })})`}
              </span>
            </TertiaryLabel>
          )}
      </div>

      {/**
       * Input amount selector
       */}
      <InputAmountSelector
        containerClassName="mt-2"
        currentValue={marketActionForm.watch("quantity.amount") ?? ""}
        setCurrentValue={(value) => {
          const amount = value;
          const rawAmount = parseTokenAmountToRawAmount(
            amount,
            enrichedMarket?.inputToken?.decimals ?? 0
          );

          marketActionForm.setValue("quantity.amount", amount);
          marketActionForm.setValue("quantity.raw_amount", rawAmount);

          if (onAmountChange) {
            onAmountChange({ amount: parseFloat(amount || "0"), rawAmount });
          }
        }}
        Prefix={() => {
          if (userType === MarketUserType.ip.id) {
            return null;
          }

          return (
            <div
              onClick={() => {
                marketActionForm.setValue(
                  "quantity.amount",
                  userBalance?.toString()
                );
                marketActionForm.setValue(
                  "quantity.raw_amount",
                  rawUserBalance
                );
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
              tokens={
                enrichedMarket?.inputToken ? [enrichedMarket.inputToken] : []
              }
              symbols={true}
            />
          );
        }}
      />

      <div className="mt-2 flex flex-row items-center justify-between">
        {/**
         * User input amount usd
         */}
        <div>
          <TertiaryLabel className="justify-start italic">
            {formatNumber(
              userInputAmountUsd || 0,
              { type: "currency" },
              {
                average: false,
              }
            )}
          </TertiaryLabel>
        </div>

        {/**
         * Fillable balance indicator
         */}
        <div>
          {enrichedMarket?.marketType === 0 &&
            userType === MarketUserType.ap.id && (
              <TertiaryLabel className="justify-end space-x-1">
                <span>Fillable:</span>

                <span className="flex items-center justify-center">
                  <span>{formatNumber(fillableBalance || 0)}</span>
                  <span className="ml-1">
                    {enrichedMarket?.inputToken?.symbol?.toUpperCase()}
                  </span>
                </span>

                <span>
                  {`(${formatNumber(usdFillableBalance || 0, { type: "currency" })})`}
                </span>
              </TertiaryLabel>
            )}

          {/**
           * Balance indicator
           */}
          {enrichedMarket?.marketType === 1 &&
            userType === MarketUserType.ap.id && (
              <TertiaryLabel className="justify-end space-x-1">
                <span>Balance:</span>

                <span className="flex items-center justify-center">
                  {isLoadingBalance ? (
                    <LoadingSpinner className="ml-1 h-4 w-4" />
                  ) : (
                    <span>{formatNumber(userBalance || 0)}</span>
                  )}
                  <span className="ml-1">
                    {enrichedMarket?.inputToken?.symbol?.toUpperCase()}
                  </span>
                </span>

                <span>
                  {`(${formatNumber(usdUserBalance || 0, { type: "currency" })})`}
                </span>
              </TertiaryLabel>
            )}
        </div>
      </div>

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
