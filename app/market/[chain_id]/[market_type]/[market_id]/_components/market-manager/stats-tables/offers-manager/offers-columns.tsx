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
  getVaultCancelAPOfferTransactionOptions,
  getRecipeCancelIPOfferTransactionOptions,
  getRecipeCancelAPOfferTransactionOptions,
  useEnrichedOffers,
  useEnrichedPositionsRecipe,
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
import { getRecipeForfeitTransactionOptions } from "royco/hooks";
import { useActiveMarket } from "../../../hooks";
import { TokenDisplayer } from "@/components/common";
import { TransactionOptionsType } from "royco/types";
import formatNumber from "@/utils/numbers";

export type OffersDataElement = NonNullable<
  NonNullable<NonNullable<ReturnType<typeof useEnrichedOffers>>["data"]>["data"]
>[number];

export type OffersColumnDataElement = OffersDataElement & {
  prev: OffersDataElement | null;
};

export const offersColumns: ColumnDef<OffersColumnDataElement>[] = [
  {
    id: "actions",
    enableHiding: false,
    meta: "",
    cell: ({ row }) => {
      const { transactions, setTransactions, userType } = useMarketManager();

      const { marketMetadata } = useActiveMarket();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DotsHorizontalIcon className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!row.original.is_cancelled &&
              BigInt(row.original.quantity_remaining ?? "0") !== BigInt(0) && (
                <DropdownMenuItem
                  onClick={() => {
                    let txOptions: TransactionOptionsType | null = null;

                    if (marketMetadata.market_type === MarketType.recipe.id) {
                      if (userType === MarketUserType.ap.id) {
                        // Cancel Recipe AP Offer
                        txOptions = getRecipeCancelAPOfferTransactionOptions({
                          offer: row.original,
                        });
                      } else {
                        // Cancel Recipe IP Offer
                        txOptions = getRecipeCancelIPOfferTransactionOptions({
                          offer: row.original,
                        });
                      }
                    } else {
                      // Cancel Vault AP Offer
                      txOptions = getVaultCancelAPOfferTransactionOptions({
                        offer: row.original,
                      });
                    }

                    if (txOptions) {
                      setTransactions([txOptions]);
                    }
                  }}
                >
                  Cancel offer
                </DropdownMenuItem>
              )}

            <DropdownMenuItem
              onClick={() => {
                const explorerUrl = getExplorerUrl({
                  chainId: row.original.chain_id ?? 0,
                  value: row.original.transaction_hash ?? "",
                  type: "tx",
                });

                window.open(explorerUrl, "_blank", "noopener,noreferrer");
              }}
            >
              Creation Transaction
            </DropdownMenuItem>

            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "status",
    enableResizing: true,
    enableSorting: false,
    header: "Status",
    meta: "",
    cell: ({ row }) => {
      let status = "Open";

      if (row.original.is_cancelled) {
        status = "Cancelled";
      } else if (BigInt(row.original.quantity_remaining ?? "0") === BigInt(0)) {
        status = "Filled";
      } else if (
        BigInt(row.original.expiry ?? "0") !== BigInt(0) &&
        BigInt(row.original.expiry ?? "0") <
          BigInt(Math.floor(Date.now() / 1000))
      ) {
        status = "Expired";
      } else if (row.original.is_valid === false) {
        status = "Invalid";
      }

      return (
        <div
          className={cn(
            "",
            status === "Cancelled" ||
              status === "Expired" ||
              status === "Invalid"
              ? "text-error"
              : "text-success"
          )}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "condition",
    enableResizing: true,
    enableSorting: false,
    header: "Condition",
    meta: "min-w-36",
    cell: ({ row }) => {
      return (
        <div className={cn("flex flex-col gap-[0.2rem]")}>
          {row.original.tokens_data.map((token, tokenIndex) => {
            return (
              <div key={tokenIndex} className="flex items-center space-x-3">
                <div className="">
                  {formatNumber(
                    row.original.market_type === MarketType.recipe.value
                      ? token.token_amount
                      : token.rate_per_year
                  )}
                </div>

                <TokenDisplayer
                  size={4}
                  tokens={
                    [
                      {
                        ...token,
                        symbol:
                          row.original.market_type === MarketType.recipe.value
                            ? token.symbol
                            : `${token.symbol}/year`,
                      },
                    ] as any
                  }
                  symbols={true}
                />
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "size_remaining",
    enableResizing: true,
    enableSorting: false,
    header: "Size Remaining",
    meta: "",
    cell: ({ row }) => {
      return (
        <div className={cn("flex flex-col items-start gap-[0.2rem]")}>
          <div className="text-black">
            {formatNumber(row.original.input_token_data.token_amount_usd, {
              type: "currency",
            })}
          </div>

          <div className="text-tertiary">
            {formatNumber(row.original.input_token_data.token_amount)}{" "}
            {row.original.input_token_data.symbol.toUpperCase()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "expiry",
    enableResizing: false,
    enableSorting: false,
    header: "Expiration",
    meta: "",
    cell: ({ row }) => {
      return (
        <div className={cn("")}>
          {row.original.expiry === "0"
            ? "Never"
            : formatDistanceToNow(
                new Date(parseInt(row.original.expiry ?? "0") * 1000),
                {
                  addSuffix: true,
                }
              )}
        </div>
      );
    },
  },
];
