import React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import formatNumber from "@/utils/numbers";

export const vaultAllocationColumns: ColumnDef<any>[] = [
  {
    accessorKey: "market_allocation",
    enableResizing: true,
    enableSorting: false,
    header: "Market Allocation",
    meta: "text-left w-full",
    cell: ({ row }) => {
      return <div className={cn("")}>Swap USDC to stkGHO for 1mo</div>;
    },
  },
  {
    accessorKey: "allocation_percentage",
    enableResizing: true,
    enableSorting: false,
    header: "Allocation %",
    meta: "text-left min-w-48",
    cell: ({ row }) => {
      return <div className={cn("")}>33.34%</div>;
    },
  },
  {
    accessorKey: "current_supply",
    enableResizing: true,
    enableSorting: false,
    header: "Current Supply",
    meta: "text-left min-w-48",
    cell: ({ row }) => {
      return (
        <div className={cn("min-w")}>
          {formatNumber(512215.42, { type: "currency" })}
        </div>
      );
    },
  },
  {
    accessorKey: "incentives",
    enableResizing: true,
    enableSorting: false,
    header: "Incentives",
    meta: "text-right min-w-48",
    cell: ({ row }) => {
      return <div className={cn("")}>--</div>;
    },
  },
];
