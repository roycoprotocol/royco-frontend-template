"use client";

import {
  isSolidityAddressValid,
  parseRawAmount,
  parseRawAmountToTokenAmount,
  parseTokenAmountToRawAmount,
} from "royco/utils";
import { UseFormReturn } from "react-hook-form";
import { LoadingSpinner } from "@/components/composables";
import { FormInputLabel } from "../../../../../composables";
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
import { BigNumber } from "ethers";
import { WarningAlert } from "../../composables/warning-alert";
import { cn } from "@/lib/utils";

export const InputAmountWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
    onAmountChange?: (value: { amount: number; rawAmount: string }) => void;
  }
>(({ className, marketActionForm, onAmountChange, ...props }, ref) => {
  const { address } = useAccount();

  const { currentMarketData, marketMetadata } = useActiveMarket();
  const { offerType, userType, viewType, fundingType } = useMarketManager();

  const { isLoading: isLoadingWalletBalance, data: walletBalanceData } =
    useAccountBalance({
      chain_id: marketMetadata.chain_id,
      account: address || "",
      tokens: currentMarketData
        ? [currentMarketData.input_token_data.contract_address]
        : [],
    });

  const { isLoading: isLoadingVaultBalance, data: vaultBalanceData } =
    useVaultBalance({
      chain_id: marketMetadata.chain_id,
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
        marketMetadata.market_type === MarketType.recipe.id ||
        (marketMetadata.market_type === MarketType.vault.id &&
          userType === MarketUserType.ap.id &&
          offerType === MarketOfferType.limit.id)
      ) {
        if (!vaultBalanceData || !currentMarketData) {
          return;
        }

        if (
          vaultBalanceData.token_id !== currentMarketData.input_token_data.id
        ) {
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
      currentMarketData?.input_token_data.decimals ?? 0
    );
  }, [rawUserBalance]);

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

    return BigNumber.from(parseRawAmount(rawUserBalance)).gt(
      BigNumber.from(
        parseRawAmount(marketActionForm.watch("quantity.raw_amount"))
      )
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

  const isLoadingBalance = isLoadingWalletBalance || isLoadingVaultBalance;

  return (
    <div ref={ref} className={cn("contents", className)} {...props}>
      <FormInputLabel
        size="sm"
        label={
          userType === MarketUserType.ip.id ? "Desired Amount" : "Input Amount"
        }
      />

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
            currentMarketData?.input_token_data.decimals ?? 0
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
                currentMarketData?.input_token_data
                  ? [currentMarketData.input_token_data]
                  : []
              }
              symbols={true}
            />
          );
        }}
      />

      {/**
       * Balance indicator
       */}
      {userType === MarketUserType.ap.id && (
        <TertiaryLabel className="mt-2 justify-end space-x-1">
          <span>Balance:</span>

          <span className="flex items-center justify-center">
            {isLoadingBalance ? (
              <LoadingSpinner className="ml-1 h-4 w-4" />
            ) : (
              Intl.NumberFormat("en-US", {
                style: "decimal",
                notation: "standard",
                minimumFractionDigits: 0,
                maximumFractionDigits: 8,
                useGrouping: true,
              }).format(userBalance || 0)
            )}
            <span className="ml-1">
              {currentMarketData?.input_token_data.symbol.toUpperCase()}
            </span>
          </span>
        </TertiaryLabel>
      )}

      {/**
       * Insufficient balance indicator
       */}
      {!hasSufficientBalance && (
        <SlideUpWrapper
          layout="position"
          layoutId={`motion:market:input-amount-wrapper:warning-alert:${fundingType}`}
          className="mt-3"
          delay={0.4}
        >
          <WarningAlert>
            WARNING: You don't have sufficient balance.
          </WarningAlert>
        </SlideUpWrapper>
      )}
    </div>
  );
});

// {/**
//  * Indicator to show remaining balance to fill
//  */}
//  {offerType === MarketOfferType.market.id &&
//   (marketMetadata.market_type === MarketType.recipe.id ||
//     userType === MarketUserType.ip.id) ? (
//     <TertiaryLabel className="mt-2 flex flex-row items-center justify-between">
//       <div>
//         {userType === MarketUserType.ap.id
//           ? Intl.NumberFormat("en-US", {
//               notation: "standard",
//               useGrouping: true,
//               minimumFractionDigits: 0,
//               maximumFractionDigits: 8,
//             }).format(
//               parseRawAmountToTokenAmount(
//                 currentMarketData?.quantity_ip ?? "0", // @note: AP fills IP quantity
//                 currentMarketData?.input_token_data.decimals ?? 0
//               )
//             )
//           : Intl.NumberFormat("en-US", {
//               notation: "standard",
//               useGrouping: true,
//               minimumFractionDigits: 0,
//               maximumFractionDigits: 8,
//             }).format(
//               parseRawAmountToTokenAmount(
//                 currentMarketData?.quantity_ap ?? "0", // @note: IP fills AP quantity
//                 currentMarketData?.input_token_data.decimals ?? 0
//               )
//             )}{" "}
//         {currentMarketData?.input_token_data.symbol.toUpperCase()} Fillable
//         in Total
//       </div>
//     </TertiaryLabel>
//   ) : null}
