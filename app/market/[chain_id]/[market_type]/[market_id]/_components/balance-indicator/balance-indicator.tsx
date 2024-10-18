"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useEnrichedAccountBalanceRecipe } from "@/sdk/hooks";
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
import { MarketIncentiveType, useMarketManager } from "@/store";
import { HorizontalTabs, SpringNumber } from "@/components/composables";
import {
  AlertIndicator,
  InfoCard,
  InfoTip,
  TokenDisplayer,
} from "@/components/common";
import { BigNumber } from "ethers";

export const BalanceIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address, isConnected } = useAccount();

  const { marketMetadata } = useActiveMarket();
  const { balanceIncentiveType, setBalanceIncentiveType } = useMarketManager();

  const { isLoading, isRefetching, data } = useEnrichedAccountBalanceRecipe({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    account_address: address ? address.toLowerCase() : "",
  });

  const [placeholderData, setPlaceholderData] = React.useState<
    Array<typeof data>
  >([undefined, undefined]);

  useEffect(() => {
    if (
      isLoading === false &&
      isRefetching === false &&
      !isEqual(data, placeholderData[1])
    ) {
      setPlaceholderData((prevDatas) => {
        return produce(prevDatas, (draft) => {
          if (!isEqual(draft[1], data)) {
            draft[0] = draft[1] as typeof data;
            draft[1] = data as typeof data;
          }
        });
      });
    }
  }, [isLoading, isRefetching, data]);

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

      <HorizontalTabs
        className={cn(BASE_MARGIN_TOP.MD)}
        size="sm"
        key="market:balance-incentive-type:container"
        baseId="market:balance-incentive-type"
        tabs={[
          {
            label: "Received",
            id: MarketIncentiveType.ap.id,
          },
          {
            label: "Given",
            id: MarketIncentiveType.ip.id,
          },
        ]}
        activeTab={balanceIncentiveType}
        setter={setBalanceIncentiveType}
      />

      {!!data && (
        <PrimaryLabel className={cn("text-3xl font-light", BASE_MARGIN_TOP.XL)}>
          <SpringNumber
            previousValue={
              placeholderData[0]
                ? balanceIncentiveType === MarketIncentiveType.ap.id
                  ? placeholderData[0].ap_balance_usd
                  : placeholderData[0].ip_balance_usd
                : 0
            }
            currentValue={
              placeholderData[1]
                ? balanceIncentiveType === MarketIncentiveType.ap.id
                  ? placeholderData[1].ap_balance_usd
                  : placeholderData[1].ip_balance_usd
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
        isLoading === false &&
        (data === undefined || data === null) && (
          <AlertIndicator className="pb-2 pt-7">
            No activity found
          </AlertIndicator>
        )}

      {!!data && (
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
                    ? data.input_token_data.quantity_received_amount_token
                    : data.input_token_data.quantity_given_amount_token
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
                tokens={[data.input_token_data]}
                symbols={true}
              />
              <TokenDisplayer
                className="ml-2"
                size={4}
                hover
                bounce
                tokens={[data.input_token_data]}
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
              {data[
                balanceIncentiveType === MarketIncentiveType.ap.id
                  ? "incentives_received_data"
                  : "incentives_given_data"
              ].length === 0 ? (
                <InfoCard.Row.Value className="flex w-full flex-row place-content-end items-end gap-0">
                  0.00
                </InfoCard.Row.Value>
              ) : null}

              {data[
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
