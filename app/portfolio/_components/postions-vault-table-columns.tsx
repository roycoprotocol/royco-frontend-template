import { cn } from "@/lib/utils";
import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { EnrichedOfferDataType } from "royco/queries";

import { getSupportedChain } from "royco/utils";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { MarketType } from "@/store/market-manager-props";
import Link from "next/link";
import { HoverCardTrigger } from "@/components/ui/hover-card";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { createPortal } from "react-dom";
import { IncentiveBreakdown } from "@/components/composables";

/**
 * @description Column definitions for the table
 * @note For cell formatting @see {@link https://tanstack.com/table/v8/docs/guide/column-defs}
 */
/**
 * @TODO Strictly type this
 */
// @ts-ignore
export const positionsVaultColumns: ColumnDef<EnrichedOfferDataType> = [
  {
    accessorKey: "name",
    enableResizing: false,
    enableSorting: false,
    header: "Action Market",
    meta: {
      className: "min-w-32 w-80",
    },
    cell: (props: any) => {
      return (
        <Link
          href={`/market/${props.row.original.chain_id}/${MarketType.vault.value}/${props.row.original.market_id}`}
        >
          <div
            className={cn(
              "flex flex-col items-start gap-[0.2rem] font-gt text-sm font-300"
            )}
          >
            <SecondaryLabel className="text-black">
              {props.row.original.name || "Unknown market"}
            </SecondaryLabel>

            <SecondaryLabel className="text-tertiary">
              {`${props.row.original.account_address.slice(0, 6)}...${props.row.original.account_address.slice(-4)} • ${getSupportedChain(props.row.original.chain_id)?.name || "Unknown Chain"}`}
            </SecondaryLabel>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "market_value",
    enableResizing: false,
    enableSorting: false,
    header: <span className="flex flex-col items-center">Balance</span>,
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
            "flex flex-col items-center gap-[0.2rem] font-gt text-sm font-300"
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
  {
    accessorKey: "tokens_data",
    enableResizing: false,
    enableSorting: false,
    header: <span className="flex flex-col items-center">Incentives</span>,
    meta: {
      className: "min-w-36",
    },
    cell: (props: any) => {
      const tokens = props.row.original.tokens_data;
      const points = tokens.filter((token: any) => token.type === "point");

      return (
        <div className={cn("flex flex-col items-center")}>
          <HoverCard openDelay={200} closeDelay={200}>
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
                    base_key={"portfolio:positions:vault"}
                    breakdown={tokens}
                  />
                </HoverCardContent>,
                document.body
              )}
          </HoverCard>
        </div>
      );
    },
  },
  {
    accessorKey: "annual_change_ratio",
    enableResizing: false,
    enableSorting: false,
    header: <span className="flex flex-col items-center">APR</span>,
    meta: {
      className: "min-w-24",
    },
    cell: (props: any) => {
      return (
        <div
          className={cn(
            "flex flex-col items-center gap-[0.2rem] font-gt text-sm font-300"
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
    header: (
      <span className="flex flex-col items-center">Time to Incentive</span>
    ),
    meta: {
      className: "min-w-32 w-52",
    },
    cell: (props: any) => {
      return (
        <div
          className={cn(
            "flex flex-col items-center gap-[0.2rem] font-gt text-sm font-300"
          )}
        >
          <SecondaryLabel className="text-black">None</SecondaryLabel>
        </div>
      );
    },
  },
  {
    accessorKey: "reward_style",
    enableResizing: false,
    enableSorting: false,
    header: <span className="flex flex-col items-center">Exit</span>,
    meta: {
      className: "min-w-32 w-52",
    },
    cell: (props: any) => {
      return (
        <div
          className={cn(
            "flex flex-col items-center gap-[0.2rem] font-gt text-sm font-300"
          )}
        >
          <SecondaryLabel className="text-black">Anytime</SecondaryLabel>
        </div>
      );
    },
  },
  {
    accessorKey: "unclaimed_incentives",
    enableResizing: false,
    enableSorting: false,
    header: (
      <span className="flex flex-col items-center">Unclaimed Incentives</span>
    ),
    meta: {
      className: "min-w-48 w-64",
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
              "flex flex-col items-center gap-[0.2rem] font-gt text-sm font-300"
            )}
          >
            Not Applicable
          </div>
        );
      } else {
        return (
          <div
            className={cn(
              "flex flex-col items-center gap-[0.2rem] font-gt text-sm font-300"
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
    meta: {
      className: "min-w-48 w-64",
    },
    cell: (props: any) => {
      return (
        <Link
          href={`/market/${props.row.original.chain_id}/${MarketType.vault.value}/${props.row.original.market_id}`}
          className="flex flex-col items-center gap-[0.2rem] font-gt text-sm font-300"
        >
          <SecondaryLabel className="text-black underline">
            Withdraw from Market Page
          </SecondaryLabel>
        </Link>
      );
    },
  },
];
