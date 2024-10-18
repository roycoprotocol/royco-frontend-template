import React from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { FormField, FormItem } from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { MarketFormSchema } from ".././market-form-schema";
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
import { isSolidityIntValid } from "@/sdk/utils";
import { useAccountBalance } from "@/sdk/hooks";
import { LoadingSpinner, SpringNumber } from "@/components/composables";
import { BigNumber, ethers } from "ethers";

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
                      minimumFractionDigits: 0,
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
              type="number"
              step="any"
              containerClassName="h-9 text-sm mt-1"
              className=""
              placeholder="Enter Amount"
              value={marketForm.watch("offer_amount")}
              // {...field}
              Prefix={() => {
                if (
                  marketForm.watch("offer_type") === MarketOfferType.market.id
                ) {
                  return (
                    <div
                      onClick={() => {
                        // @todo Fix this

                        // const quantityRawValue =
                        //   userType === MarketUserType.ap.id
                        //     ? currentMarketData.input_token_data
                        //         .quantity_offered_token
                        //     : currentMarketData.input_token_data
                        //         .quantity_asked_token;

                        const quantityRawValue = "0";

                        const maxValue = quantityRawValue;

                        marketForm.setValue(
                          "offer_amount",
                          maxValue.toString()
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
                field.onChange(e);

                try {
                  const floatAmount = parseFloat(e.target.value);

                  const decimals = currentMarketData.input_token_data.decimals;

                  const rawAmount = ethers.utils
                    .parseUnits(floatAmount.toString(), decimals)
                    .toString();

                  if (isSolidityIntValid("uint256", rawAmount)) {
                    marketForm.setValue("offer_raw_amount", rawAmount);
                  }
                } catch (error) {
                  marketForm.setValue("offer_raw_amount", "");
                }
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

            {/**
             * @note Currently hidden
             * @todo Fix it
             */}
            {/* {marketForm.watch("offer_type") === MarketOfferType.market.id && (
              <TertiaryLabel className="mt-1 flex flex-row items-center justify-between">
                <div>
                  {userType === MarketUserType.ap.id
                    ? Intl.NumberFormat("en-US", {
                        useGrouping: true, // Ensures grouping with commas
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }).format(
                        currentMarketData.input_token_data
                          .quantity_offered_token
                      )
                    : Intl.NumberFormat("en-US", {
                        useGrouping: true, // Ensures grouping with commas
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }).format(
                        currentMarketData.input_token_data.quantity_asked_token
                      )}{" "}
                  {currentMarketData.input_token_data.symbol} Remaining
                </div>
              </TertiaryLabel>
            )} */}
          </FormItem>
        )}
      />
    );
  }
});
