import React from "react";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useEnrichedPositionsRecipe } from "royco/hooks";
import { getSupportedChain, shortAddress } from "royco/utils";
import Link from "next/link";
import { formatDuration } from "date-fns";
import { RoycoMarketType } from "royco/market";
import { secondsToDuration } from "@/app/create/_components/market-builder-form/market-builder-form-schema";
import formatNumber from "@/utils/numbers";
import validator from "validator";
import { TokenDisplayer } from "@/components/common";

export type PositionsRecipeDataElement = NonNullable<
  NonNullable<
    NonNullable<ReturnType<typeof useEnrichedPositionsRecipe>>["data"]
  >["data"]
>[number];

export type PositionsRecipeColumnDataElement = PositionsRecipeDataElement & {
  prev: PositionsRecipeDataElement | null;
};

export const positionsRecipeColumns: ColumnDef<PositionsRecipeColumnDataElement>[] =
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
              {validator.unescape(row.original.name ?? "Unknown market")}
            </div>

            <div className="font-light text-tertiary">
              {`${shortAddress(row.original.account_address ?? "")} • ${getSupportedChain(row.original.chain_id ?? 1)?.name || "Unknown Chain"}`}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "supplied_assets",
      enableResizing: false,
      enableSorting: false,
      header: "Supplied Assets",
      meta: "min-w-48 text-center",
      cell: ({ row }) => {
        return (
          <div
            className={cn("flex w-full flex-col items-center justify-center")}
          >
            <div>
              {formatNumber(row.original.input_token_data.token_amount_usd, {
                type: "currency",
              })}
            </div>

            <div className="flex flex-row items-center font-light text-tertiary">
              {formatNumber(row.original.input_token_data.token_amount, {
                type: "number",
              })}
              <TokenDisplayer
                imageClassName="hidden"
                className="text-tertiary"
                size={4}
                tokens={[row.original.input_token_data]}
                symbols={true}
              />
            </div>
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
    // {
    //   accessorKey: "annual_change_ratio",
    //   enableResizing: false,
    //   enableSorting: false,
    //   header: "APR",
    //   meta: "min-w-48 text-center",
    //   cell: ({ row }) => {
    //     return (
    //       <div className={cn("w-full text-center")}>
    //         {formatNumber(row.original.annual_change_ratio, {
    //           type: "percent",
    //         })}
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "time_to_incentive",
      enableResizing: false,
      enableSorting: false,
      header: "Time to Incentive",
      meta: "min-w-48 text-center",
      cell: ({ row }) => {
        const unlock_timestamp = Number(row.original.unlock_timestamp);
        const current_timestamp = Math.floor(Date.now() / 1000);
        const time_to_unlock_in_seconds = unlock_timestamp - current_timestamp;

        const label = formatDuration(
          Object.entries(secondsToDuration(time_to_unlock_in_seconds))
            .filter(([_, value]) => value > 0)
            .slice(0, 1)
            .reduce((acc, [unit, value]) => ({ ...acc, [unit]: value }), {})
        );

        return (
          <div className={cn("w-full text-center")}>
            {time_to_unlock_in_seconds <= 0
              ? "Now"
              : (Number(row.original.lockup_time) ?? 0) > 0
                ? label
                : "None"}
          </div>
        );
      },
    },
    {
      accessorKey: "exit",
      enableResizing: false,
      enableSorting: false,
      header: "Exit",
      meta: "min-w-40 text-center",
      cell: ({ row }) => {
        return (
          <div className={cn("w-full text-center")}>
            {row.original.reward_style !== 2
              ? "Lockup Enforced"
              : "Anytime, but forfeit"}
          </div>
        );
      },
    },
    {
      accessorKey: "accumulated_incentives",
      enableResizing: false,
      enableSorting: false,
      header: "Accumulated Incentives",
      meta: "min-w-48 text-center",
      cell: ({ row }) => {
        return (
          <div
            className={cn("flex w-full flex-col items-center justify-center")}
          >
            <div>
              {row.original.tokens_data.some(
                (token) => token.type !== "point"
              ) && (
                <div className="flex flex-row items-center gap-1">
                  {formatNumber(
                    row.original.tokens_data.reduce(
                      (acc, token) => acc + token.token_amount_usd,
                      0
                    ),
                    {
                      type: "currency",
                    }
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-row items-center font-normal">
              {row.original.tokens_data.map((token) => {
                return (
                  <div key={token.id} className="flex flex-row items-center">
                    {formatNumber(token.token_amount, { type: "number" })}

                    <TokenDisplayer
                      imageClassName="hidden"
                      symbolClassName="font-normal"
                      size={4}
                      tokens={[token]}
                      symbols={true}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );

        // let unclaimed_incentives_usd = 0;

        // if (row.original.is_forfeited === false) {
        //   for (let i = 0; i < row.original.tokens_data.length; i++) {
        //     if (row.original.is_claimed?.[i] === false) {
        //       unclaimed_incentives_usd +=
        //         row.original.tokens_data[i].token_amount_usd;
        //     }
        //   }
        // }

        // return (
        //   <div className={cn("w-full text-center")}>

        //     {formatNumber(unclaimed_incentives_usd, { type: "currency" })}
        //   </div>
        // );
      },
    },
    {
      accessorKey: "withdraw",
      enableResizing: false,
      enableSorting: false,
      header: "Withdraw Position",
      meta: "min-w-60 text-center",
      cell: ({ row }) => {
        return (
          <div className="flex w-full flex-col items-center justify-center">
            <Link
              href={`/market/${row.original.chain_id}/${RoycoMarketType.recipe.value}/${row.original.market_id}`}
              className="underline decoration-secondary decoration-dashed decoration-1 underline-offset-4 transition-opacity duration-300 ease-in-out hover:opacity-70"
            >
              {process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco"
                ? "Market Page"
                : "Withdraw from Market Page"}
            </Link>
          </div>
        );
      },
    },
  ];
