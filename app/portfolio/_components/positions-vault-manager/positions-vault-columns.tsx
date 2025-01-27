import { SpringNumber } from "@/components/composables";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  useEnrichedPositionsRecipe,
  useEnrichedPositionsVault,
} from "royco/hooks";

import { cn } from "@/lib/utils";
import React from "react";

import { EnrichedPositionsRecipeDataType } from "royco/queries";

import { MarketType } from "@/store";
import { getSupportedChain, shortAddress } from "royco/utils";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  IncentiveBreakdown,
  TokenEditor,
  YieldBreakdown,
} from "@/components/composables";
import { differenceInMonths, formatDuration } from "date-fns";
import { addMonths } from "date-fns";
import { differenceInDays } from "date-fns";
import { RoycoMarketType } from "royco/market";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { secondsToDuration } from "@/app/create/_components/market-builder-form/market-builder-form-schema";
import formatNumber from "@/utils/numbers";

export type PositionsVaultDataElement = NonNullable<
  NonNullable<
    NonNullable<ReturnType<typeof useEnrichedPositionsVault>>["data"]
  >["data"]
>[number];

export type PositionsVaultColumnDataElement = PositionsVaultDataElement & {
  prev: PositionsVaultDataElement | null;
};

export const positionsVaultColumns: ColumnDef<PositionsVaultColumnDataElement>[] =
  [
    {
      accessorKey: "name",
      enableResizing: false,
      enableSorting: false,
      header: "Action Market",
      meta: "min-w-60",
      cell: ({ row }) => {
        return (
          <div
            className={cn("flex h-fit w-full shrink-0 flex-col items-start")}
          >
            <div className="max-w-56 overflow-hidden truncate text-ellipsis font-normal text-black">
              {row.original.name || "Unknown market"}
            </div>

            <div className="font-light text-tertiary">
              {`${shortAddress(row.original.account_address ?? "")} • ${getSupportedChain(row.original.chain_id ?? 1)?.name || "Unknown Chain"}`}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "market_value",
      enableResizing: false,
      enableSorting: false,
      header: "Balance",
      meta: "min-w-48 text-center",
      cell: ({ row }) => {
        const input_token_value =
          row.original.input_token_data.token_amount_usd;

        const incentive_tokens_value = row.original.tokens_data.reduce(
          (acc, token, index) => {
            return acc + token.token_amount_usd;
          },
          0
        );

        const market_value = input_token_value + incentive_tokens_value;

        return (
          <div className={cn("w-full text-center")}>
            {formatNumber(market_value, { type: "currency" })}
          </div>
        );
      },
    },
    {
      accessorKey: "incentives",
      enableResizing: false,
      enableSorting: false,
      header: "Incentives",
      meta: "min-w-48 text-center",
      cell: ({ row }) => {
        const tokens = row.original.tokens_data;
        const points = tokens.filter((token) => token.type === "point");

        return (
          <div className={cn("flex flex-col items-center")}>
            {points.length > 0 ? (
              <div className="flex flex-row items-center gap-1">
                {`${points[0].symbol} Points`}
              </div>
            ) : tokens.length > 0 ? (
              <div className="flex flex-row items-center gap-1">
                {tokens.length === 1
                  ? tokens[0].symbol
                  : `${tokens[0].symbol} + ${tokens.length - 1}`}
              </div>
            ) : (
              <div className="flex flex-row items-center gap-1">N/A</div>
            )}

            {/* <HoverCard openDelay={200} closeDelay={200}>
              <HoverCardTrigger className={cn("flex cursor-pointer items-end")}>
                {points.length > 0 ? (
                  <div className="flex flex-row items-center gap-1">
                    {`${points[0].symbol} Points`}
                  </div>
                ) : tokens.length > 0 ? (
                  <div className="flex flex-row items-center gap-1">
                    {tokens.length === 1
                      ? tokens[0].symbol
                      : `${tokens[0].symbol} + ${tokens.length - 1}`}
                  </div>
                ) : (
                  <div className="flex flex-row items-center gap-1">N/A</div>
                )}
              </HoverCardTrigger>
              {typeof window !== "undefined" &&
                tokens.length > 0 &&
                createPortal(
                  <HoverCardContent
                    className="w-64"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IncentiveBreakdown
                      base_key={"portfolio:positions:recipe"}
                      breakdown={tokens}
                    />
                  </HoverCardContent>,
                  document.body
                )}
            </HoverCard> */}
          </div>
        );
      },
    },
    {
      accessorKey: "annual_change_ratio",
      enableResizing: false,
      enableSorting: false,
      header: "APR",
      meta: "min-w-48 text-center",
      cell: ({ row }) => {
        return (
          <div className={cn("w-full text-center")}>
            {formatNumber(row.original.annual_change_ratio, {
              type: "percent",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "time_to_incentive",
      enableResizing: false,
      enableSorting: false,
      header: "Time to Incentive",
      meta: "min-w-48 text-center",
      cell: ({ row }) => {
        return <div className={cn("w-full text-center")}>None</div>;
      },
    },
    {
      accessorKey: "exit",
      enableResizing: false,
      enableSorting: false,
      header: "Exit",
      meta: "min-w-40 text-center",
      cell: ({ row }) => {
        return <div className={cn("w-full text-center")}>Anytime</div>;
      },
    },
    {
      accessorKey: "unclaimed_incentives",
      enableResizing: false,
      enableSorting: false,
      header: "Unclaimed Incentives",
      meta: "min-w-48 text-center",
      cell: ({ row }) => {
        let unclaimed_incentives_usd = 0;

        for (let i = 0; i < row.original.tokens_data.length; i++) {
          unclaimed_incentives_usd +=
            row.original.tokens_data[i].token_amount_usd;
        }

        if (row.original.offer_side === 1) {
          return <div className={cn("w-full text-center")}>Not Applicable</div>;
        } else {
          return (
            <div className={cn("w-full text-center")}>
              {formatNumber(unclaimed_incentives_usd, { type: "currency" })}
            </div>
          );
        }
      },
    },
    {
      accessorKey: "withdraw",
      enableResizing: false,
      enableSorting: false,
      header: "",
      meta: "min-w-60 text-center",
      cell: ({ row }) => {
        return (
          <Link
            href={`/market/${row.original.chain_id}/${RoycoMarketType.vault.value}/${row.original.market_id}`}
            className="underline decoration-secondary decoration-dashed decoration-1 underline-offset-4 transition-opacity duration-300 ease-in-out hover:opacity-70"
          >
            Withdraw from Market Page
          </Link>
        );
      },
    },
  ];
