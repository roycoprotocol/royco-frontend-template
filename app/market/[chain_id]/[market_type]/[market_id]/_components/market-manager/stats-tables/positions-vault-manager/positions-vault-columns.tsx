import { ColumnDef } from "@tanstack/react-table";
import { useEnrichedPositionsVault } from "royco/hooks";

import { cn } from "@/lib/utils";
import React from "react";

import { TokenDisplayer } from "@/components/common";
import { createPortal } from "react-dom";
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { HoverCard } from "@/components/ui/hover-card";
import formatNumber from "@/utils/numbers";
import { VaultPosition } from "royco/api";

export type PositionsVaultDataElement = VaultPosition;
export type PositionsVaultColumnDataElement = PositionsVaultDataElement;

export const baseVaultColumns: ColumnDef<PositionsVaultColumnDataElement>[] = [
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

      for (let i = 0; i < row.original.incentiveTokens.length; i++) {
        if (!row.original.incentiveTokens[i].isClaimed) {
          market_value += row.original.incentiveTokens[i].tokenAmountUsd;
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
    accessorKey: "assetsInVault",
    enableResizing: true,
    enableSorting: false,
    header: "Assets in Vault",
    meta: "text-left",
    cell: ({ row }) => {
      let assets_in_vault = 0;

      if (!row.original.inputToken.isWithdrawn) {
        assets_in_vault += row.original.inputToken.tokenAmountUsd;
      }

      return (
        <div className={cn("flex w-fit flex-row items-center gap-2")}>
          <div>{formatNumber(assets_in_vault, { type: "currency" })}</div>

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

export const positionsVaultColumns: ColumnDef<PositionsVaultColumnDataElement>[] =
  [...baseVaultColumns];
