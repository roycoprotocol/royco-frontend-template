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
import { FallMotion } from "@/components/animations";
import { MarketIncentiveType, useMarketManager } from "@/store";
import { AlertIndicator, InfoCard, TokenDisplayer } from "@/components/common";
import { HorizontalTabs, SpringNumber } from "@/components/composables";
import { AnimatePresence } from "framer-motion";

const INPO_TIP_PROPS = {
  size: "sm" as "sm",
  type: "secondary" as "secondary",
  className: cn("w-full max-w-60"),
};

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
                minimumFractionDigits: 2, // Ensures at least 2 decimal places
                maximumFractionDigits: 2, // Limits to exactly 2 decimal places
              }).format(token_data.annual_change_ratio)}{" "}
        </SecondaryLabel>

        <TertiaryLabel className={cn("", className)}>
          {Intl.NumberFormat("en-US", {
            notation: "compact",
            minimumFractionDigits: 2, // Ensures at least 2 decimal places
            maximumFractionDigits: 2, // Limits to exactly 2 decimal places
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
            minimumFractionDigits: 2, // Ensures at least 2 decimal places
            maximumFractionDigits: 2, // Limits to exactly 2 decimal places
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
  const { marketMetadata, currentMarketData, previousMarketData } =
    useActiveMarket();

  const { incentiveType, setIncentiveType } = useMarketManager();

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

        {currentMarketData.incentive_tokens_data.length === 0 && (
          <AlertIndicator
            iconClassName={cn("w-4 h-4")}
            className="pb-3 pt-7"
            contentClassName={cn("text-sm")}
          >
            No incentives offered
          </AlertIndicator>
        )}

        {currentMarketData.incentive_tokens_data.length !== 0 && (
          <InfoCard
            className={cn(
              "flex h-fit max-h-32 flex-col gap-3 overflow-y-scroll py-2",
              BASE_MARGIN_TOP.MD
            )}
          >
            {currentMarketData.incentive_tokens_data.map(
              (token_data, token_data_index) => {
                const BASE_KEY = `market:incentive-info:${incentiveType}:${token_data.id}`;

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
                        className=""
                        token_data={token_data}
                      />
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
              }
            )}
          </InfoCard>
        )}

        <div
          className={cn(
            "flex w-full flex-row items-center justify-between",
            BASE_MARGIN_TOP.SM
          )}
        >
          <SecondaryLabel className="text-success">Net AIP</SecondaryLabel>

          <SecondaryLabel className="text-success">
            {currentMarketData.annual_change_ratio === Math.pow(10, 18) ? (
              `N/D`
            ) : (
              <SpringNumber
                previousValue={
                  previousMarketData
                    ? previousMarketData.annual_change_ratio ?? 0
                    : 0
                }
                currentValue={currentMarketData.annual_change_ratio ?? 0}
                numberFormatOptions={{
                  style: "percent",
                  notation: "compact",
                  minimumFractionDigits: 2, // Ensures at least 2 decimal places
                  maximumFractionDigits: 2, // Limits to exactly 2 decimal places
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
