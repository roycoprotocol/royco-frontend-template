import { cn } from "@/lib/utils";
import { TokenDisplayer } from "@/components/common";
import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { EnrichedOfferDataType } from "@/sdk/queries";

import { BASE_UNDERLINE, SecondaryLabel } from "../composables";
import { formatDistanceToNow } from "date-fns";
import { MarketUserType, RewardStyleMap } from "@/store";
import { RoycoMarketOfferType, RoycoMarketUserType } from "@/sdk/market";

/**
 * @description Column definitions for the table
 * @note For cell formatting @see {@link https://tanstack.com/table/v8/docs/guide/column-defs}
 */
/**
 * @TODO Strictly type this
 */
// @ts-ignore
export const positionsVaultColumns: ColumnDef<EnrichedOfferDataType> = [
  // {
  //   accessorKey: "name",
  //   enableResizing: false,
  //   enableSorting: false,
  //   header: "Name",
  //   meta: {
  //     className: "min-w-52",
  //   },
  //   cell: (props: any) => {
  //     return <div>{props.row.original.name}</div>;
  //   },
  // },
  // {
  //   accessorKey: "offer_side",
  //   enableResizing: false,
  //   enableSorting: false,
  //   header: "Side",
  //   meta: {
  //     className: "min-w-24",
  //   },
  //   cell: (props: any) => {
  //     return (
  //       <div
  //         className={cn(
  //           "font-gt text-sm font-300",
  //           props.row.original.offer_side ===
  //             RoycoMarketUserType.ap.value.toString()
  //             ? "text-success"
  //             : "text-error"
  //         )}
  //       >
  //         {props.row.original.offer_side ===
  //         RoycoMarketUserType.ap.value.toString()
  //           ? MarketUserType.ap.label
  //           : MarketUserType.ip.label}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "annual_change_ratio",
    enableResizing: false,
    enableSorting: false,
    header: "APR",
    meta: {
      className: "min-w-24",
    },
    cell: (props: any) => {
      return (
        <div
          className={cn(
            "flex flex-col items-start gap-[0.2rem] font-gt text-sm font-300"
          )}
        >
          <SecondaryLabel className="text-black">
            {Intl.NumberFormat("en-US", {
              style: "percent",
              notation: "compact",
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(props.row.original.annual_change_ratio)}
          </SecondaryLabel>
        </div>
      );
    },
  },
  {
    accessorKey: "reward_style",
    enableResizing: false,
    enableSorting: false,
    header: "Incentive Payout",
    meta: {
      className: "min-w-32",
    },
    cell: (props: any) => {
      return (
        <div
          className={cn(
            "flex flex-col items-start gap-[0.2rem] font-gt text-sm font-300"
          )}
        >
          <SecondaryLabel className="text-black">Streaming</SecondaryLabel>
        </div>
      );
    },
  },
  {
    accessorKey: "tokens_data",
    enableResizing: false,
    enableSorting: false,
    header: "Incentives",
    meta: {
      className: "min-w-36",
    },
    cell: (props: any) => {
      return (
        <div
          className={cn(
            "flex flex-col gap-[0.2rem] pr-3 font-gt text-sm font-300"
          )}
        >
          {props.row.original.tokens_data.length === 0 && (
            <div className="flex items-center space-x-2">None</div>
          )}

          {props.row.original.tokens_data.map(
            (
              // @ts-ignore
              token,
              // @ts-ignore
              tokenIndex
            ) => {
              return (
                <div
                  key={`${props.row.original.id}:incentives:${token.id}`}
                  className="flex items-center space-x-2"
                >
                  <div className="h-4">
                    <span className="leading-5">
                      {Intl.NumberFormat("en-US", {
                        style: "decimal",
                        notation: "standard",
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8,
                      }).format(token.token_amount)}
                    </span>
                  </div>

                  <TokenDisplayer size={4} tokens={[token]} symbols={true} />
                </div>
              );
            }
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "input_token_data",
    enableResizing: false,
    enableSorting: false,
    header: "Cost",
    meta: {
      className: "min-w-32",
    },
    cell: (props: any) => {
      return (
        <div
          className={cn(
            "flex flex-col items-start gap-[0.2rem] font-gt text-sm font-300"
          )}
        >
          <SecondaryLabel className="text-black">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "standard",
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            }).format(props.row.original.input_token_data.token_amount_usd)}
          </SecondaryLabel>

          <div className="flex flex-row items-center space-x-2">
            <SecondaryLabel className="text-tertiary">
              {Intl.NumberFormat("en-US", {
                style: "decimal",
                notation: "standard",
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              }).format(props.row.original.input_token_data.token_amount)}{" "}
              {props.row.original.input_token_data.symbol.toUpperCase()}
            </SecondaryLabel>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "unclaimed_incentives",
    enableResizing: false,
    enableSorting: false,
    header: "Unclaimed Incentives",
    meta: {
      className: "min-w-48",
    },
    cell: (props: any) => {
      let unclaimed_incentives_usd = 0;

      for (let i = 0; i < props.row.original.tokens_data.length; i++) {
        unclaimed_incentives_usd +=
          props.row.original.tokens_data[i].token_amount_usd;
      }

      if (props.row.original.offer_side === 1) {
        return (
          <div
            className={cn(
              "flex flex-col items-start gap-[0.2rem] font-gt text-sm font-300"
            )}
          >
            Not Applicable
          </div>
        );
      } else {
        return (
          <div
            className={cn(
              "flex flex-col items-start gap-[0.2rem] font-gt text-sm font-300"
            )}
          >
            <SecondaryLabel className="text-black">
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "standard",
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              }).format(unclaimed_incentives_usd)}
            </SecondaryLabel>

            <div className="flex flex-col gap-1">
              {props.row.original.tokens_data.map(
                (token: any, tokenIndex: number) => {
                  return (
                    <div
                      key={`${props.row.original.id}:unclaimed_incentives:${token.id}`}
                      className="flex flex-row items-center space-x-2"
                    >
                      <SecondaryLabel className="text-tertiary">
                        {Intl.NumberFormat("en-US", {
                          style: "decimal",
                          notation: "standard",
                          useGrouping: true,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8,
                        }).format(token.token_amount)}{" "}
                        {token.symbol.toUpperCase()}
                      </SecondaryLabel>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "market_value",
    enableResizing: false,
    enableSorting: false,
    header: "Market Value",
    meta: {
      className: "min-w-32",
    },
    cell: (props: any) => {
      const input_token_value =
        props.row.original.input_token_data.token_amount_usd;

      const tokens_value = props.row.original.tokens_data.reduce(
        (acc: number, token: any) => acc + token.token_amount_usd,
        0
      );

      const market_value = input_token_value + tokens_value;

      return (
        <div
          className={cn(
            "flex flex-col items-start gap-[0.2rem] font-gt text-sm font-300"
          )}
        >
          <SecondaryLabel className="text-black">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "standard",
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            }).format(market_value)}
          </SecondaryLabel>
        </div>
      );
    },
  },
];
