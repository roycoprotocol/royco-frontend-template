import React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import formatNumber from "@/utils/numbers";
import { formatDate } from "date-fns";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";
import { CustomCircleProgress } from "@/app/vault/common/custom-circle-progress";
import { GradientText } from "@/app/vault/common/gradient-text";

export const marketAllocationColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    enableResizing: true,
    enableSorting: false,
    header: "ACTIVE MARKETS",
    meta: { className: "text-left w-full", align: "left" },
    cell: ({ row }) => {
      return <div className={cn("")}>{row.original.name}</div>;
    },
  },
  {
    accessorKey: "allocationRatio",
    enableResizing: true,
    enableSorting: false,
    header: "ALLOCATION",
    meta: { className: "text-left min-w-32", align: "left" },
    cell: ({ row }) => {
      return (
        <div className={cn("flex items-center gap-2")}>
          <CustomCircleProgress
            size={20}
            stroke={2}
            track="#D9D9D9"
            color="#0F0E0D"
            value={row.original.depositToken.allocationRatio * 100}
          />

          <span>
            {formatNumber(row.original.depositToken.allocationRatio, {
              type: "percent",
            })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "currentSupply",
    enableResizing: true,
    enableSorting: false,
    header: "CURRENT SUPPLY",
    meta: { className: "text-left min-w-40", align: "left" },
    cell: ({ row }) => {
      return (
        <div className={cn("")}>
          {formatNumber(row.original.depositToken.tokenAmountUsd, {
            type: "currency",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "unlockTimestamp",
    enableResizing: true,
    enableSorting: false,
    header: "FUNDS AVAILABLE",
    meta: { className: "text-left min-w-40", align: "left" },
    cell: ({ row }) => {
      return (
        <div className={cn("")}>
          {row.original.unlockTimestamp
            ? formatDate(
                Number(row.original.unlockTimestamp) * 1000,
                "MM/dd/yyyy"
              )
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "yieldRate",
    enableResizing: true,
    enableSorting: false,
    header: "EST APY",
    meta: { className: "text-left min-w-32", align: "left" },
    cell: ({ row }) => {
      return (
        <div className={cn("")}>
          {row.original.yieldRate ? (
            <PrimaryLabel className="text-base font-normal">
              <GradientText>
                {formatNumber(row.original.yieldRate, {
                  type: "percent",
                })}
              </GradientText>
            </PrimaryLabel>
          ) : (
            "-"
          )}
        </div>
      );
    },
  },
];
