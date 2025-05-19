import React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import formatNumber from "@/utils/numbers";
import { formatDate } from "date-fns";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";
import { CustomCircleProgress } from "@/app/vault/common/custom-circle-progress";
import { GradientText } from "@/app/vault/common/gradient-text";
import { ContentFlow } from "@/components/animations/content-flow";
import { ExternalLink } from "lucide-react";
import { SupportedChainMap } from "royco/constants";

export const marketAllocationColumns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    enableResizing: true,
    enableSorting: false,
    header: "ACTIVE MARKETS",
    meta: { className: "text-left max-w-60", align: "left" },
    cell: ({ row }) => {
      return (
        <ContentFlow customKey={row.original.id} className="group/link">
          <a href={row.original.link} target="_blank" rel="noreferrer">
            <div className="relative flex items-center pr-5">
              <div className="max-w- z-10 flex-1 overflow-hidden truncate bg-_surface_">
                {row.original.name}
              </div>

              {row.original.link && (
                <ExternalLink className="absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-0 transition-transform duration-300 ease-in-out group-hover/link:translate-x-5 group-hover/link:opacity-100" />
              )}
            </div>
          </a>
        </ContentFlow>
      );
    },
  },
  {
    accessorKey: "chain",
    enableResizing: true,
    enableSorting: false,
    header: "CHAIN",
    meta: { className: "text-left min-w-20", align: "left" },
    cell: ({ row }) => {
      const chainId = row.original?.depositToken?.chainId;
      const chain = SupportedChainMap[chainId];

      return (
        <ContentFlow customKey={row.original.id}>
          {chain ? (
            <div className={cn("flex items-center gap-2")}>
              <img
                src={chain.image}
                alt={chain.name}
                className="h-4 w-4 rounded-full"
              />
              <span className="overflow-hidden truncate">{chain.name}</span>
            </div>
          ) : (
            "-"
          )}
        </ContentFlow>
      );
    },
  },
  {
    accessorKey: "allocationRatio",
    enableResizing: true,
    enableSorting: false,
    header: "ALLOCATION",
    meta: { className: "text-left min-w-20", align: "left" },
    cell: ({ row }) => {
      return (
        <ContentFlow customKey={row.original.id}>
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
        </ContentFlow>
      );
    },
  },
  {
    accessorKey: "currentSupply",
    enableResizing: true,
    enableSorting: false,
    header: "CURRENT SUPPLY",
    meta: { className: "text-left min-w-20", align: "left" },
    cell: ({ row }) => {
      return (
        <ContentFlow customKey={row.original.id}>
          {formatNumber(row.original.depositToken.tokenAmountUsd, {
            type: "currency",
          })}
        </ContentFlow>
      );
    },
  },
  {
    accessorKey: "unlockTimestamp",
    enableResizing: true,
    enableSorting: false,
    header: "FUNDS AVAILABLE",
    meta: { className: "text-left min-w-20", align: "left" },
    cell: ({ row }) => {
      return (
        <ContentFlow customKey={row.original.id}>
          {row.original.unlockTimestamp
            ? formatDate(
                Number(row.original.unlockTimestamp) * 1000,
                "MM/dd/yyyy"
              )
            : "-"}
        </ContentFlow>
      );
    },
  },
  {
    accessorKey: "yieldRate",
    enableResizing: true,
    enableSorting: false,
    header: "EST APY",
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
