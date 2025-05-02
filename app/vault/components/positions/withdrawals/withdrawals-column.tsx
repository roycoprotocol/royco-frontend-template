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
import { TriangleAlertIcon } from "lucide-react";

export const withdrawalsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "amount",
    enableResizing: true,
    enableSorting: false,
    header: "Withdrawal Activity",
    meta: { className: "text-left w-full", align: "left" },
    cell: ({ row }) => {
      return (
        <div className={cn("flex items-center gap-3")}>
          <TokenDisplayer
            size={6}
            tokens={[row.original.token]}
            symbols={false}
          />

          <div>
            <PrimaryLabel className="text-base font-normal text-_primary_">
              Withdraw {row.original.token.symbol}
            </PrimaryLabel>

            <SecondaryLabel className="mt-1 text-xs font-normal text-_secondary_">
              <div className="flex items-center gap-3">
                {formatDate(row.original.createdAt, "MMM d")}

                {row.original.status === "expired" && (
                  <div className="flex items-center gap-1 rounded-full border border-amber-500 px-1 py-px text-xs font-medium text-amber-500">
                    <TriangleAlertIcon className="h-3 w-3" />
                    <span>Recover vault shares to prevent loss.</span>
                  </div>
                )}
              </div>
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
    meta: { className: "text-right min-w-32", align: "right" },
    cell: ({ row }) => {
      return (
        <div className={cn("flex flex-col items-end")}>
          <PrimaryLabel className={cn("text-base font-normal text-_primary_")}>
            {formatNumber(
              row.original.amountInBaseAsset,
              {
                type: "number",
              },
              {
                average: false,
              }
            )}
          </PrimaryLabel>

          <SecondaryLabel className="mt-1 text-sm font-normal text-_secondary_">
            {capitalize(row.original.status)}
          </SecondaryLabel>
        </div>
      );
    },
  },
];
