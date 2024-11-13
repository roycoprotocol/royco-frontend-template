import { AnimatePresence } from "framer-motion";
import {
  isSolidityAddressValid,
  parseRawAmount,
  parseRawAmountToTokenAmount,
  parseTokenAmountToRawAmount,
} from "@/sdk/utils";
import { UseFormReturn } from "react-hook-form";
import { SpringNumber, LoadingSpinner } from "@/components/composables";
import { FormInputLabel } from "../../../composables";
import { SlideUpWrapper } from "@/components/animations";
import { InputAmountSelector } from "../composables";
import { MarketActionFormSchema } from "../../market-action-form-schema";
import { useActiveMarket } from "../../../hooks";
import {
  MarketOfferType,
  MarketType,
  MarketUserType,
  useMarketManager,
} from "@/store";
import { z } from "zod";
import { motion } from "framer-motion";
import { TokenDisplayer } from "@/components/common";
import React from "react";
import { TertiaryLabel } from "../../../composables";
import { RoycoMarketFundingType, RoycoMarketUserType } from "@/sdk/market";
import { useAccountBalance, useVaultBalance } from "@/sdk/hooks";
import { NULL_ADDRESS } from "@/sdk/constants";
import { useAccount } from "wagmi";
import { BigNumber } from "ethers";
import { WarningAlert } from "./warning-alert";

export const InputAmountWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketActionForm: UseFormReturn<z.infer<typeof MarketActionFormSchema>>;
    delay?: number;
  }
