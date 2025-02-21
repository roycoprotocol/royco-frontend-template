import { ColumnDef } from "@tanstack/react-table";
import {
  getRecipeForfeitTransactionOptions,
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
import { BigNumber } from "ethers";
import { useActiveMarket } from "../../../hooks";
import { TokenDisplayer } from "@/components/common";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { createPortal } from "react-dom";
import formatNumber from "@/utils/numbers";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
              {can_be_forfeited && (
                <DropdownMenuItem
                  onClick={() => {
                    const txOptions = getRecipeForfeitTransactionOptions({
                      position: row.original,
                    });

                    setTransactions([...transactions, txOptions]);
                  }}
                >
                  Forfeit All Royco Incentives for Input Asset
                </DropdownMenuItem>
              )}

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
            {formatNumber(market_value, {
              type: "currency",
            })}
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
            <div>{formatNumber(input_token_value, { type: "currency" })}</div>

            <TokenDisplayer
              size={4}
              tokens={[row.original.input_token_data] as any}
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
      header: "Accumulated Incentives",
      meta: "text-left",
      cell: ({ row }) => {
        let unclaimed_first_incentive = 0;

        if (row.original.tokens_data.length > 0) {
          unclaimed_first_incentive = row.original.tokens_data[0].token_amount;
        }

        if (row.original.offer_side === 1) {
          return <div className={cn("")}>Not Applicable</div>;
        } else {
          return (
            <div className={cn("flex w-fit flex-row items-center gap-2")}>
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger
                  className={cn("flex cursor-pointer items-end gap-1")}
                >
                  <span>{formatNumber(unclaimed_first_incentive)}</span>

                  <TokenDisplayer
                    size={4}
                    tokens={row.original.tokens_data as any}
                    symbols={true}
                  />
                </HoverCardTrigger>
                {typeof window !== "undefined" &&
                  row.original.tokens_data.length > 0 &&
                  createPortal(
                    <HoverCardContent
                      className="min-w-40 p-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {row.original.tokens_data.map((item) => (
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

        status = "Bridged";

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn("text-success")}>{status}</div>
            </TooltipTrigger>
            {status === "Waiting" && (
              <TooltipContent>
                <span>Waiting to be bridged to dApp after Mainnet Launch</span>
              </TooltipContent>
            )}
          </Tooltip>
        );
      },
    },

    ...baseRecipeColumns,
  ];
