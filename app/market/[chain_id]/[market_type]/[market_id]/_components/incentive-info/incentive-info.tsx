import { cn } from "@/lib/utils";
import React, { Fragment } from "react";
import {
  BASE_MARGIN_TOP,
  BASE_PADDING,
  INFO_ROW_CLASSES,
  SecondaryLabel,
  TertiaryLabel,
} from "../composables";
import { useActiveMarket } from "../hooks";
import { useMarketManager } from "@/store";
import { AlertIndicator, InfoCard, TokenDisplayer } from "@/components/common";
import { SpringNumber } from "@/components/composables";
import { format } from "date-fns";
import { RoycoMarketType } from "@/sdk/market";

const InfoKeyElementClone = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token_data: any;
  }
>(({ className, token_data, ...props }, ref) => {
  return (
    <TokenDisplayer
      className={cn("", className)}
      tokens={[token_data]}
      size={4}
      symbols={true}
    />
  );
});

const InfoValueElementClone = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    currentMarketData: any;
    previousMarketData: any;
    token_data: any;
    incentiveType: any;
  }
>(
  (
    {
      className,
      previousMarketData,
      currentMarketData,
      token_data,
      incentiveType,
      ...props
    },
    ref
  ) => {
    return (
      <Fragment>
        <SecondaryLabel className={cn("text-black", className)}>
          {token_data.annual_change_ratio === Math.pow(10, 18)
            ? `N/D`
            : Intl.NumberFormat("en-US", {
                style: "percent",
                notation: "compact",
                useGrouping: true,
                minimumFractionDigits: 0, // Ensures at least 2 decimal places
                maximumFractionDigits: 8, // Limits to exactly 2 decimal places
              }).format(token_data.annual_change_ratio)}{" "}
        </SecondaryLabel>

        <TertiaryLabel className={cn("", className)}>
          {Intl.NumberFormat("en-US", {
            notation: "compact",
            useGrouping: true,
            minimumFractionDigits: 0, // Ensures at least 2 decimal places
            maximumFractionDigits: 8, // Limits to exactly 2 decimal places
          }).format(token_data.per_input_token)}{" "}
          {token_data.symbol} per{" "}
          {currentMarketData.input_token_data.symbol.toUpperCase()}
        </TertiaryLabel>

        <TertiaryLabel className={cn("", className)}>
          @{" "}
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
            useGrouping: true,
            minimumFractionDigits: 0, // Ensures at least 2 decimal places
            maximumFractionDigits: 8, // Limits to exactly 2 decimal places
          }).format(token_data.fdv)}{" "}
          FDV
        </TertiaryLabel>
      </Fragment>
    );
  }
);

export const IncentiveInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const {
    marketMetadata,
    currentMarketData,
    previousMarketData,
    currentHighestOffers,
    previousHighestOffers,
  } = useActiveMarket();

  const { incentiveType, setIncentiveType } = useMarketManager();

  const currentIncentives =
    marketMetadata.market_type === RoycoMarketType.recipe.id
      ? !!currentHighestOffers && currentHighestOffers.ip_offers.length > 0
        ? currentHighestOffers.ip_offers[0].tokens_data
        : []
      : currentMarketData?.incentive_tokens_data;

  const previousIncentives =
    marketMetadata.market_type === RoycoMarketType.recipe.id
      ? !!previousHighestOffers && previousHighestOffers.ip_offers.length > 0
        ? previousHighestOffers.ip_offers[0].tokens_data
        : []
      : previousMarketData?.incentive_tokens_data;

  const currentNetAPR = currentIncentives?.reduce(
    (acc, curr) => acc + (curr.annual_change_ratio || 0),
    0
  );
  const previousNetAPR = previousIncentives?.reduce(
    (acc, curr) => acc + (curr.annual_change_ratio || 0),
    0
  );

  if (!!currentMarketData && !!marketMetadata) {
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
        <TertiaryLabel>INCENTIVES</TertiaryLabel>

        {!currentIncentives ||
          (currentIncentives.length === 0 && (
            <AlertIndicator
              iconClassName={cn("w-4 h-4")}
              className="pb-3 pt-7"
              contentClassName={cn("text-sm")}
            >
              No incentives offered
            </AlertIndicator>
          ))}

        {currentIncentives && currentIncentives.length !== 0 && (
          <InfoCard
            className={cn(
              "flex h-fit max-h-32 flex-col gap-3 overflow-y-scroll py-2",
              BASE_MARGIN_TOP.MD
            )}
          >
            {currentIncentives.map((token_data, token_data_index) => {
              const BASE_KEY = `market:incentive-info:${incentiveType}:${token_data.id}`;

              const start_date = Number(
                currentMarketData.base_start_timestamps?.[token_data_index]
              );
              const end_date = Number(
                currentMarketData.base_end_timestamps?.[token_data_index]
              );

              return (
                <InfoCard.Row key={BASE_KEY} className={INFO_ROW_CLASSES}>
                  <InfoCard.Row.Key className="relative h-fit w-fit">
                    {/* <AnimatePresence mode="popLayout">
                      <FallMotion
                        customKey={`${BASE_KEY}:${token_data.id}:token`}
                        height="1rem"
                        containerClassName="w-full absolute inset-0"
                      >
                        <InfoKeyElementClone token_data={token_data} />
                      </FallMotion>
                    </AnimatePresence> */}

                    {/**
                     * @notice Invisible
                     */}
                    <InfoKeyElementClone
                      className="mb-1"
                      token_data={token_data}
                    />

                    {start_date && end_date ? (
                      <TertiaryLabel className={cn("", className)}>
                        {`${format(start_date * 1000, "dd MMM yyyy")} - ${format(end_date * 1000, "dd MMM yyyy")}`}
                      </TertiaryLabel>
                    ) : null}
                  </InfoCard.Row.Key>

                  <InfoCard.Row.Value className="relative flex h-fit w-fit flex-col items-end gap-0">
                    {/**
                     * @notice Invisible
                     */}
                    <InfoValueElementClone
                      className=""
                      token_data={token_data}
                      currentMarketData={currentMarketData}
                      previousMarketData={previousMarketData}
                      incentiveType={incentiveType}
                    />
                  </InfoCard.Row.Value>
                </InfoCard.Row>
              );
            })}
          </InfoCard>
        )}

        <div
          className={cn(
            "flex w-full flex-row items-center justify-between",
            BASE_MARGIN_TOP.SM
          )}
        >
          <SecondaryLabel className="text-success">Net APR</SecondaryLabel>

          <SecondaryLabel className="text-success">
            {(currentNetAPR ?? 0) >= Math.pow(10, 18) ? (
              `0`
            ) : (
              <SpringNumber
                previousValue={previousNetAPR ?? 0}
                currentValue={currentNetAPR ?? 0}
                numberFormatOptions={{
                  style: "percent",
                  notation: "compact",
                  useGrouping: true,
                  minimumFractionDigits: 0, // Ensures at least 2 decimal places
                  maximumFractionDigits: 8, // Limits to exactly 2 decimal places
                }}
                defaultColor="text-success"
              />
            )}
          </SecondaryLabel>
        </div>
      </div>
    );
  }
});
