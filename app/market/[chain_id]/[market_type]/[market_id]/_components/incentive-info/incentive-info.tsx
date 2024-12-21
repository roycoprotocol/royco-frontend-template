import { cn } from "@/lib/utils";
import React, { Fragment, useRef, useState } from "react";
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
import { SpringNumber, TokenEditor } from "@/components/composables";
import { format } from "date-fns";
import { RoycoMarketType } from "royco/market";
import { BigNumber } from "ethers";
import { SupportedToken } from "royco/constants";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SquarePenIcon } from "lucide-react";

const InfoKeyElementClone = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    token_data: any;
    symbolClassName?: string;
  }
>(({ className, token_data, symbolClassName, ...props }, ref) => {
  return (
    <TokenDisplayer
      className={cn("", className)}
      symbolClassName={cn("", symbolClassName)}
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
    const [open, setOpen] = useState(false);

    const triggerRef = useRef<HTMLDivElement>(null);

    const previousTokenData =
      previousMarketData.incentive_tokens_data.findIndex(
        (item: any) => item.id === token_data.id
      );

    return (
      <Fragment>
        <SecondaryLabel className={cn("text-black", className)}>
          {/* <SpringNumber
            previousValue={previousMarketData.annual_change_ratio}
            currentValue={token_data.annual_change_ratio}
            numberFormatOptions={{
              style: "percent",
              notation: "standard",
              useGrouping: true,
              minimumFractionDigits: 0, // Ensures at least 2 decimal places
              maximumFractionDigits:
                token_data.annual_change_ratio > 0.0001 ? 2 : 8, // Limits to exactly 2 decimal places
            }}
          /> */}
          {Intl.NumberFormat("en-US", {
            style: "percent",
            notation: "standard",
            useGrouping: true,
            minimumFractionDigits: 0, // Ensures at least 2 decimal places
            maximumFractionDigits:
              token_data.annual_change_ratio > 0.0001 ? 2 : 8, // Limits to exactly 2 decimal places
          }).format(token_data.annual_change_ratio)}{" "}
        </SecondaryLabel>

        {!!token_data.per_input_token && (
          <TertiaryLabel className={cn("", className)}>
            {(() => {
              const value = token_data.per_input_token;

              const decimals =
                value < 1 ? Math.ceil(Math.abs(Math.log10(value))) : 0;

              if (decimals > 1) {
                const multiplier = Math.pow(10, decimals);
                return (
                  <>
                    {Intl.NumberFormat("en-US", {
                      notation: "standard",
                      useGrouping: true,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }).format(value * multiplier)}{" "}
                    {token_data.symbol} per {multiplier}{" "}
                    {currentMarketData.input_token_data.symbol.toUpperCase()}
                  </>
                );
              }

              return (
                <>
                  {Intl.NumberFormat("en-US", {
                    notation: "standard",
                    useGrouping: true,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(value)}{" "}
                  {token_data.symbol} per{" "}
                  {currentMarketData.input_token_data.symbol.toUpperCase()}
                </>
              );
            })()}
          </TertiaryLabel>
        )}

        {!!token_data.fdv && (
          <div className="flex flex-row items-center gap-1">
            <TertiaryLabel className={cn("", className)}>
              @{" "}
              {/* <SpringNumber
                previousValue={previousTokenData.fdv}
                currentValue={token_data.fdv}
                numberFormatOptions={{
                  style: "currency",
                  currency: "USD",
                  notation: "standard",
                  useGrouping: true,
                  minimumFractionDigits: 0, // Ensures at least 2 decimal places
                  maximumFractionDigits: 8, // Limits to exactly 2 decimal places
                }}
              /> */}
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "standard",
                useGrouping: true,
                minimumFractionDigits: 0, // Ensures at least 2 decimal places
                maximumFractionDigits: 8, // Limits to exactly 2 decimal places
              }).format(token_data.fdv)}{" "}
              FDV
            </TertiaryLabel>

            <HoverCard
              openDelay={200}
              closeDelay={200}
              open={open}
              onOpenChange={setOpen}
            >
              <HoverCardTrigger
                asChild
                onClick={() => {
                  if (open === false) {
                    setOpen(true);
                  }
                }}
              >
                <SquarePenIcon
                  strokeWidth={1.5}
                  className="h-3 w-3 cursor-pointer text-secondary transition-all duration-200 ease-in-out hover:opacity-80"
                />
              </HoverCardTrigger>
              <HoverCardContent className="w-96 overflow-hidden p-0">
                <TokenEditor
                  closeHoverCard={() => {
                    setOpen(false);
                    triggerRef.current?.blur();
                  }}
                  token_data={{
                    ...token_data,
                    fdv: token_data.fdv ?? 0,
                    total_supply: token_data.total_supply
                      ? token_data.total_supply === 0
                        ? 1
                        : token_data.total_supply
                      : 0,
                    price: token_data.price ?? 0,
                    allocation: token_data.allocation
                      ? token_data.allocation * 100
                      : 100,
                  }}
                />
              </HoverCardContent>
            </HoverCard>
          </div>
        )}
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
      : currentMarketData?.incentive_tokens_data.filter(
          (incentive_token_data) => {
            return BigNumber.from(incentive_token_data.raw_amount ?? "0").gt(0);
          }
        );

  const currentNativeIncentives = currentMarketData.yield_breakdown.filter(
    (yield_breakdown) => yield_breakdown.category !== "base"
  );

  const currentNetAPR = currentMarketData?.annual_change_ratio ?? 0;
  const previousNetAPR = previousMarketData?.annual_change_ratio ?? 0;

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
        <TertiaryLabel>Incentives Offered via Royco</TertiaryLabel>

        {!currentIncentives ||
          (currentIncentives.length === 0 && (
            <AlertIndicator
              iconClassName={cn("w-4 h-4")}
              className="pb-3 pt-7"
              contentClassName={cn("text-sm")}
            >
              No add. incentives offered
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
                      symbolClassName="text-black font-normal"
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

        {currentNativeIncentives && currentNativeIncentives.length !== 0 && (
          <InfoCard
            className={cn(
              "flex h-fit max-h-32 flex-col gap-3 overflow-y-scroll py-2 pt-0",
              BASE_MARGIN_TOP.MD
            )}
          >
            <TertiaryLabel className={cn("", className)}>
              Underlying Incentives
            </TertiaryLabel>

            {currentNativeIncentives.map((token_data, token_data_index) => {
              const BASE_KEY = `market:native-incentive-info:${incentiveType}:${token_data.id}`;

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
                      symbolClassName="text-black font-normal"
                      token_data={token_data}
                    />

                    <TertiaryLabel className={cn("", className)}>
                      {token_data.label}
                    </TertiaryLabel>
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

        {currentMarketData.yield_breakdown.filter(
          (yield_breakdown) => yield_breakdown.category !== "base"
        ).length > 0 && (
          <div
            className={cn(
              "flex w-full flex-row items-center justify-between",
              BASE_MARGIN_TOP.SM
            )}
          >
            <SecondaryLabel className="text-black">Native Yield</SecondaryLabel>

            <SecondaryLabel className="text-black">
              {(currentMarketData.yield_breakdown
                .filter(
                  (yield_breakdown) => yield_breakdown.category !== "base"
                )
                .reduce(
                  (acc, yield_breakdown) =>
                    acc + yield_breakdown.annual_change_ratio,
                  0
                ) ?? 0) >= Math.pow(10, 18) ? (
                `0`
              ) : (
                <SpringNumber
                  previousValue={
                    previousMarketData?.yield_breakdown
                      .filter(
                        (yield_breakdown) => yield_breakdown.category !== "base"
                      )
                      .reduce(
                        (acc, yield_breakdown) =>
                          acc + yield_breakdown.annual_change_ratio,
                        0
                      ) ?? 0
                  }
                  currentValue={
                    currentMarketData.yield_breakdown
                      .filter(
                        (yield_breakdown) => yield_breakdown.category !== "base"
                      )
                      .reduce(
                        (acc, yield_breakdown) =>
                          acc + yield_breakdown.annual_change_ratio,
                        0
                      ) ?? 0
                  }
                  numberFormatOptions={{
                    style: "percent",
                    notation: "standard",
                    useGrouping: true,
                    minimumFractionDigits: 0, // Ensures at least 2 decimal places
                    maximumFractionDigits:
                      currentMarketData.yield_breakdown
                        .filter(
                          (yield_breakdown) =>
                            yield_breakdown.category !== "base"
                        )
                        .reduce(
                          (acc, yield_breakdown) =>
                            acc + yield_breakdown.annual_change_ratio,
                          0
                        ) > 0.0001
                        ? 2
                        : 8,
                  }}
                  defaultColor="text-black"
                />
              )}
            </SecondaryLabel>
          </div>
        )}

        <div
          className={cn(
            " flex w-full flex-row items-center justify-between border-t border-divider pt-4",
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
                  notation: "standard",
                  useGrouping: true,
                  minimumFractionDigits: 0, // Ensures at least 2 decimal places
                  maximumFractionDigits: (currentNetAPR ?? 0) > 0.0001 ? 2 : 8,
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
