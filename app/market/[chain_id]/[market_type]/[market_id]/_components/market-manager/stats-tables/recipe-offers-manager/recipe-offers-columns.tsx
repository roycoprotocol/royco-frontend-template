import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { TokenDisplayer } from "@/components/common";
import formatNumber from "@/utils/numbers";
import { RecipeOffer } from "royco/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  cancelRecipeAPOfferTxOptions,
  cancelRecipeIPOfferTxOptions,
  type EnrichedTxOption,
} from "royco/transaction";
import { useMarketManager } from "@/store";
import { getExplorerUrl } from "royco/utils";

export type RecipeOffersDataElement = RecipeOffer;
export type RecipeOffersColumnDataElement = RecipeOffersDataElement;

export const recipeOffersColumns: ColumnDef<RecipeOffersColumnDataElement>[] = [
  {
    id: "actions",
    enableHiding: false,
    meta: "",
    cell: ({ row }) => {
      const { transactions, setTransactions } = useMarketManager();

      let canCancel = false;

      if (row.original.status === "active") {
        canCancel = true;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DotsHorizontalIcon className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canCancel && (
              <DropdownMenuItem
                onClick={() => {
                  let txOptions: EnrichedTxOption[] = [];

                  if (row.original.offerSide === 0) {
                    txOptions = cancelRecipeAPOfferTxOptions({
                      chainId: row.original.chainId,
                      accountAddress: row.original.accountAddress,
                      offerId: row.original.offerId,
                      marketId: row.original.marketId,
                      fundingVault: row.original.fundingVault,
                      quantity: row.original.inputToken.rawAmount,
                      expiry: row.original.expiry,
                      incentiveTokenIds: row.original.incentiveTokens.map(
                        (token) => token.id
                      ),
                      incentiveTokenAmounts: row.original.incentiveTokens.map(
                        (token) => token.rawAmount
                      ),
                    });
                  } else {
                    txOptions = cancelRecipeIPOfferTxOptions({
                      chainId: row.original.chainId,
                      offerId: row.original.offerId,
                    });
                  }

                  setTransactions(txOptions);
                }}
              >
                Cancel offer
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => {
                const explorerUrl = getExplorerUrl({
                  chainId: row.original.chainId,
                  value: row.original.transactionHash,
                  type: "tx",
                });

                window.open(explorerUrl, "_blank", "noopener,noreferrer");
              }}
            >
              Creation Transaction
            </DropdownMenuItem>
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
      let status = "Invalid";

      if (row.original.status === "active") {
        status = "Active";
      } else if (row.original.status === "cancelled") {
        status = "Cancelled";
      } else if (row.original.status === "expired") {
        status = "Expired";
      } else if (row.original.status === "filled") {
        status = "Filled";
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
          {row.original.incentiveTokens.map((token, tokenIndex) => {
            return (
              <div key={tokenIndex} className="flex items-center space-x-3">
                <div className="">{formatNumber(token.tokenAmount)}</div>

                <TokenDisplayer
                  size={4}
                  tokens={[
                    {
                      ...token,
                      symbol: token.symbol,
                    },
                  ]}
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
    accessorKey: "sizeRemaining",
    enableResizing: true,
    enableSorting: false,
    header: "Size Remaining",
    meta: "",
    cell: ({ row }) => {
      return (
        <div className={cn("flex flex-col items-start gap-[0.2rem]")}>
          <div className="text-black">
            {formatNumber(row.original.inputToken.remainingTokenAmountUsd, {
              type: "currency",
            })}
          </div>

          <div className="text-tertiary">
            {formatNumber(row.original.inputToken.remainingTokenAmount)}{" "}
            {row.original.inputToken.symbol}
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
      console.log("expiry", row.original.expiry);

      return (
        <div className={cn("")}>
          {row.original.expiry === "0"
            ? "Never"
            : formatDistanceToNow(
                new Date(parseInt(row.original.expiry) * 1000),
                {
                  addSuffix: true,
                }
              )}
        </div>
      );
    },
  },
];
