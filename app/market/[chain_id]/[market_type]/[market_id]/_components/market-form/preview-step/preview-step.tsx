import { cn } from "@/lib/utils";
import React, { Fragment, useState } from "react";
import {
  BASE_LABEL_BORDER,
  BASE_MARGIN_TOP,
  SecondaryLabel,
  TertiaryLabel,
} from "../../composables";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MarketFormSchema } from "../market-form-schema";
import { useMarketAction } from "@/sdk/hooks";
import { LoadingSpinner } from "@/components/composables";
import { TransactionOptionsType } from "@/sdk/types";
import { useAccount } from "wagmi";
import { useActiveMarket } from "../../hooks";
import { AlertIndicator, TokenDisplayer } from "@/components/common";
import {
  MarketOfferType,
  MarketSteps,
  MarketType,
  MarketUserType,
  useMarketManager,
} from "@/store";
import { TransactionRow } from "@/components/composables/transaction-modal/transaction-row";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const PreviewStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    marketForm: UseFormReturn<z.infer<typeof MarketFormSchema>>;
  }
>(({ className, marketForm, ...props }, ref) => {
  const [currentTransactions, setCurrentTransactions] = useState<
    Array<TransactionOptionsType>
  >([]);

  const { address, isConnected } = useAccount();
  const { currentMarketData, marketMetadata, propsEnrichedMarket } =
    useActiveMarket();

  const { userType, marketStep } = useMarketManager();

  const {
    isLoading,
    isValid,
    isValidMessage,
    isReady,
    writeContractOptions,
    canBePerformedCompletely,
    canBePerformedPartially,
    simulationData,
    incentivesData,
    // incentivesInfo: incentivesInfoCreateOfferRecipe,
  } = useMarketAction({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    market_type: marketMetadata.market_type,
    funding_vault: marketForm.watch("funding_vault").address,
    quantity: marketForm.watch("offer_raw_amount"),
    expiry:
      marketForm.watch("no_expiry") === true
        ? "0"
        : !marketForm.watch("expiry")
          ? undefined
          : Math.floor(
              (marketForm.watch("expiry") ?? new Date()).getTime() / 1000
            ).toString(),

    // Incentive Token IDs
    incentive_token_ids: marketForm
      .watch("incentive_tokens")
      .map((token) => token.id),

    // Incentive Token Amounts
    incentive_token_amounts: marketForm
      .watch("incentive_tokens")
      .map((token) => token.raw_amount ?? "0"),

    // Incentive Rates
    incentive_rates: marketForm
      .watch("incentive_tokens")
      .map((token) => token.rate ?? "0"),

    // Incentive Start timestamps
    incentive_start_timestamps: marketForm
      .watch("incentive_tokens")
      .map((token) =>
        Math.floor(
          (token.start_timestamp ?? new Date()).getTime() / 1000
        ).toString()
      ),

    // Incentive End timestamps
    incentive_end_timestamps: marketForm
      .watch("incentive_tokens")
      .map((token) =>
        Math.floor(
          (token.end_timestamp ?? new Date()).getTime() / 1000
        ).toString()
      ),

    user_type: userType,
    offer_type: marketForm.watch("offer_type"),
    account: address,
    frontendFeeRecipient: process.env.NEXT_PUBLIC_FRONTEND_FEE_RECIPIENT || "",
    enabled: marketStep !== MarketSteps.params.id,
    simulation_url: process.env.NEXT_PUBLIC_SIMULATION_URL || "",
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col place-content-center items-center">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  } else if (canBePerformedPartially === false) {
    return (
      <div className="flex h-12 w-full grow flex-col place-content-center items-center">
        <AlertIndicator>Offer cannot be fulfilled</AlertIndicator>
      </div>
    );
  } else if (!!propsEnrichedMarket.data) {
    return (
      <div
        className={cn("max-h-[40rem] grow overflow-y-scroll", className)}
        {...props}
      >
        {/* <SecondaryLabel className={cn(BASE_LABEL_BORDER)}>
          Simulation
        </SecondaryLabel>
        <div
          className={cn(
            BASE_MARGIN_TOP.SM,
            "flex h-28 w-full flex-col place-content-center items-center bg-z2"
          )}
        ></div> */}

        <SecondaryLabel className={cn(BASE_LABEL_BORDER, "font-normal")}>
          Tenderly Simulation
        </SecondaryLabel>

        <ScrollArea
          className={cn(BASE_MARGIN_TOP.SM, "flex h-fit w-full flex-row gap-2")}
        >
          <div className="flex h-fit w-full flex-row gap-2">
            {!!simulationData &&
              simulationData.map((tokenData, txIndex) => {
                const key = `simulation-data:${tokenData.id}:${txIndex}`;

                return (
                  <div
                    key={key}
                    className={cn(
                      "flex h-fit w-[49%] shrink-0 flex-col rounded-xl bg-z2 p-3"
                    )}
                  >
                    <TokenDisplayer symbols={false} tokens={[tokenData]} />
                    <SecondaryLabel className="mt-2 font-normal text-black">
                      {`${tokenData.type === "in" ? "+" : "-"}${Intl.NumberFormat(
                        "en-US",
                        {
                          style: "decimal",
                          notation: "compact",
                          useGrouping: true,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      ).format(
                        tokenData.token_amount
                      )} ${tokenData.symbol.toUpperCase()}`}
                    </SecondaryLabel>

                    <TertiaryLabel className="text-xs">
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact",
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(tokenData.token_amount_usd)}
                    </TertiaryLabel>
                  </div>
                );
              })}

            {!!simulationData && simulationData.length === 0 && (
              <AlertIndicator className="">
                No asset changes detected
              </AlertIndicator>
            )}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <SecondaryLabel className={cn(BASE_MARGIN_TOP.LG, BASE_LABEL_BORDER)}>
          Incentives{" "}
          {userType === MarketUserType.ap.id
            ? marketForm.watch("offer_type") === MarketOfferType.market.id
              ? "Received"
              : "Asked"
            : marketForm.watch("offer_type") === MarketOfferType.market.id
              ? "Given"
              : "Offered"}
        </SecondaryLabel>

        {/**
         * Incentive Table
         */}
        <div className="flex h-fit shrink-0 flex-col">
          {!!incentivesData &&
            incentivesData.map((incentive, index) => {
              const key = `incentive-data:${incentive.id}:${index}`;

              return (
                <div
                  key={key}
                  className={cn(
                    "flex h-fit w-full flex-row place-content-center items-center justify-between border-b border-divider py-3"
                  )}
                >
                  <TokenDisplayer symbols={true} tokens={[incentive]} />

                  <div className="flex w-fit flex-col items-end text-right">
                    <SecondaryLabel className="font-light text-black">
                      +
                      {Intl.NumberFormat("en-US", {
                        style:
                          marketMetadata.market_type === MarketType.vault.id &&
                          userType === MarketUserType.ip.id &&
                          marketForm.watch("offer_type") ===
                            MarketOfferType.limit.id
                            ? "decimal"
                            : "percent",
                        notation: "compact",
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        marketMetadata.market_type === MarketType.vault.id &&
                          userType === MarketUserType.ip.id &&
                          marketForm.watch("offer_type") ===
                            MarketOfferType.limit.id
                          ? incentive.token_amount
                          : incentive.annual_change_ratio / 100
                      )}
                    </SecondaryLabel>

                    {marketMetadata.market_type === MarketType.vault.id &&
                    userType === MarketUserType.ip.id &&
                    marketForm.watch("offer_type") ===
                      MarketOfferType.limit.id ? (
                      <TertiaryLabel>
                        (
                        {Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          notation: "compact",
                          useGrouping: true,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(incentive.token_amount_usd)}
                        )
                      </TertiaryLabel>
                    ) : (
                      <TertiaryLabel>
                        (
                        {Intl.NumberFormat("en-US", {
                          style: "decimal",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(incentive.per_input_token)}{" "}
                        {incentive.symbol.toUpperCase()} / 1{" "}
                        {currentMarketData?.input_token_data.symbol.toUpperCase()}
                        )
                      </TertiaryLabel>
                    )}
                  </div>
                </div>
              );
            })}

          {/**
           * Indicator for empty incentives
           */}
          {incentivesData.length === 0 && (
            <AlertIndicator className="border-b border-divider">
              No incentives available
            </AlertIndicator>
          )}

          {/**
           * Net/Total Indicator
           */}
          {!!incentivesData && (
            <div className="flex w-full flex-row items-center justify-between py-3">
              <SecondaryLabel className="text-success">
                {`${userType === MarketUserType.ap.id ? "Net AIP" : "Net Incentives"}`}
              </SecondaryLabel>

              <div className="flex w-fit flex-col items-end text-right">
                <SecondaryLabel className="text-black">
                  +
                  {marketMetadata.market_type === MarketType.vault.id &&
                  userType === MarketUserType.ip.id &&
                  marketForm.watch("offer_type") === MarketOfferType.limit.id
                    ? Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact",
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        incentivesData.reduce(
                          (acc, incentive) => acc + incentive.token_amount_usd,
                          0
                        )
                      )
                    : Intl.NumberFormat("en-US", {
                        style: "decimal",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        incentivesData.reduce(
                          (acc, incentive) =>
                            acc + incentive.annual_change_ratio,
                          0
                        )
                      )}
                </SecondaryLabel>
                <TertiaryLabel>Estimated (May Change)</TertiaryLabel>
              </div>
            </div>
          )}
        </div>

        <SecondaryLabel className={cn(BASE_MARGIN_TOP.MD, BASE_LABEL_BORDER)}>
          Transactions
        </SecondaryLabel>
        <div className={cn(BASE_MARGIN_TOP.SM, "flex flex-col gap-2")}>
          {!!writeContractOptions &&
            writeContractOptions.map((txOptions, txIndex) => {
              if (!!txOptions) {
                return (
                  <TransactionRow
                    transactionIndex={txIndex + 1}
                    transaction={txOptions}
                    txStatus={"idle"}
                  />
                );
              }
            })}
        </div>
      </div>
    );
  }
});
