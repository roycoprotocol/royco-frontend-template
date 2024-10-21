"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  useEnrichedAccountBalanceRecipe,
  useEnrichedAccountBalanceVault,
} from "@/sdk/hooks";
import { useActiveMarket } from "../hooks";
import { useAccount } from "wagmi";
import { isEqual, set } from "lodash";
import { produce } from "immer";
import {
  BASE_MARGIN_TOP,
  BASE_PADDING,
  BASE_PADDING_LEFT,
  BASE_PADDING_RIGHT,
  INFO_ROW_CLASSES,
  PrimaryLabel,
  TertiaryLabel,
} from "../composables";
import { MarketIncentiveType, MarketType, useMarketManager } from "@/store";
import { HorizontalTabs, SpringNumber } from "@/components/composables";
import {
  AlertIndicator,
  InfoCard,
  InfoTip,
  TokenDisplayer,
} from "@/components/common";
import { BigNumber } from "ethers";
import { EnrichedMarketDataType } from "@/sdk/queries";

export const BalanceIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address, isConnected } = useAccount();

  const { marketMetadata, currentMarketData } = useActiveMarket();
  const { balanceIncentiveType, setBalanceIncentiveType } = useMarketManager();

  const {
    isLoading: isLoadingRecipe,
    isRefetching,
    data: dataRecipe,
  } = useEnrichedAccountBalanceRecipe({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    account_address: address ? address.toLowerCase() : "",
  });

  const { isLoading: isLoadingVault, data: dataVault } =
    useEnrichedAccountBalanceVault({
      market: currentMarketData as EnrichedMarketDataType,
      account_address: address ? address.toLowerCase() : "",
    });

  const [placeholderDataRecipe, setPlaceholderDataRecipe] = React.useState<
    Array<typeof dataRecipe>
  >([undefined, undefined]);

  const [placeholderDataVault, setPlaceholderDataVault] = React.useState<
    Array<typeof dataVault | undefined>
  >([undefined, undefined]);

  /**
   * @effect Update placeholder data for recipe
   */
  useEffect(() => {
    if (
      isLoadingRecipe === false &&
      isRefetching === false &&
      !isEqual(dataRecipe, placeholderDataRecipe[1])
    ) {
      setPlaceholderDataRecipe((prevDatas) => {
        return produce(prevDatas, (draft) => {
          if (!isEqual(draft[1], dataRecipe)) {
            draft[0] = draft[1] as typeof dataRecipe;
            draft[1] = dataRecipe as typeof dataRecipe;
          }
        });
      });
    }
  }, [isLoadingRecipe, isRefetching, dataRecipe]);

  /**
   * @effect Update placeholder data for vault
   */
  useEffect(() => {
    if (
      isLoadingVault === false &&
      !isEqual(dataVault, placeholderDataVault[1])
    ) {
      setPlaceholderDataVault((prevDatas) => {
        return produce(prevDatas, (draft) => {
          if (!isEqual(draft[1], dataVault)) {
            draft[0] = draft[1] as typeof dataVault;
            draft[1] = dataVault as typeof dataVault;
          }
        });
      });
    }
  }, [isLoadingVault, dataVault]);

  if (!currentMarketData) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-fit w-full shrink-0 flex-col",
        BASE_PADDING,
        className
      )}
      {...props}
    >
      <TertiaryLabel>BALANCES</TertiaryLabel>

      {/**
       * Show distinction between AP and IP
       */}
      {marketMetadata.market_type === MarketType.recipe.id &&
        !!dataRecipe &&
        dataRecipe["incentives_given_data"].length === 0 && (
          <HorizontalTabs
            className={cn(BASE_MARGIN_TOP.MD)}
            size="sm"
            key="market:balance-incentive-type:container"
            baseId="market:balance-incentive-type"
            tabs={[
              {
                label: "AP",
                id: MarketIncentiveType.ap.id,
              },
              {
                label: "IP",
                id: MarketIncentiveType.ip.id,
              },
            ]}
            activeTab={balanceIncentiveType}
            setter={setBalanceIncentiveType}
          />
        )}

      {/**
       * Total balance for recipe
       */}
      {marketMetadata.market_type === MarketType.recipe.id && !!dataRecipe && (
        <PrimaryLabel className={cn("text-3xl font-light", BASE_MARGIN_TOP.XL)}>
          <SpringNumber
            previousValue={
              placeholderDataRecipe[0]
                ? balanceIncentiveType === MarketIncentiveType.ap.id
                  ? placeholderDataRecipe[0].ap_balance_usd
                  : placeholderDataRecipe[0].ip_balance_usd
                : 0
            }
            currentValue={
              placeholderDataRecipe[1]
                ? balanceIncentiveType === MarketIncentiveType.ap.id
                  ? placeholderDataRecipe[1].ap_balance_usd
                  : placeholderDataRecipe[1].ip_balance_usd
                : 0
            }
            numberFormatOptions={{
              style: "currency",
              currency: "USD",
              notation: "compact",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              // useGrouping: true,
            }}
          />
        </PrimaryLabel>
      )}

      {/**
       * Total balance for vault
       */}
      {marketMetadata.market_type === MarketType.vault.id && !!dataVault && (
        <PrimaryLabel className={cn("text-3xl font-light", BASE_MARGIN_TOP.XL)}>
          <SpringNumber
            previousValue={
              placeholderDataVault[0]
                ? placeholderDataVault[0].total_balance_usd
                : 0
            }
            currentValue={
              placeholderDataVault[1]
                ? placeholderDataVault[1].total_balance_usd
                : 0
            }
            numberFormatOptions={{
              style: "currency",
              currency: "USD",
              notation: "compact",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              // useGrouping: true,
            }}
          />
        </PrimaryLabel>
      )}

      {isConnected === false && (
        <AlertIndicator className="pb-2 pt-7">
          Wallet not connected
        </AlertIndicator>
      )}

      {isConnected === true &&
        isLoadingRecipe === false &&
        isLoadingVault === false &&
        marketMetadata.market_type === MarketType.recipe.id &&
        (dataRecipe === undefined || dataRecipe === null) && (
          <AlertIndicator className="pb-2 pt-7">
            No activity found
          </AlertIndicator>
        )}

      {/**
       * Show vault balance
       */}
      {marketMetadata.market_type === MarketType.vault.id && !!dataVault && (
        <InfoCard className={cn("flex flex-col gap-1", BASE_MARGIN_TOP.XL)}>
          {/**
           * @info Input Token
           */}
          <InfoCard.Row className={cn(INFO_ROW_CLASSES, "gap-0")}>
            <InfoCard.Row.Key>Deposits</InfoCard.Row.Key>

            <InfoCard.Row.Value className={cn(INFO_ROW_CLASSES, "gap-0")}>
              <SpringNumber
                className="h-4"
                spanClassName="leading-5"
                previousValue={0}
                currentValue={dataVault.deposit_token_data.token_amount_usd}
                numberFormatOptions={{
                  style: "decimal",
                  notation: "compact",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                }}
              />

              <TokenDisplayer
                imageClassName="hidden"
                size={4}
                hover
                bounce
                tokens={[dataVault.deposit_token_data]}
                symbols={true}
              />
              <TokenDisplayer
                className="ml-2"
                size={4}
                hover
                bounce
                tokens={[dataVault.deposit_token_data]}
                symbols={false}
              />
            </InfoCard.Row.Value>
          </InfoCard.Row>

          {/**
           * @info Incentives Received
           */}
          <InfoCard.Row className={cn(INFO_ROW_CLASSES)}>
            <InfoCard.Row.Key>Incentives</InfoCard.Row.Key>

            <InfoCard.Row.Value className="flex h-fit grow flex-col gap-1">
              {dataVault["incentive_token_data"].length === 0 ? (
                <InfoCard.Row.Value className="flex w-full flex-row place-content-end items-end gap-0">
                  0.00
                </InfoCard.Row.Value>
              ) : null}

              {dataVault["incentive_token_data"].map((incentive, index) => {
                const BASE_KEY = `market:balance-indicator:balance-incentice-type:${balanceIncentiveType}:incentive:${incentive.id}`;

                return (
                  <InfoCard.Row.Value
                    key={BASE_KEY}
                    className="flex w-full flex-row place-content-end items-end gap-1"
                  >
                    <SpringNumber
                      className="h-4"
                      spanClassName="leading-5"
                      previousValue={0}
                      currentValue={BigNumber.from(incentive.token_amount)}
                      numberFormatOptions={{
                        // style: "decimal",
                        notation: "compact",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        // useGrouping: true,
                      }}
                    />

                    <TokenDisplayer
                      imageClassName="hidden"
                      size={4}
                      hover
                      bounce
                      tokens={[incentive]}
                      symbols={true}
                    />
                    <TokenDisplayer
                      className="ml-2"
                      size={4}
                      hover
                      bounce
                      tokens={[incentive]}
                      symbols={false}
                    />
                  </InfoCard.Row.Value>
                );
              })}
            </InfoCard.Row.Value>
          </InfoCard.Row>
        </InfoCard>
      )}

      {/**
       * Show recipe balance
       */}
      {marketMetadata.market_type === MarketType.recipe.id && !!dataRecipe && (
        <InfoCard className={cn("flex flex-col gap-1", BASE_MARGIN_TOP.XL)}>
          {/**
           * @info Input Token
           */}
          <InfoCard.Row className={cn(INFO_ROW_CLASSES, "gap-0")}>
            <InfoCard.Row.Key>Input Token</InfoCard.Row.Key>
            <InfoCard.Row.Value className="gap-0">
              <SpringNumber
                className="h-4"
                spanClassName="leading-5"
                previousValue={0}
                currentValue={BigNumber.from(
                  balanceIncentiveType === MarketIncentiveType.ap.id
                    ? dataRecipe.input_token_data.quantity_received_amount_token
                    : dataRecipe.input_token_data.quantity_given_amount_token
                )}
                numberFormatOptions={{
                  style: "decimal",
                  notation: "compact",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                }}
              />

              <TokenDisplayer
                imageClassName="hidden"
                size={4}
                hover
                bounce
                tokens={[dataRecipe.input_token_data]}
                symbols={true}
              />
              <TokenDisplayer
                className="ml-2"
                size={4}
                hover
                bounce
                tokens={[dataRecipe.input_token_data]}
                symbols={false}
              />
            </InfoCard.Row.Value>
          </InfoCard.Row>

          {/**
           * @info Incentives Given/Received
           */}
          <InfoCard.Row className={cn(INFO_ROW_CLASSES)}>
            <InfoCard.Row.Key>Incentives</InfoCard.Row.Key>
            <InfoCard.Row.Value className="flex h-fit grow flex-col gap-1">
              {dataRecipe[
                balanceIncentiveType === MarketIncentiveType.ap.id
                  ? "incentives_received_data"
                  : "incentives_given_data"
              ].length === 0 ? (
                <InfoCard.Row.Value className="flex w-full flex-row place-content-end items-end gap-0">
                  0.00
                </InfoCard.Row.Value>
              ) : null}

              {dataRecipe[
                balanceIncentiveType === MarketIncentiveType.ap.id
                  ? "incentives_received_data"
                  : "incentives_given_data"
              ].map((incentive, index) => {
                const BASE_KEY = `market:balance-indicator:balance-incentice-type:${balanceIncentiveType}:incentive:${incentive.id}`;

                return (
                  <InfoCard.Row.Value
                    key={BASE_KEY}
                    className="flex w-full flex-row place-content-end items-end gap-1"
                  >
                    <SpringNumber
                      className="h-4"
                      spanClassName="leading-5"
                      previousValue={0}
                      currentValue={BigNumber.from(incentive.token_amount)}
                      numberFormatOptions={{
                        // style: "decimal",
                        notation: "compact",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        // useGrouping: true,
                      }}
                    />

                    <TokenDisplayer
                      imageClassName="hidden"
                      size={4}
                      hover
                      bounce
                      tokens={[incentive]}
                      symbols={true}
                    />
                    <TokenDisplayer
                      className="ml-2"
                      size={4}
                      hover
                      bounce
                      tokens={[incentive]}
                      symbols={false}
                    />
                  </InfoCard.Row.Value>
                );
              })}
            </InfoCard.Row.Value>
          </InfoCard.Row>
        </InfoCard>
      )}
    </div>
  );
});
