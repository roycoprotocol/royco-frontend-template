import React from "react";
import { capitalize } from "lodash";

import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { TokenDisplayer } from "@/components/common";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import formatNumber from "@/utils/numbers";
import { formatDate } from "date-fns";

export const withdrawalsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "amount",
    enableResizing: true,
    enableSorting: false,
    header: "Withdrawal Activity",
    meta: { className: "text-left w-full py-3 font-medium", align: "left" },
    cell: ({ row }) => {
      return (
        <div className={cn("flex items-center gap-2")}>
          <TokenDisplayer
            size={6}
            tokens={[row.original.token]}
            symbols={false}
          />

          <div>
            <PrimaryLabel className="text-sm font-normal">
              Withdraw {row.original.token.symbol}
            </PrimaryLabel>

            <SecondaryLabel className="mt-px font-normal">
              {formatNumber(
                row.original.amountInBaseAsset,
                {
                  type: "number",
                },
                {
                  average: false,
                }
              )}
            </SecondaryLabel>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    enableResizing: true,
    enableSorting: false,
    header: "",
    meta: { className: "text-right min-w-32 py-3", align: "right" },
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div className={cn("flex flex-col items-end")}>
          <PrimaryLabel
            className={cn(
              "text-sm font-normal",
              status === "initiated" && "text-primary",
              status === "completed" && "text-success",
              (status === "expired" || status === "canceled") && "text-error"
            )}
          >
            {capitalize(row.original.status)}
          </PrimaryLabel>

          <SecondaryLabel className="mt-px font-normal">
            {formatDate(row.original.createdAt * 1000, "MMM d")}
          </SecondaryLabel>
        </div>
      );
    },
  },
];
