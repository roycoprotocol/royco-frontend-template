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
import { useEnrichedPositionsRecipe } from "royco/hooks";

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

import { EnrichedOfferDataType } from "royco/queries";

import { formatDistanceToNow } from "date-fns";
import { MarketUserType, RewardStyleMap, useMarketManager } from "@/store";
import { RoycoMarketOfferType, RoycoMarketUserType } from "royco/market";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ContractMap } from "royco/contracts";
import { getExplorerUrl } from "royco/utils";
import { BigNumber } from "ethers";
import { getRecipeForfeitTransactionOptions } from "royco/hooks";
import { useActiveMarket } from "../../../hooks";
import { TokenDisplayer } from "@/components/common";

export type PositionsRecipeDataElement = NonNullable<
  NonNullable<
    NonNullable<ReturnType<typeof useEnrichedPositionsRecipe>>["data"]
  >["data"]
>[number];

export type PositionsRecipeColumnDataElement = PositionsRecipeDataElement & {
  prev: PositionsRecipeDataElement | null;
};

export const actionsRecipeColumns: ColumnDef<PositionsRecipeColumnDataElement>[] =
  [
    {
      id: "actions",
      enableHiding: false,
      meta: "",
      cell: ({ row }) => {
        const { transactions, setTransactions } = useMarketManager();

        const { currentMarketData, marketMetadata } = useActiveMarket();

        let can_be_forfeited = false;

        if (
          !!currentMarketData &&
          currentMarketData.reward_style === 2 && // "2" represents forfeitable position
          row.original.is_forfeited === false &&
          row.original.is_claimed &&
          row.original.is_claimed.every(
            (isClaimed: boolean) => isClaimed === false
          ) &&
          row.original.is_withdrawn === false &&
          BigNumber.from(row.original.unlock_timestamp).gt(
            BigNumber.from(Math.floor(Date.now() / 1000))
          )
        ) {
          can_be_forfeited = true;
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DotsHorizontalIcon className="h-4 w-4 text-secondary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-sm" align="end">
              {/* {can_be_forfeited && (
              <DropdownMenuItem
                onClick={() => {
                  const txOptions = getRecipeForfeitTransactionOptions({
                    position: props.row.original,
                  });

                  setTransactions([...transactions, txOptions]);
                }}
              >
                Forfeit All Royco Incentives for Input Asset
              </DropdownMenuItem>
            )} */}

              <DropdownMenuItem
                onClick={() => {
                  const explorerUrl = getExplorerUrl({
                    chainId: row.original.chain_id ?? 0,
                    value: row.original.weiroll_wallet ?? "",
                    type: "address",
                  });

                  window.open(explorerUrl, "_blank", "noopener,noreferrer");
                }}
              >
                View Weiroll Wallet on{" "}
                {getSupportedChain(row.original.chain_id ?? 0)?.name}
              </DropdownMenuItem>

              {row.original.deposit_transaction_hash && (
                <DropdownMenuItem
                  onClick={() => {
                    const explorerUrl = getExplorerUrl({
                      chainId: row.original.chain_id ?? 0,
                      value: row.original.deposit_transaction_hash ?? "",
                      type: "tx",
                    });

                    window.open(explorerUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  View Deposit Transaction on{" "}
                  {getSupportedChain(row.original.chain_id ?? 0)?.name}
                </DropdownMenuItem>
              )}

              {row.original.bridge_transaction_hash && (
                <DropdownMenuItem
                  onClick={() => {
                    const explorerUrl = getExplorerUrl({
                      chainId: row.original.chain_id ?? 0,
                      value: row.original.bridge_transaction_hash ?? "",
                      type: "tx",
                    });

                    window.open(explorerUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  View Bridge Transaction on{" "}
                  {getSupportedChain(row.original.chain_id ?? 0)?.name}
                </DropdownMenuItem>
              )}

              {row.original.forfeit_transaction_hash && (
                <DropdownMenuItem
                  onClick={() => {
                    const explorerUrl = getExplorerUrl({
                      chainId: row.original.chain_id ?? 0,
                      value: row.original.forfeit_transaction_hash ?? "",
                      type: "tx",
                    });

                    window.open(explorerUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  View Withdraw Transaction on{" "}
                  {getSupportedChain(row.original.chain_id ?? 0)?.name}
                </DropdownMenuItem>
              )}

              {row.original.process_transaction_hash && (
                <DropdownMenuItem
                  onClick={() => {
                    const explorerUrl = getExplorerUrl({
                      chainId: row.original.chain_id ?? 0,
                      value: row.original.process_transaction_hash ?? "",
                      type: "tx",
                    });

                    window.open(explorerUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  View Bridge Transaction on{" "}
                  {getSupportedChain(row.original.chain_id ?? 0)?.name}
                </DropdownMenuItem>
              )}

              {row.original.withdraw_transaction_hash && (
                <DropdownMenuItem
                  onClick={() => {
                    const explorerUrl = getExplorerUrl({
                      chainId: row.original.chain_id ?? 0,
                      value: row.original.withdraw_transaction_hash ?? "",
                      type: "tx",
                    });

                    window.open(explorerUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  View Withdraw Transaction on{" "}
                  {getSupportedChain(row.original.chain_id ?? 0)?.name}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

export const baseRecipeColumns: ColumnDef<PositionsRecipeColumnDataElement>[] =
  [
    {
      accessorKey: "market_value",
      enableResizing: true,
      enableSorting: false,
      header: "Market Value",
      meta: "text-left",
      cell: ({ row }) => {
        const input_token_value = row.original.is_withdrawn
          ? 0
          : row.original.input_token_data.token_amount_usd;

        const incentive_tokens_value = row.original.tokens_data.reduce(
          (acc, token, index) => {
            if (row.original.is_claimed?.[index] === false) {
              return acc + token.token_amount_usd;
            }
            return acc;
          },
          0
        );

        const market_value = row.original.is_forfeited
          ? input_token_value
          : input_token_value + incentive_tokens_value;

        return (
          <div className={cn("")}>
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "standard",
              useGrouping: true,
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            }).format(market_value)}
          </div>
        );
      },
    },
    {
      accessorKey: "supplied_assets",
      enableResizing: true,
      enableSorting: false,
      header: "Supplied Assets",
      meta: "text-left",
      cell: ({ row }) => {
        const input_token_value = row.original.is_withdrawn
          ? 0
          : row.original.input_token_data.token_amount_usd;

        return (
          <div className={cn("flex w-fit flex-row items-center gap-2")}>
            <div>
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "standard",
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              }).format(input_token_value)}
            </div>

            <TokenDisplayer
              size={4}
              tokens={[row.original.input_token_data]}
              symbols={true}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "unclaimed_incentives",
      enableResizing: true,
      enableSorting: false,
      header: "Unclaimed Incentives",
      meta: "text-left",
      cell: ({ row }) => {
        let unclaimed_incentives_usd = 0;

        if (row.original.is_forfeited === false) {
          for (let i = 0; i < row.original.tokens_data.length; i++) {
            if (row.original.is_claimed?.[i] === false) {
              unclaimed_incentives_usd +=
                row.original.tokens_data[i].token_amount_usd;
            }
          }
        }

        if (row.original.offer_side === 1) {
          return <div className={cn("")}>Not Applicable</div>;
        } else {
          return (
            <div className={cn("flex w-fit flex-row items-center gap-2")}>
              <div className="">
                {Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  notation: "standard",
                  useGrouping: true,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8,
                }).format(unclaimed_incentives_usd)}
              </div>

              <TokenDisplayer
                size={4}
                tokens={row.original.tokens_data}
                symbols={true}
              />
            </div>
          );
        }
      },
    },
  ];

export const positionsRecipeColumns: ColumnDef<PositionsRecipeColumnDataElement>[] =
  [...actionsRecipeColumns, ...baseRecipeColumns];

export const positionsRecipeColumnsBoyco: ColumnDef<PositionsRecipeColumnDataElement>[] =
  [
    ...actionsRecipeColumns,
    {
      accessorKey: "status",
      enableResizing: true,
      enableSorting: false,
      header: "Status",
      meta: "text-left",
      cell: ({ row }) => {
        let status = "N/A";

        if (row.original.status === "deposited") {
          status = "Waiting";
        } else if (
          row.original.status === "bridged" ||
          row.original.status === "processed"
        ) {
          status = "Bridged";
        } else if (
          row.original.status === "forfeited" ||
          row.original.status === "withdrawn"
        ) {
          status = "Withdrawn";
        } else if (row.original.status === "executed") {
          status = "In Dapp";
        }

        return <div className={cn("text-success")}>{status}</div>;
      },
    },

    ...baseRecipeColumns,
  ];
