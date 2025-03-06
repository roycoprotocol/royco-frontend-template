"use client";

import React, { Fragment, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  useEnrichedAccountBalancesRecipeInMarket,
  useEnrichedAccountBalancesVaultInMarket,
} from "royco/hooks";
import { useAccount } from "wagmi";
import { isEqual, set } from "lodash";
import { produce } from "immer";
import { MarketType, MarketUserType, useMarketManager } from "@/store";
import { SpringNumber } from "@/components/composables";
import { AlertIndicator, InfoCard, TokenDisplayer } from "@/components/common";
import { useActiveMarket } from "../../hooks";
import {
  INFO_ROW_CLASSES,
  PrimaryLabel,
  TertiaryLabel,
} from "../../composables";
import { SlideUpWrapper } from "@/components/animations";

export const BalanceIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { address, isConnected } = useAccount();

  const { marketMetadata, currentMarketData } = useActiveMarket();
  const { userType } = useMarketManager();

  /**
   * Recipe balances for AP & IP
   */
  const {
    isLoading: isLoadingRecipe,
    isRefetching: isRefetchingRecipe,
    data: dataRecipe,
  } = useEnrichedAccountBalancesRecipeInMarket({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    account_address: address ? address.toLowerCase() : "",
    custom_token_data: undefined,
  });

  /**
   * Vault balances for IP
   */
  const {
    isLoading: isLoadingVault,
    isRefetching: isRefetchingVault,
    data: dataVault,
  } = useEnrichedAccountBalancesVaultInMarket({
    chain_id: marketMetadata.chain_id,
    market_id: marketMetadata.market_id,
    account_address: address ? address.toLowerCase() : "",
    custom_token_data: undefined,
  });

  /**
   * Placeholder data
   */
  const [placeholderData, setPlaceholderData] = React.useState<
    Array<typeof dataRecipe | typeof dataVault | undefined>
  >([undefined, undefined]);

  /**
   * @effect Update placeholder data for recipe
   */
  useEffect(() => {
    if (
      marketMetadata.market_type === MarketType.recipe.id &&
      isLoadingRecipe === false &&
      isRefetchingRecipe === false &&
      !isEqual(dataRecipe, placeholderData[1])
    ) {
      setPlaceholderData((prevDatas) => {
        return produce(prevDatas, (draft) => {
          if (!isEqual(draft[1], dataRecipe)) {
            draft[0] = draft[1] as typeof dataRecipe;
            draft[1] = dataRecipe as typeof dataRecipe;
          }
        });
      });
    }
  }, [isLoadingRecipe, isRefetchingRecipe, dataRecipe]);

  /**
   * @effect Update placeholder data for vault
   */
  useEffect(() => {
    if (
      marketMetadata.market_type === MarketType.vault.id &&
      isLoadingVault === false &&
      isRefetchingVault === false &&
      !isEqual(dataVault, placeholderData[1])
    ) {
      setPlaceholderData((prevDatas) => {
        return produce(prevDatas, (draft) => {
          if (!isEqual(draft[1], dataVault)) {
            draft[0] = draft[1] as typeof dataVault;
            draft[1] = dataVault as typeof dataVault;
          }
        });
      });
    }
  }, [isLoadingVault, isRefetchingVault, dataVault]);

  const isLoading = useMemo(
    () => isLoadingRecipe || isLoadingVault,
    [isLoadingRecipe, isLoadingVault]
  );

  const totalBalance = useMemo(() => {
    let previousValue = 0;
    if (placeholderData[0]) {
      if (userType === MarketUserType.ap.id) {
        previousValue = placeholderData[0].balance_usd_ap;
      } else {
        previousValue = placeholderData[0].balance_usd_ip;
      }
    }

    let currentValue = 0;
    if (placeholderData[1]) {
      if (userType === MarketUserType.ap.id) {
        currentValue = placeholderData[1].balance_usd_ap;
      } else {
        currentValue = placeholderData[1].balance_usd_ip;
      }
    }

    return [previousValue, currentValue];
  }, [userType, placeholderData]);

  const inputTokenData = useMemo(() => {
    if (userType === MarketUserType.ap.id) {
      return placeholderData[1]?.input_token_data_ap;
    }

    if (userType === MarketUserType.ip.id) {
      return placeholderData[1]?.input_token_data_ip;
    }
  }, [userType, placeholderData]);

  const incentivesTokenData = useMemo(() => {
    if (userType === MarketUserType.ap.id) {
      return placeholderData[1]?.incentives_ap_data;
    }

    if (userType === MarketUserType.ip.id) {
      return placeholderData[1]?.incentives_ip_data;
    }
  }, [userType, placeholderData]);

  if (!currentMarketData) return null;

  if (!isConnected) {
    return (
      <div
        ref={ref}
        className={cn("rounded-lg border px-4 py-3", className)}
        {...props}
      >
        {/**
         * Wallet not connected
         */}
        <AlertIndicator className="pb-2 pt-7">
          Wallet not connected
        </AlertIndicator>
      </div>
    );
  }

  if (isConnected && !isLoading && !placeholderData[1]) {
    return (
      <div
        ref={ref}
        className={cn("rounded-lg border px-4 py-3", className)}
        {...props}
      >
        {/**
         * No activity found
         */}
        <AlertIndicator className="pb-2 pt-7">No activity found</AlertIndicator>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("rounded-lg border px-4 py-3", className)}
      {...props}
    >
      {/**
       * Total Balance
       */}
      <div>
        <TertiaryLabel className="text-sm">
          {currentMarketData?.category === "boyco"
            ? "Balance Supplied"
            : "Your Balance"}
        </TertiaryLabel>
        <PrimaryLabel className="mt-1 text-2xl font-medium">
          <SpringNumber
            previousValue={totalBalance[0]}
            currentValue={totalBalance[1]}
            numberFormatOptions={{
              style: "currency",
              currency: "USD",
              notation: "standard",
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            }}
          />
        </PrimaryLabel>
      </div>

      {/**
       * Input Token
       */}
      <div className={cn("mt-5")}>
        <TertiaryLabel className="mb-3 text-sm">Tokens Supplied</TertiaryLabel>

        {inputTokenData ? (
          <InfoCard>
            <SlideUpWrapper delay={0.1}>
              <InfoCard.Row className={INFO_ROW_CLASSES}>
                <InfoCard.Row.Key>
                  <TokenDisplayer
                    tokens={inputTokenData ? ([inputTokenData] as any) : []}
                    symbols={true}
                    symbolClassName="text-sm font-medium"
                  />
                </InfoCard.Row.Key>

                <InfoCard.Row.Value className="gap-0">
                  <SpringNumber
                    className="text-sm font-medium"
                    previousValue={0}
                    currentValue={inputTokenData?.token_amount ?? 0}
                    numberFormatOptions={{
                      style: "decimal",
                      notation: "standard",
                      useGrouping: true,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8,
                    }}
                  />
                </InfoCard.Row.Value>
              </InfoCard.Row>
            </SlideUpWrapper>
          </InfoCard>
        ) : (
          <span>--</span>
        )}
      </div>

      {currentMarketData?.category !== "boyco" && (
        <Fragment>
          <hr className="my-3" />
          {/**
           * Incentives Tokens
           */}
          <div>
            <TertiaryLabel className="mb-3 text-sm">
              Incentives Accumulated
            </TertiaryLabel>

            {incentivesTokenData && incentivesTokenData.length > 0 ? (
              <InfoCard className="flex flex-col gap-2">
                {incentivesTokenData.map((incentive, index) => {
                  return (
                    <SlideUpWrapper delay={0.1 + index * 0.1}>
                      <InfoCard.Row className={cn(INFO_ROW_CLASSES)}>
                        <InfoCard.Row.Key>
                          <TokenDisplayer
                            tokens={[incentive] as any}
                            symbols={true}
                            symbolClassName="text-sm font-medium"
                          />
                        </InfoCard.Row.Key>

                        <InfoCard.Row.Value className="gap-0">
                          <SpringNumber
                            className="text-sm font-medium"
                            previousValue={0}
                            currentValue={incentive.token_amount ?? 0}
                            numberFormatOptions={{
                              style: "decimal",
                              notation: "standard",
                              useGrouping: true,
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 8,
                            }}
                          />
                        </InfoCard.Row.Value>
                      </InfoCard.Row>
                    </SlideUpWrapper>
                  );
                })}
              </InfoCard>
            ) : (
              <span>--</span>
            )}
          </div>{" "}
        </Fragment>
      )}
    </div>
  );
});
