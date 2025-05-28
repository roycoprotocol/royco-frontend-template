import React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import formatNumber from "@/utils/numbers";
import { formatDate } from "date-fns";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";
import { GradientText } from "@/app/vault/common/gradient-text";
import { ContentFlow } from "@/components/animations/content-flow";
import { ExternalLink } from "lucide-react";
import { TokenDisplayer } from "@/components/common";
import validator from "validator";

export const depositColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    enableResizing: true,
    enableSorting: false,
    header: "MARKET / VAULT",
    meta: { className: "text-left max-w-96", align: "left" },
    cell: ({ row }) => {
      return (
        <ContentFlow customKey={row.original.id} className="group/link w-full">
          <div className="flex items-center gap-2">
            <TokenDisplayer
              size={6}
              tokens={[row.original.depositToken]}
              symbols={false}
            />

            <a
              href={row.original.marketLink}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden"
            >
              <div className="flex items-center pr-5">
                <div className="z-10 overflow-hidden text-ellipsis whitespace-nowrap bg-_surface_">
                  {validator.unescape(row.original.name)}
                </div>

                {row.original.marketLink && (
                  <ExternalLink className="h-4 w-4 shrink-0 opacity-0 transition-transform duration-300 ease-in-out group-hover/link:translate-x-2 group-hover/link:opacity-100" />
                )}
              </div>
            </a>
          </div>
        </ContentFlow>
      );
    },
  },
  {
    accessorKey: "position",
    enableResizing: true,
    enableSorting: false,
    header: "POSITION",
    meta: { className: "text-left w-full", align: "left" },
    cell: ({ row }) => {
      return (
        <ContentFlow customKey={row.original.id}>
          <div className={cn("flex items-center gap-2")}>
            <span>
              {formatNumber(row.original.depositToken.tokenAmount, {
                type: "number",
              })}
            </span>

            <span>{row.original.depositToken.symbol}</span>
          </div>
        </ContentFlow>
      );
    },
  },
  {
    accessorKey: "unlockTimestamp",
    enableResizing: true,
    enableSorting: false,
    header: "AVAILABILITY",
    meta: { className: "text-left min-w-20", align: "left" },
    cell: ({ row }) => {
      if (row.original.isUnlocked) {
        return (
          <ContentFlow customKey={row.original.id}>
            <span>Unlocked</span>
          </ContentFlow>
        );
      }

      return (
        <ContentFlow customKey={row.original.id}>
          {formatDate(
            Number(row.original.unlockTimestamp) * 1000,
            "MM/dd/yyyy"
          )}
        </ContentFlow>
      );
    },
  },
  {
    accessorKey: "yieldRate",
    enableResizing: true,
    enableSorting: false,
    header: "APY",
    meta: { className: "text-left min-w-20", align: "left" },
    cell: ({ row }) => {
      return (
        <ContentFlow customKey={row.original.id}>
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
        </ContentFlow>
      );
    },
  },
];
