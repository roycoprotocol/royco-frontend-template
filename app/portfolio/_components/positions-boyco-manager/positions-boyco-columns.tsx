import React from "react";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useEnrichedPositionsBoyco } from "royco/hooks";
import { getSupportedChain, shortAddress } from "royco/utils";
import Link from "next/link";
import { formatDuration } from "date-fns";
import { RoycoMarketType } from "royco/market";
import { secondsToDuration } from "@/app/create/_components/market-builder-form/market-builder-form-schema";
import formatNumber from "@/utils/numbers";
import validator from "validator";
import { TokenDisplayer } from "@/components/common";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { createPortal } from "react-dom";

export type PositionsBoycoDataElement = NonNullable<
  NonNullable<
    NonNullable<ReturnType<typeof useEnrichedPositionsBoyco>>["data"]
  >["data"]
>[number];

export type PositionsBoycoColumnDataElement = PositionsBoycoDataElement & {
  prev: PositionsBoycoDataElement | null;
};

export const positionsBoycoColumns: ColumnDef<PositionsBoycoColumnDataElement>[] =
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
              {`${shortAddress(row.original.account_address ?? "")} • ${getSupportedChain(80094)?.name || "Unknown Chain"}`}
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
              {formatNumber(row.original.token_0_data.token_amount_usd, {
                type: "currency",
              })}
            </div>

            <div className="flex flex-row items-center font-light text-tertiary">
              {formatNumber(row.original.token_0_data.token_amount, {
                type: "number",
              })}
              <TokenDisplayer
                imageClassName="hidden"
                className="text-tertiary"
                size={4}
                tokens={[row.original.token_0_data]}
                symbols={true}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "receipt_token",
      enableResizing: false,
      enableSorting: false,
      header: "Receipt Token Balance",
      meta: "min-w-48 text-center",
      cell: ({ row }) => {
        return (
          <div
            className={cn("flex w-full flex-col items-center justify-center")}
          >
            <div>
              {formatNumber(row.original.receipt_token_data.token_amount_usd, {
                type: "currency",
              })}
            </div>

            <div className="flex flex-row items-center font-light text-tertiary">
              {formatNumber(row.original.receipt_token_data.token_amount, {
                type: "number",
              })}
              <TokenDisplayer
                imageClassName="hidden"
                className="text-tertiary"
                size={4}
                tokens={[row.original.receipt_token_data]}
                symbols={true}
              />
            </div>
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
              : (Number(row.original.unlock_timestamp) ?? 0) > 0
                ? label
                : "None"}
          </div>
        );
      },
    },
    {
      accessorKey: "incentives_accumulated",
      enableResizing: false,
      enableSorting: false,
      header: "Incentives Accumulated",
      meta: "min-w-48 text-center",
      cell: ({ row }) => {
        return (
          <div
            className={cn("flex w-full flex-col items-center justify-center")}
          >
            <div className="flex flex-row items-center font-normal">
              {formatNumber(row.original.token_1_datas[0].token_amount, {
                type: "number",
              })}
              <TokenDisplayer
                imageClassName="hidden"
                className=""
                symbolClassName="font-normal"
                size={4}
                tokens={[row.original.token_1_datas[0]]}
                symbols={true}
              />
            </div>
          </div>
        );
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
          <div className="flex w-full flex-col items-center justify-center">
            <Link
              href={`/market/1/0/${row.original.market_id}`}
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
    // {
    //   accessorKey: "withdraw_bera",
    //   enableResizing: false,
    //   enableSorting: false,
    //   header: "Withdraw BERA",
    //   meta: "min-w-60 text-center",
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex w-full flex-col items-center justify-center">
    //         <Link
    //           href={`#`}
    //           className="underline decoration-secondary decoration-dashed decoration-1 underline-offset-4 transition-opacity duration-300 ease-in-out hover:opacity-70"
    //         >
    //           Claim Page
    //         </Link>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "withdraw_incentives",
    //   enableResizing: false,
    //   enableSorting: false,
    //   header: "Withdraw Incentives",
    //   meta: "min-w-60 text-center",
    //   cell: ({ row }) => {
    //     return (
    //       <HoverCard openDelay={200} closeDelay={200}>
    //         <HoverCardTrigger
    //           className={cn("flex cursor-pointer items-center justify-center")}
    //         >
    //           <Link
    //             href={`#`}
    //             className="underline decoration-secondary decoration-dashed decoration-1 underline-offset-4 transition-opacity duration-300 ease-in-out hover:opacity-70"
    //           >
    //             See Links
    //           </Link>
    //         </HoverCardTrigger>
    //         {typeof window !== "undefined" &&
    //           createPortal(
    //             <HoverCardContent className="w-full min-w-64">
    //               <div>
    //                 <div></div>
    //               </div>
    //             </HoverCardContent>,
    //             document.body
    //           )}
    //       </HoverCard>
    //     );
    //   },
    // },
  ];
