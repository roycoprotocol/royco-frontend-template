import React from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { FormField, FormItem } from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { MarketFormSchema } from "../market-form-schema";
import {
  MarketActionType,
  MarketOfferType,
  MarketType,
  MarketUserType,
  useMarketManager,
} from "@/store";
import { TokenDisplayer } from "@/components/common";
import { useActiveMarket } from "../../hooks";
import { FormInputLabel, TertiaryLabel } from "../../composables";
import { useAccount } from "wagmi";
import {
  isSolidityIntValid,
  parseFormattedValueToText,
  parseRawAmountToTokenAmount,
  parseTextToFormattedValue,
  parseTokenAmountToRawAmount,
} from "@/sdk/utils";
import { useAccountBalance } from "@/sdk/hooks";
import { LoadingSpinner, SpringNumber } from "@/components/composables";
import { BigNumber, ethers } from "ethers";
import { RoycoMarketType, RoycoMarketUserType } from "@/sdk/market";

export const FormOfferAmount = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketForm: UseFormReturn<z.infer<typeof MarketFormSchema>>;
  }
>(({ className, marketForm, ...props }, ref) => {
  const { address, isConnected } = useAccount();

  const { marketMetadata, currentMarketData } = useActiveMarket();
  const { userType } = useMarketManager();

  const { isLoading, data } = useAccountBalance({
    chain_id: marketMetadata.chain_id,
    account: address || "",
    tokens: currentMarketData
      ? [currentMarketData.input_token_data.contract_address]
      : [],
  });

  if (!!currentMarketData) {
    return (
      <FormField
        control={marketForm.control}
        name="offer_amount"
        render={({ field }) => (
          <FormItem className={cn("flex flex-col", className)}>
            <FormInputLabel
              size="sm"
              label="Amount"
              // info="The amount you want to supply or withdraw"
            >
              <TertiaryLabel>
                Balance:{" "}
                {isLoading ? (
                  <LoadingSpinner className="ml-1 h-4 w-4" />
                ) : data && data[0] !== undefined && data[0].token_amount ? (
                  <SpringNumber
                    className="ml-1"
                    defaultColor="text-tertiary"
                    previousValue={data[0].token_amount}
                    currentValue={data[0].token_amount}
                    numberFormatOptions={{
                      style: "decimal",
                      notation: "compact",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      useGrouping: true,
                    }}
                  />
                ) : (
                  0
                )}
                <span className="ml-1">
                  {!isLoading &&
                    currentMarketData.input_token_data.symbol.toUpperCase()}
                </span>
              </TertiaryLabel>
            </FormInputLabel>

            <Input
              type="text"
              containerClassName="h-9 text-sm mt-1"
              className=""
              placeholder="Enter Amount"
              value={parseTextToFormattedValue(
                marketForm.watch("offer_amount")
              )}
              Prefix={() => {
                if (
                  marketForm.watch("offer_type") ===
                    MarketOfferType.market.id &&
                  (marketMetadata.market_type === RoycoMarketType.recipe.id ||
                    userType === RoycoMarketUserType.ip.id)
                ) {
                  return (
                    <div
                      onClick={() => {
                        const quantityRawValue =
                          userType === MarketUserType.ap.id
                            ? currentMarketData.quantity_ap
                            : currentMarketData.quantity_ip;
                        const quantityTokenValue = parseRawAmountToTokenAmount(
                          quantityRawValue,
                          currentMarketData.input_token_data.decimals
                        );

                        marketForm.setValue(
                          "offer_amount",
                          quantityTokenValue.toString()
                        );

                        marketForm.setValue(
                          "offer_raw_amount",
                          quantityRawValue ?? "0"
                        );
                      }}
                      className="flex cursor-pointer items-center justify-center text-xs font-300 text-secondary underline decoration-tertiary decoration-dotted underline-offset-[3px] transition-opacity duration-200 ease-in-out hover:opacity-80"
                    >
                      Max
                    </div>
                  );
                }
              }}
              onChange={(e) => {
                field.onChange(parseFormattedValueToText(e.target.value));
                marketForm.setValue(
                  "offer_raw_amount",
                  parseTokenAmountToRawAmount(
                    e.target.value,
                    currentMarketData?.input_token_data.decimals ?? 0
                  )
                );
              }}
              min="0"
              Suffix={() => {
                return (
                  <TokenDisplayer
                    size={4}
                    tokens={[currentMarketData.input_token_data]}
                    symbols={true}
                  />
                );
              }}
            />

            {marketForm.watch("offer_type") === MarketOfferType.market.id &&
            (marketMetadata.market_type === RoycoMarketType.recipe.id ||
              userType === RoycoMarketUserType.ip.id) ? (
              <TertiaryLabel className="mt-2 flex flex-row items-center justify-between">
                <div>
                  {userType === MarketUserType.ap.id
                    ? Intl.NumberFormat("en-US", {
                        notation: "compact",
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        parseRawAmountToTokenAmount(
                          currentMarketData.quantity_ip, // @note: AP fills IP quantity
                          currentMarketData.input_token_data.decimals
                        )
                      )
                    : Intl.NumberFormat("en-US", {
                        notation: "compact",
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        parseRawAmountToTokenAmount(
                          currentMarketData.quantity_ap, // @note: IP fills AP quantity
                          currentMarketData.input_token_data.decimals
                        )
                      )}{" "}
                  {currentMarketData.input_token_data.symbol} Remaining
                </div>
              </TertiaryLabel>
            ) : null}
          </FormItem>
        )}
      />
    );
  }
});
