"use client";

import React, { Fragment, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { AlertIndicator, InfoCard, TokenDisplayer } from "@/components/common";
import {
  INFO_ROW_CLASSES,
  PrimaryLabel,
  TertiaryLabel,
} from "../../composables";
import { SlideUpWrapper } from "@/components/animations";
import { useAtomValue } from "jotai";
import {
  loadableSpecificRecipePositionAtom,
  loadableSpecificVaultPositionAtom,
  loadableEnrichedMarketAtom,
  loadableSpecificBoycoPositionAtom,
} from "@/store/market";
import NumberFlow from "@number-flow/react";

export const BalanceIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isConnected } = useAccount();

  const { data: enrichedMarket } = useAtomValue(loadableEnrichedMarketAtom);
  const { data: specificRecipePosition, isLoading: isLoadingRecipePosition } =
    useAtomValue(loadableSpecificRecipePositionAtom);
  const { data: specificVaultPosition, isLoading: isLoadingVaultPosition } =
    useAtomValue(loadableSpecificVaultPositionAtom);
  const { data: specificBoycoPosition, isLoading: isLoadingBoycoPosition } =
    useAtomValue(loadableSpecificBoycoPositionAtom);

  const isLoading = useMemo(
    () => isLoadingRecipePosition || isLoadingVaultPosition,
    [isLoadingRecipePosition, isLoadingVaultPosition]
  );

  const totalBalance = useMemo(() => {
    if (!!enrichedMarket) {
      if (enrichedMarket.marketType === 0) {
        if (enrichedMarket.category === "boyco") {
          return specificBoycoPosition?.balanceUsd ?? 0;
        } else {
          return specificRecipePosition?.balanceUsd ?? 0;
        }
      } else if (enrichedMarket.marketType === 1) {
        return specificVaultPosition?.balanceUsd ?? 0;
      }
    }

    return 0;
  }, [enrichedMarket, specificRecipePosition, specificVaultPosition]);

  const inputTokenData = useMemo(() => {
    if (!!enrichedMarket) {
      if (enrichedMarket.marketType === 0) {
        return specificRecipePosition?.inputToken ?? null;
      } else if (enrichedMarket.marketType === 1) {
        return specificVaultPosition?.inputToken ?? null;
      }
    }

    return null;
  }, [enrichedMarket, specificRecipePosition, specificVaultPosition]);

  const incentivesTokenData = useMemo(() => {
    if (!!enrichedMarket) {
      if (enrichedMarket.marketType === 0) {
        if (enrichedMarket.category === "boyco") {
          return specificBoycoPosition?.incentiveTokens ?? [];
        } else {
          return specificRecipePosition?.incentiveTokens ?? [];
        }
      } else if (enrichedMarket.marketType === 1) {
        return specificVaultPosition?.incentiveTokens ?? [];
      }
    }

    return [];
  }, [enrichedMarket, specificRecipePosition, specificVaultPosition]);

  if (!enrichedMarket) return null;

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

  if (
    isConnected &&
    !isLoading &&
    !specificRecipePosition &&
    !specificVaultPosition &&
    !specificBoycoPosition
  ) {
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
          {enrichedMarket?.category === "boyco"
            ? "Receipt Token Balance"
            : "Your Balance"}
        </TertiaryLabel>
        <PrimaryLabel className="mt-1 text-2xl font-medium">
          <NumberFlow
            value={totalBalance}
            format={{
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

        {enrichedMarket.category === "boyco" &&
        specificBoycoPosition?.receiptTokensBreakdown
          ? specificBoycoPosition.receiptTokensBreakdown.map((token) => (
              <InfoCard key={token.id}>
                <SlideUpWrapper delay={0.1}>
                  <InfoCard.Row className={INFO_ROW_CLASSES}>
                    <InfoCard.Row.Key>
                      <TokenDisplayer
                        tokens={[token]}
                        imageClassName="hidden"
                        symbols={true}
                        symbolClassName="text-sm font-medium"
                      />
                    </InfoCard.Row.Key>

                    <InfoCard.Row.Value className="gap-0">
                      <NumberFlow
                        className="text-sm font-medium"
                        value={token.tokenAmount}
                        format={{
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
            ))
          : null}

        {enrichedMarket.category !== "boyco" && inputTokenData && (
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
                  <NumberFlow
                    className="text-sm font-medium"
                    value={inputTokenData?.tokenAmount}
                    format={{
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
        )}
      </div>

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
                        <NumberFlow
                          className="text-sm font-medium"
                          value={incentive.tokenAmount}
                          format={{
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
    </div>
  );
});
