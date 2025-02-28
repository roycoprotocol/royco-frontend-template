import { ColumnDef } from "@tanstack/react-table";
import {
  getRecipeForfeitTransactionOptions,
  useEnrichedPositionsBoyco,
  useEnrichedPositionsRecipe,
} from "royco/hooks";

import { cn } from "@/lib/utils";
import React from "react";

import { getSupportedChain } from "royco/utils";
import { useMarketManager } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { getExplorerUrl } from "royco/utils";
import { TokenDisplayer } from "@/components/common";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { createPortal } from "react-dom";
import formatNumber from "@/utils/numbers";
import Link from "next/link";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";

export type PositionsBoycoDataElement = NonNullable<
  NonNullable<
    NonNullable<ReturnType<typeof useEnrichedPositionsBoyco>>["data"]
  >["data"]
>[number];

export type PositionsBoycoColumnDataElement = PositionsBoycoDataElement & {
  prev: PositionsBoycoDataElement | null;
};

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
                    value: row.original.weiroll_wallet ?? "",
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
                    value: row.original.deposit_transaction_hash ?? "",
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
                    value: row.original.bridge_transaction_hash ?? "",
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
                    value: row.original.process_transaction_hash ?? "",
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
                    value: row.original.execute_transaction_hash ?? "",
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
    accessorKey: "market_value",
    enableResizing: true,
    enableSorting: false,
    header: "Market Value",
    meta: "text-left",
    cell: ({ row }) => {
      const input_token_value = row.original.is_withdrawn
        ? 0
        : row.original.receipt_token_data.token_amount_usd;

      const market_value = input_token_value;

      return (
        <div className={cn("")}>
          {formatNumber(market_value, {
            type: "currency",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "receipt_token",
    enableResizing: true,
    enableSorting: false,
    header: "Receipt Token Balance",
    meta: "text-left",
    cell: ({ row }) => {
      const input_token_value = row.original.is_withdrawn
        ? 0
        : row.original.receipt_token_data.token_amount_usd;

      return (
        <div className={cn("flex w-fit flex-col items-start")}>
          <div>{formatNumber(input_token_value, { type: "currency" })}</div>

          <div className="flex flex-row items-center text-tertiary">
            {formatNumber(row.original.receipt_token_data.token_amount, {
              type: "number",
            })}
            <TokenDisplayer
              symbolClassName="text-tertiary"
              imageClassName="hidden"
              size={4}
              tokens={[row.original.receipt_token_data] as any}
              symbols={true}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "accumulated_incentives",
    enableResizing: true,
    enableSorting: false,
    header: "Accumulated Incentives",
    meta: "text-left",
    cell: ({ row }) => {
      let unclaimed_first_incentive = 0;

      if (row.original.token_1_datas.length > 0) {
        unclaimed_first_incentive = row.original.token_1_datas[0].token_amount;
      }

      return (
        <div className={cn("flex w-fit flex-row items-center gap-2")}>
          <HoverCard openDelay={200} closeDelay={200}>
            <HoverCardTrigger
              className={cn("flex cursor-pointer items-end gap-1")}
            >
              <span>
                {formatNumber(row.original.token_1_datas[0].token_amount)}
              </span>

              <TokenDisplayer
                size={4}
                tokens={[row.original.token_1_datas[0]]}
                symbols={true}
              />
            </HoverCardTrigger>
            {typeof window !== "undefined" &&
              row.original.token_1_datas[0].token_amount > 0 &&
              createPortal(
                <HoverCardContent
                  className="min-w-40 p-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {row.original.token_1_datas.map((item) => (
                    <div
                      key={`incentive-breakdown:${row.original.id}:${item.id}`}
                      className="flex flex-row items-center justify-between font-light"
                    >
                      <TokenDisplayer
                        size={4}
                        tokens={[item] as any}
                        symbols={true}
                      />

                      {item.token_amount && (
                        <div className="ml-2 flex flex-row items-center gap-2 text-sm">
                          {formatNumber(item.token_amount)}
                        </div>
                      )}
                    </div>
                  ))}
                </HoverCardContent>,
                document.body
              )}
          </HoverCard>
        </div>
      );
    },
  },
  {
    accessorKey: "claim_incentives",
    enableResizing: true,
    enableSorting: false,
    header: "",
    meta: "text-left",
    cell: ({ row }) => {
      const unlock_timestamp = parseInt(row.original.unlock_timestamp ?? "0");
      const is_unlocked =
        unlock_timestamp <= Math.floor(Date.now() / 1000) + 3600;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
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
              Claim Incentives
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <span>Coming Soon</span>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
];

export const positionsBoycoColumns: ColumnDef<PositionsBoycoColumnDataElement>[] =
  [...actionsBoycoColumns, ...baseBoycoColumns];
