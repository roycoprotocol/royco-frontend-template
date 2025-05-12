import React from "react";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { getSupportedChain } from "royco/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { getExplorerUrl } from "royco/utils";
import { TokenDisplayer } from "@/components/common";
import formatNumber from "@/utils/numbers";
import { BoycoPosition } from "royco/api";

export type PositionsBoycoDataElement = BoycoPosition;
export type PositionsBoycoColumnDataElement = PositionsBoycoDataElement;

export const actionsBoycoColumns: ColumnDef<PositionsBoycoColumnDataElement>[] =
  [
    {
      id: "actions",
      enableHiding: false,
      meta: "",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DotsHorizontalIcon className="h-4 w-4 text-secondary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-sm" align="end">
              <DropdownMenuItem
                onClick={() => {
                  const explorerUrl = getExplorerUrl({
                    chainId: 1,
                    value: (row.original.id ?? "").split("-")[1] ?? "",
                    type: "address",
                  });

                  window.open(explorerUrl, "_blank", "noopener,noreferrer");
                }}
              >
                View Weiroll Wallet on {getSupportedChain(1)?.name}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  const explorerUrl = getExplorerUrl({
                    chainId: 80094,
                    value: row.original.weirollWallet ?? "",
                    type: "address",
                  });

                  window.open(explorerUrl, "_blank", "noopener,noreferrer");
                }}
              >
                View Weiroll Wallet on {getSupportedChain(80094)?.name}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  const explorerUrl = getExplorerUrl({
                    chainId: 1,
                    value: row.original.depositTransactionHash ?? "",
                    type: "tx",
                  });

                  window.open(explorerUrl, "_blank", "noopener,noreferrer");
                }}
              >
                View Deposit Transaction on {getSupportedChain(1)?.name}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  const explorerUrl = getExplorerUrl({
                    chainId: 1,
                    value: row.original.bridgeTransactionHash ?? "",
                    type: "tx",
                  });

                  window.open(explorerUrl, "_blank", "noopener,noreferrer");
                }}
              >
                View Bridge Transaction on {getSupportedChain(1)?.name}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  const explorerUrl = getExplorerUrl({
                    chainId: 80094,
                    value: row.original.processTransactionHash ?? "",
                    type: "tx",
                  });

                  window.open(explorerUrl, "_blank", "noopener,noreferrer");
                }}
              >
                View Bridge Transaction on {getSupportedChain(80094)?.name}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  const explorerUrl = getExplorerUrl({
                    chainId: 80094,
                    value: row.original.executeTransactionHash ?? "",
                    type: "tx",
                  });

                  window.open(explorerUrl, "_blank", "noopener,noreferrer");
                }}
              >
                View Deposit to dApp Transaction on{" "}
                {getSupportedChain(80094)?.name}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

export const baseBoycoColumns: ColumnDef<PositionsBoycoColumnDataElement>[] = [
  {
    accessorKey: "marketValue",
    enableResizing: true,
    enableSorting: false,
    header: "Market Value",
    meta: "text-left",
    cell: ({ row }) => {
      let marketValue = 0;

      if (!row.original.isWithdrawn) {
        marketValue += row.original.receiptTokens.breakdown.reduce(
          (acc, curr) => acc + curr.tokenAmountUsd,
          0
        );
      }

      return (
        <div className={cn("")}>
          {formatNumber(marketValue, {
            type: "currency",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "suppliedAssets",
    enableResizing: false,
    enableSorting: false,
    header: "Supplied Assets",
    meta: "text-left",
    cell: ({ row }) => {
      let suppliedAssets = 0;

      if (!row.original.isWithdrawn) {
        suppliedAssets += row.original.inputToken.tokenAmountUsd;
      }

      return (
        <div className={cn("flex w-full flex-col items-start")}>
          <div>
            {formatNumber(suppliedAssets, {
              type: "currency",
            })}
          </div>

          <div className="flex flex-row items-center font-light text-tertiary">
            {formatNumber(suppliedAssets, {
              type: "number",
            })}
            <TokenDisplayer
              imageClassName="hidden"
              className="text-tertiary"
              size={4}
              tokens={[row.original.inputToken]}
              symbols={true}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "receiptTokens",
    enableResizing: true,
    enableSorting: false,
    header: "Receipt Token",
    meta: "text-left",
    cell: ({ row }) => {
      const receiptTokenValue = row.original.receiptTokens.breakdown.reduce(
        (acc, curr) => acc + curr.tokenAmountUsd,
        0
      );

      return (
        <div className={cn("flex w-fit flex-col items-start")}>
          <div>{formatNumber(receiptTokenValue, { type: "currency" })}</div>

          <div className="flex flex-col items-start font-light text-tertiary">
            {row.original.receiptTokens.breakdown.map((item) => {
              return (
                <div
                  key={`incentive-breakdown:${row.original.id}:${item.id}`}
                  className="flex flex-row items-center"
                >
                  {formatNumber(item.tokenAmount, {
                    type: "number",
                  })}
                  <TokenDisplayer
                    symbolClassName="text-tertiary"
                    imageClassName="hidden"
                    size={4}
                    tokens={[item] as any}
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
  // {
  //   accessorKey: "accumulatedIncentives",
  //   enableResizing: true,
  //   enableSorting: false,
  //   header: "Accumulated Incentives",
  //   meta: "text-left",
  //   cell: ({ row }) => {
  //     if (row.original.incentiveTokens.length > 0) {
  //       return (
  //         <div className={cn("flex w-fit flex-row items-center gap-2")}>
  //           <HoverCard openDelay={200} closeDelay={200}>
  //             <HoverCardTrigger
  //               className={cn("flex cursor-pointer items-end gap-1")}
  //             >
  //               <span>
  //                 {formatNumber(row.original.incentiveTokens[0].tokenAmount)}
  //               </span>

  //               <TokenDisplayer
  //                 size={4}
  //                 tokens={row.original.incentiveTokens}
  //                 symbols={true}
  //               />
  //             </HoverCardTrigger>
  //             {typeof window !== "undefined" &&
  //               row.original.incentiveTokens.length > 0 &&
  //               createPortal(
  //                 <HoverCardContent
  //                   className="min-w-40 p-2"
  //                   onClick={(e) => e.stopPropagation()}
  //                 >
  //                   {row.original.incentiveTokens.map((item) => (
  //                     <div
  //                       key={`incentive-breakdown:${row.original.id}:${item.id}`}
  //                       className="flex flex-row items-center justify-between font-light"
  //                     >
  //                       <TokenDisplayer
  //                         size={4}
  //                         tokens={[item]}
  //                         symbols={true}
  //                       />

  //                       {item.tokenAmount && (
  //                         <div className="ml-2 flex flex-row items-center gap-2 text-sm">
  //                           {formatNumber(item.tokenAmount)}
  //                         </div>
  //                       )}
  //                     </div>
  //                   ))}
  //                 </HoverCardContent>,
  //                 document.body
  //               )}
  //           </HoverCard>
  //         </div>
  //       );
  //     }
  //   },
  // },
];

export const positionsBoycoColumns: ColumnDef<PositionsBoycoColumnDataElement>[] =
  [...actionsBoycoColumns, ...baseBoycoColumns];
