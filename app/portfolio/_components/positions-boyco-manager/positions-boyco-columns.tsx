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
import { TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";

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
      header: "Receipt Token",
      meta: "min-w-48 text-center",
      cell: ({ row }) => {
        return (
          <div
            className={cn("flex w-full flex-col items-center justify-center")}
          >
            <div>
              {formatNumber(
                row.original.incentive_token_datas.reduce(
                  (acc, curr) => acc + curr.token_amount_usd,
                  0
                ),
                {
                  type: "currency",
                }
              )}
            </div>

            <div className="flex flex-col items-center">
              {row.original.incentive_token_datas.map((item) => {
                return (
                  <div
                    key={`incentive-breakdown:${row.original.id}:${item.id}`}
                    className="flex flex-row items-center font-light text-tertiary"
                  >
                    {formatNumber(item.token_amount, {
                      type: "number",
                    })}

                    <TokenDisplayer
                      imageClassName="hidden"
                      className="text-tertiary"
                      size={4}
                      tokens={[item]}
                      symbols={true}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "unlock",
      enableResizing: false,
      enableSorting: false,
      header: "Unlock",
      meta: "min-w-48 text-center",
      cell: ({ row }) => {
        const unlock_timestamp = Number(row.original.unlock_timestamp);

        const formattedDate = new Date(unlock_timestamp * 1000).toLocaleString(
          "en-US",
          {
            // timeZone: "America/Chicago",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZoneName: "short",
          }
        );

        return (
          <div className={cn("w-full text-center")}>
            {unlock_timestamp <= 0 ? "None" : formattedDate}
          </div>
        );
      },
    },
    // {
    //   accessorKey: "incentives_accumulated",
    //   enableResizing: false,
    //   enableSorting: false,
    //   header: "Incentives Accumulated",
    //   meta: "min-w-48 text-center",
    //   cell: ({ row }) => {
    //     return (
    //       <div
    //         className={cn("flex w-full flex-col items-center justify-center")}
    //       >
    //         <HoverCard openDelay={200} closeDelay={200}>
    //           <HoverCardTrigger
    //             className={cn("flex cursor-pointer items-end gap-1")}
    //           >
    //             <span>
    //               {formatNumber(row.original.token_1_datas[0].token_amount)}
    //             </span>

    //             <TokenDisplayer
    //               imageClassName="hidden"
    //               className=""
    //               symbolClassName="font-normal"
    //               size={4}
    //               tokens={[row.original.token_1_datas[0]]}
    //               symbols={true}
    //             />
    //           </HoverCardTrigger>
    //           {typeof window !== "undefined" &&
    //             row.original.token_1_datas[0].token_amount > 0 &&
    //             createPortal(
    //               <HoverCardContent
    //                 className="min-w-40 p-2"
    //                 onClick={(e) => e.stopPropagation()}
    //               >
    //                 {row.original.token_1_datas.map((item) => (
    //                   <div
    //                     key={`incentive-breakdown:${row.original.id}:${item.id}`}
    //                     className="flex flex-row items-center justify-between font-light"
    //                   >
    //                     <TokenDisplayer
    //                       size={4}
    //                       tokens={[item] as any}
    //                       symbols={true}
    //                     />

    //                     {item.token_amount && (
    //                       <div className="ml-2 flex flex-row items-center gap-2 text-sm">
    //                         {formatNumber(item.token_amount)}
    //                       </div>
    //                     )}
    //                   </div>
    //                 ))}
    //               </HoverCardContent>,
    //               document.body
    //             )}
    //         </HoverCard>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "withdraw",
      enableResizing: false,
      enableSorting: false,
      header: "",
      meta: "text-center",
      cell: ({ row }) => {
        const unlock_timestamp = parseInt(row.original.unlock_timestamp ?? "0");
        const is_unlocked =
          unlock_timestamp <= Math.floor(Date.now() / 1000) + 3600;

        return (
          <div className="flex w-full flex-col items-center justify-center">
            <Link
              href={`/market/1/0/${row.original.market_id}`}
              onClick={(event) => {
                if (!is_unlocked) {
                  event.preventDefault();
                }
              }}
              className={cn(
                "underline decoration-secondary decoration-dashed decoration-1 underline-offset-4 transition-opacity duration-300 ease-in-out hover:opacity-70",
                is_unlocked
                  ? ""
                  : "cursor-pointer text-tertiary decoration-tertiary"
              )}
            >
              Withdraw Assets & Incentives
            </Link>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "claim_incentives",
    //   enableResizing: true,
    //   enableSorting: false,
    //   header: "",
    //   meta: "text-center",
    //   cell: ({ row }) => {
    //     const unlock_timestamp = parseInt(row.original.unlock_timestamp ?? "0");
    //     const is_unlocked =
    //       unlock_timestamp <= Math.floor(Date.now() / 1000) + 3600;

    //     return (
    //       <Tooltip>
    //         <TooltipTrigger asChild>
    //           <Link
    //             href="#"
    //             onClick={(event) => {
    //               if (!is_unlocked) {
    //                 event.preventDefault();
    //               }
    //             }}
    //             className={cn(
    //               "underline decoration-secondary decoration-dashed decoration-1 underline-offset-4 transition-opacity duration-300 ease-in-out hover:opacity-70",
    //               is_unlocked
    //                 ? ""
    //                 : "cursor-pointer text-tertiary decoration-tertiary"
    //             )}
    //           >
    //             Claim Incentives
    //           </Link>
    //         </TooltipTrigger>
    //         <TooltipContent>
    //           <span>Coming Soon</span>
    //         </TooltipContent>
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      accessorKey: "market_page",
      enableResizing: false,
      enableSorting: false,
      header: "",
      meta: "text-center",
      cell: ({ row }) => {
        return (
          <div className="flex w-full flex-col items-center justify-center">
            <Link
              href={`/market/1/0/${row.original.market_id}`}
              className="underline decoration-secondary decoration-dashed decoration-1 underline-offset-4 transition-opacity duration-300 ease-in-out hover:opacity-70"
            >
              View Market
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