>(({ className, marketActionForm, delay, ...props }, ref) => {
  const { address } = useAccount();
  const { currentMarketData, marketMetadata } = useActiveMarket();
  const { offerType, userType, fundingType } = useMarketManager();

  const { isLoading: isLoadingWallet, data: dataWallet } = useAccountBalance({
    chain_id: marketMetadata.chain_id,
    account: address || "",
    tokens: currentMarketData
      ? [currentMarketData.input_token_data.contract_address]
      : [],
  });

  const { isLoading: isLoadingVault, data: dataVault } = useVaultBalance({
    chain_id: marketMetadata.chain_id,
    account: address || "",
    vault_address:
      fundingType === RoycoMarketFundingType.vault.id
        ? isSolidityAddressValid(
            "address",
            marketActionForm.watch("funding_vault")
          )
          ? (marketActionForm.watch("funding_vault") ?? NULL_ADDRESS)
          : NULL_ADDRESS
        : NULL_ADDRESS,
  });

  let balance: string = "";

  const isLoading = isLoadingWallet || isLoadingVault;

  if (!isLoading) {
    if (marketMetadata.market_type === MarketType.recipe.id) {
      if (fundingType === RoycoMarketFundingType.wallet.id) {
        balance = (dataWallet?.[0]?.raw_amount ?? "0").toString();
      } else if (fundingType === RoycoMarketFundingType.vault.id) {
        if (dataVault?.token_id === currentMarketData?.input_token_data.id) {
          balance = parseRawAmount(dataVault?.raw_amount ?? "0");
        } else {
          balance = "";
        }
      } else {
        balance = "";
      }
    } else {
      if (
        userType === MarketUserType.ap.id &&
        offerType === MarketOfferType.limit.id
      ) {
        if (fundingType === RoycoMarketFundingType.wallet.id) {
          balance = (dataWallet?.[0]?.raw_amount ?? "0").toString();
        } else if (fundingType === RoycoMarketFundingType.vault.id) {
          if (dataVault?.token_id === currentMarketData?.input_token_data.id) {
            balance = parseRawAmount(dataVault?.raw_amount ?? "0");
          } else {
            balance = "";
          }
        } else {
          balance = "";
        }
      } else {
        balance = (dataWallet?.[0]?.raw_amount ?? "0").toString();
      }
    }
  }

  return (
    <SlideUpWrapper
      layout="position"
      layoutId={`motion:market:amount-selector:${userType}`}
      delay={delay ?? 0}
    >
      {/**
       * Balance indicator based on the funding type: wallet or vault
       */}
      <FormInputLabel
        size="sm"
        label={userType === MarketUserType.ip.id ? "Desired Result" : "Amount"}
      >
        {userType === MarketUserType.ap.id && (
          <TertiaryLabel>
            Balance:{" "}
            {isLoading ? (
              <LoadingSpinner className="ml-1 h-4 w-4" />
            ) : balance ? (
              <SpringNumber
                className="ml-1"
                defaultColor="text-tertiary"
                previousValue={parseRawAmountToTokenAmount(
                  balance,
                  currentMarketData?.input_token_data.decimals ?? 0
                )}
                currentValue={parseRawAmountToTokenAmount(
                  balance,
                  currentMarketData?.input_token_data.decimals ?? 0
                )}
                numberFormatOptions={{
                  style: "decimal",
                  notation: "standard",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 8,
                  useGrouping: true,
                }}
              />
            ) : (
              0
            )}
            <span className="ml-1">
              {currentMarketData?.input_token_data.symbol.toUpperCase()}
            </span>
          </TertiaryLabel>
        )}
      </FormInputLabel>

      {/**
       * Input amount selector
       */}
      <InputAmountSelector
        containerClassName="mt-2"
        currentValue={marketActionForm.watch("quantity.amount") ?? ""}
        setCurrentValue={(value) => {
          /**
           * Set the amount of the token
           */
          marketActionForm.setValue("quantity.amount", value);

          /**
           * Set the raw amount of the token
           */
          marketActionForm.setValue(
            "quantity.raw_amount",
            parseTokenAmountToRawAmount(
              value,
              currentMarketData?.input_token_data.decimals ?? 0
            )
          );
        }}
        Prefix={() => {
          /**
           * @note Below code is for the case where max value needs to be avaialble fill amount
           */
          // if (offerType === MarketOfferType.limit.id) return null;

          /**
           * @note Below code is for the case where max value needs to be avaialble fill amount
           */
          // if (
          //   marketMetadata.market_type === MarketType.vault.id &&
          //   userType === MarketUserType.ap.id &&
          //   offerType === MarketOfferType.limit.id
          // )
          //   return null;

          if (userType === MarketUserType.ip.id) {
            return null;
          }

          return (
            <div
              onClick={() => {
                /**
                 * @note This is the code to set max amount to fillable amount
                 */
                // const quantityRawValue =
                //   userType === MarketUserType.ip.id
                //     ? currentMarketData?.quantity_ap
                //     : currentMarketData?.quantity_ip;
                // const quantityTokenValue = parseRawAmountToTokenAmount(
                //   quantityRawValue,
                //   currentMarketData?.input_token_data.decimals ?? 0
                // );

                const quantityRawValue = parseRawAmount(
                  (dataWallet?.[0]?.raw_amount ?? "0").toString()
                );

                const quantityTokenValue = parseRawAmountToTokenAmount(
                  quantityRawValue,
                  currentMarketData?.input_token_data.decimals ?? 0
                );

                marketActionForm.setValue(
                  "quantity.amount",
                  quantityTokenValue.toString()
                );

                marketActionForm.setValue(
                  "quantity.raw_amount",
                  quantityRawValue ?? "0"
                );
              }}
              className="flex cursor-pointer items-center justify-center text-xs font-300 text-secondary underline decoration-tertiary decoration-dotted underline-offset-[3px] transition-all duration-200 ease-in-out hover:opacity-80"
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
       * Indicator to show remaining balance to fill
       */}
      {offerType === MarketOfferType.market.id &&
      (marketMetadata.market_type === MarketType.recipe.id ||
        userType === MarketUserType.ip.id) ? (
        <TertiaryLabel className="mt-2 flex flex-row items-center justify-between">
          <div>
            {userType === MarketUserType.ap.id
              ? Intl.NumberFormat("en-US", {
                  notation: "standard",
                  useGrouping: true,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 8,
                }).format(
                  parseRawAmountToTokenAmount(
                    currentMarketData?.quantity_ip ?? "0", // @note: AP fills IP quantity
                    currentMarketData?.input_token_data.decimals ?? 0
                  )
                )
              : Intl.NumberFormat("en-US", {
                  notation: "standard",
                  useGrouping: true,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 8,
                }).format(
                  parseRawAmountToTokenAmount(
                    currentMarketData?.quantity_ap ?? "0", // @note: IP fills AP quantity
                    currentMarketData?.input_token_data.decimals ?? 0
                  )
                )}{" "}
            {currentMarketData?.input_token_data.symbol.toUpperCase()} Fillable
            in Total
          </div>
        </TertiaryLabel>
      ) : null}

      {/**
       * Insufficient balance indicator
       */}
      {isSolidityAddressValid("address", address) &&
        offerType === MarketOfferType.market.id &&
        !isLoading &&
        userType === RoycoMarketUserType.ap.id &&
        (fundingType === RoycoMarketFundingType.wallet.id ||
          (fundingType === RoycoMarketFundingType.vault.id &&
            isSolidityAddressValid(
              "address",
              marketActionForm.watch("funding_vault")
            ))) &&
        balance !== "" &&
        BigNumber.from(
          parseRawAmount(marketActionForm.watch("quantity.raw_amount"))
        ).gt(BigNumber.from(parseRawAmount(balance))) && (
          <SlideUpWrapper
            layout="position"
            layoutId={`motion:market:warning-alert:${fundingType}`}
            className="mt-3"
            delay={0.4}
          >
            <WarningAlert>
              WARNING: You don't have sufficient balance.
            </WarningAlert>
          </SlideUpWrapper>
        )}
    </SlideUpWrapper>
  );
});
