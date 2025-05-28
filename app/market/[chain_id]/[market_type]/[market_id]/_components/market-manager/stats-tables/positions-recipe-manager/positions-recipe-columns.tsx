import React from "react";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { TokenDisplayer } from "@/components/common";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { createPortal } from "react-dom";
import formatNumber from "@/utils/numbers";
import { type RecipePosition } from "royco/api";
import { useMarketManager } from "@/store/use-market-manager";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { forfeitRecipePositionTxOptions } from "royco/transaction";
import { getExplorerUrl, getSupportedChain } from "royco/utils";

export type PositionsRecipeDataElement = RecipePosition;
export type PositionsRecipeColumnDataElement = PositionsRecipeDataElement;

export const actionsRecipeColumns: ColumnDef<PositionsRecipeColumnDataElement>[] =
  [
    {
      id: "actions",
      enableHiding: false,
      meta: "",
      cell: ({ row }) => {
        const { setTransactions } = useMarketManager();

        let canForfeit = false;

        if (
          row.original.rewardStyle === 2 &&
          !row.original.isForfeited &&
          Number(Date.now()) < Number(row.original.unlockTimestamp) &&
          !row.original.inputToken.isWithdrawn
        ) {
          canForfeit = true;
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DotsHorizontalIcon className="h-4 w-4 text-secondary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-sm" align="end">
              {canForfeit && (
                <DropdownMenuItem
                  onClick={() => {
                    const txOptions = forfeitRecipePositionTxOptions({
                      chainId: row.original.chainId,
                      weirollWallet: row.original.weirollWallet,
                    });

                    setTransactions(txOptions);
                  }}
                >
                  Forfeit All Royco Incentives for Input Asset
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => {
                  const explorerUrl = getExplorerUrl({
                    chainId: row.original.chainId,
                    value: row.original.weirollWallet,
                    type: "address",
                  });

                  window.open(explorerUrl, "_blank", "noopener,noreferrer");
                }}
              >
                View Weiroll Wallet on{" "}
                {getSupportedChain(row.original.chainId)?.name}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

export const baseRecipeColumns: ColumnDef<PositionsRecipeColumnDataElement>[] =
  [
    {
      accessorKey: "marketValue",
      enableResizing: true,
      enableSorting: false,
      header: "Market Value",
      meta: "text-left",
      cell: ({ row }) => {
        let market_value = 0;

        if (!row.original.inputToken.isWithdrawn) {
          market_value += row.original.inputToken.tokenAmountUsd;
        }

        if (!row.original.isForfeited) {
          for (let i = 0; i < row.original.incentiveTokens.length; i++) {
            if (!row.original.incentiveTokens[i].isClaimed) {
              market_value += row.original.incentiveTokens[i].tokenAmountUsd;
            }
          }
        }

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
      accessorKey: "suppliedAssets",
      enableResizing: true,
      enableSorting: false,
      header: "Supplied Assets",
      meta: "text-left",
      cell: ({ row }) => {
        let supplied_assets = 0;

        if (!row.original.inputToken.isWithdrawn) {
          supplied_assets += row.original.inputToken.tokenAmountUsd;
        }

        return (
          <div className={cn("flex w-fit flex-row items-center gap-2")}>
            <div>{formatNumber(supplied_assets, { type: "currency" })}</div>

            <TokenDisplayer
              size={4}
              tokens={[row.original.inputToken]}
              symbols={true}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "accumulatedIncentives",
      enableResizing: true,
      enableSorting: false,
      header: "Accumulated Incentives",
      meta: "text-left",
      cell: ({ row }) => {
        if (row.original.isForfeited) {
          return <div className={cn("")}>Forfeited</div>;
        }

        if (row.original.incentiveTokens.length > 0) {
          return (
            <div className={cn("flex w-fit flex-row items-center gap-2")}>
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger
                  className={cn("flex cursor-pointer items-end gap-1")}
                >
                  <span>
                    {formatNumber(row.original.incentiveTokens[0].tokenAmount)}
                  </span>

                  <TokenDisplayer
                    size={4}
                    tokens={row.original.incentiveTokens}
                    symbols={true}
                  />
                </HoverCardTrigger>
                {typeof window !== "undefined" &&
                  row.original.incentiveTokens.length > 0 &&
                  createPortal(
                    <HoverCardContent
                      className="min-w-40 p-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {row.original.incentiveTokens.map((item) => (
                        <div
                          key={`incentive-breakdown:${row.original.id}:${item.id}`}
                          className="flex flex-row items-center justify-between font-light"
                        >
                          <TokenDisplayer
                            size={4}
                            tokens={[item]}
                            symbols={true}
                          />

                          {item.tokenAmount && (
                            <div className="ml-2 flex flex-row items-center gap-2 text-sm">
                              {formatNumber(item.tokenAmount)}
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
        }
      },
    },
  ];

export const positionsRecipeColumns: ColumnDef<PositionsRecipeColumnDataElement>[] =
  [...actionsRecipeColumns, ...baseRecipeColumns];
