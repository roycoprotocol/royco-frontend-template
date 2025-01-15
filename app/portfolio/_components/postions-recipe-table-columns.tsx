import { cn } from "@/lib/utils";
import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { EnrichedPositionsRecipeDataType } from "royco/queries";

import { MarketType } from "@/store";
import { SecondaryLabel } from "../../market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { getSupportedChain } from "royco/utils";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  IncentiveBreakdown,
  SpringNumber,
  TokenEditor,
  YieldBreakdown,
} from "@/components/composables";
import { differenceInMonths } from "date-fns";
import { addMonths } from "date-fns";
import { differenceInDays } from "date-fns";

/**
 * @description Column definitions for the table
 * @note For cell formatting @see {@link https://tanstack.com/table/v8/docs/guide/column-defs}
 */
/**
 * @TODO Strictly type this
 */
// @ts-ignore
export const positionsRecipeColumns: ColumnDef<EnrichedPositionsRecipeDataType> =
  [
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
            href={`/market/${props.row.original.chain_id}/${MarketType.recipe.value}/${props.row.original.market_id}`}
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
        const input_token_value = props.row.original.is_withdrawn
          ? 0
          : props.row.original.input_token_data.token_amount_usd;

        const tokens_value = props.row.original.tokens_data.reduce(
          (acc: number, token: any, index: number) => {
            if (props.row.original.is_claimed[index] === false) {
              return acc + token.token_amount_usd;
            }
            return acc;
          },
          0
        );

        const market_value = props.row.original.is_forfeited
          ? input_token_value
          : input_token_value + tokens_value;

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
                      base_key={"portfolio:positions:recipe"}
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
        const createdAt = Number(props.row.original.block_timestamp);
        const lockup = Number(props.row.original.lockup_time);

        const currentTime = Math.floor(Date.now() / 1000);

        const timeToIncentive = createdAt + lockup - currentTime;

        const formatTimeRemaining = (seconds: number) => {
          if (seconds <= 0) return "None";

          const futureDate = new Date((currentTime + seconds) * 1000);
          const now = new Date();

          const months = differenceInMonths(futureDate, now);
          const days = differenceInDays(futureDate, addMonths(now, months));

          if (months > 0) {
            return `${months} months ${days} days`;
          } else {
            return `${days} days`;
          }
        };

        return (
          <div
            className={cn(
              "flex flex-col items-center gap-[0.2rem] font-gt text-sm font-300"
            )}
          >
            <SecondaryLabel className="text-black">
              {props.row.original.lockup_time > 0
                ? formatTimeRemaining(timeToIncentive)
                : "None"}
            </SecondaryLabel>
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
            <SecondaryLabel className="text-black">
              {props.row.original.reward_style !== 2
                ? "Lockup Enforced"
                : "Anytime, but forfeit"}
              {/* {RewardStyleMap[props.row.original.reward_style].label} */}
            </SecondaryLabel>
          </div>
        );
      },
    },
    {
      accessorKey: "token_amounts",
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

        if (props.row.original.is_forfeited === false) {
          for (let i = 0; i < props.row.original.tokens_data.length; i++) {
            if (props.row.original.is_claimed[i] === false) {
              unclaimed_incentives_usd +=
                props.row.original.tokens_data[i].token_amount_usd;
            }
          }
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
            href={`/market/${props.row.original.chain_id}/${MarketType.recipe.value}/${props.row.original.market_id}`}
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
