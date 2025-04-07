import React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import formatNumber from "@/utils/numbers";
import { TokenDisplayer } from "@/components/common";
import { formatDate } from "date-fns";
import { CustomCircleProgress } from "../../common/custom-circle-progress";

export const marketAllocationColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    enableResizing: true,
    enableSorting: false,
    header: "Market Allocation",
    meta: { className: "text-left w-full py-3 font-medium", align: "left" },
    cell: ({ row }) => {
      return <div className={cn("")}>{row.original.name}</div>;
    },
  },
  {
    accessorKey: "allocationRatio",
    enableResizing: true,
    enableSorting: false,
    header: "Allocation",
    meta: { className: "text-left min-w-32 py-3", align: "left" },
    cell: ({ row }) => {
      return (
        <div className={cn("flex items-center gap-1")}>
          <span>
            {formatNumber(row.original.depositToken.allocationRatio, {
              type: "percent",
            })}
          </span>

          <CustomCircleProgress
            size={16}
            stroke={1.5}
            track="#d9d9d9"
            value={row.original.depositToken.allocationRatio * 100}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "currentSupply",
    enableResizing: true,
    enableSorting: false,
    header: "Current Supply",
    meta: { className: "text-left min-w-40 py-3", align: "left" },
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
    header: "Funds Available",
    meta: { className: "text-left min-w-40 py-3", align: "left" },
    cell: ({ row }) => {
      return (
        <div className={cn("")}>
          {row.original.unlockTimestamp
            ? formatDate(
                Number(row.original.unlockTimestamp) * 1000,
                "MM/dd/yyyy"
              )
            : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "incentiveTokens",
    enableResizing: true,
    enableSorting: false,
    header: "Incentives",
    meta: { className: "text-right min-w-32 py-3", align: "right" },
    cell: ({ row }) => {
      return (
        <div className={cn("")}>
          <TokenDisplayer
            size={4}
            tokens={row.original.incentiveTokens}
            symbols={false}
          />
        </div>
      );
    },
  },
];
