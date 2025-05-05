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
import { Button } from "@/components/ui/button";
import { GradientText } from "@/app/vault/common/gradient-text";

export const tokenRewardsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "amount",
    enableResizing: true,
    enableSorting: false,
    meta: { className: "text-left w-full", align: "left" },
    cell: ({ row }) => {
      let description = "";
      if (row.original.isClaimed) {
        description = "Claimed";
      } else {
        if (row.original.isUnlocked) {
          description = "Claimable";
        } else {
          if (row.original.unlockTimestamp) {
            description = `Unlock at ${formatDate(
              Number(row.original.unlockTimestamp) * 1000,
              "MMM d, yyyy"
            )}`;
          } else {
            description = "-";
          }
        }
      }

      return (
        <div
          className={cn(
            "flex items-center gap-3",
            row.original.isClaimed && "opacity-50"
          )}
        >
          <TokenDisplayer size={6} tokens={[row.original]} symbols={false} />

          <div>
            <PrimaryLabel className="text-base font-normal text-_primary_">
              {`${formatNumber(row.original.tokenAmount, { type: "number" })} ${row.original.symbol}`}
            </PrimaryLabel>

            <SecondaryLabel className="mt-1 text-xs font-normal text-_secondary_">
              <span>{description}</span>
            </SecondaryLabel>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "claim",
    enableResizing: true,
    enableSorting: false,
    header: "",
    meta: { className: "text-right min-w-32", align: "right" },
    cell: ({ row }) => {
      return (
        <div className={cn("flex flex-col items-end")}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-sm font-semibold hover:bg-success/10 hover:text-primary",
              (!row.original.isUnlocked || row.original.isClaimed) &&
                "opacity-50"
            )}
            onClick={() => console.log("claim")}
            disabled={!row.original.isUnlocked || row.original.isClaimed}
          >
            <GradientText>Claim</GradientText>
          </Button>
        </div>
      );
    },
  },
];
