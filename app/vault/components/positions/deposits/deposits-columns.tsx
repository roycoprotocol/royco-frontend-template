import React from "react";

import { ColumnDef } from "@tanstack/react-table";

import formatNumber from "@/utils/numbers";
import { formatDate } from "date-fns";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";
import { GradientText } from "@/app/vault/common/gradient-text";
import { ContentFlow } from "@/components/animations/content-flow";
import { BoringPosition } from "royco/api";
import { TokenDisplayer } from "@/components/common/token-displayer";

export type DepositColumnDataElement = BoringPosition;

export const depositsColumns: ColumnDef<DepositColumnDataElement>[] = [
  {
    accessorKey: "position",
    enableResizing: true,
    enableSorting: false,
    header: "POSITION",
    meta: { className: "text-left max-w-60", align: "left" },
    cell: ({ row }) => {
      return (
        <ContentFlow customKey={row.original.id} className="group/link">
          <div className="relative flex items-center gap-2 pr-5">
            <TokenDisplayer
              size={6}
              tokens={[row.original.depositToken]}
              symbols={false}
            />
            {formatNumber(row.original.depositToken.tokenAmount, {
              type: "number",
            }) +
              " " +
              row.original.depositToken.symbol}
          </div>
        </ContentFlow>
      );
    },
  },
  {
    accessorKey: "estimatedEarningTimestamp",
    enableResizing: true,
    enableSorting: false,
    header: "EST. EARNING START DATE",
    meta: { className: "text-right min-w-20", align: "right" },
    cell: ({ row }) => {
      return (
        <ContentFlow customKey={row.original.id}>
          {row.original.estimatedEarningTimestamp !== "0"
            ? formatDate(
                Number(row.original.estimatedEarningTimestamp) * 1000,
                "MM/dd/yyyy"
              )
            : "-"}
        </ContentFlow>
      );
    },
  },
  {
    accessorKey: "estimatedWithdrawalTimestamp",
    enableResizing: true,
    enableSorting: false,
    header: "DATE FOR WITHDRAWAL + REWARDS",
    meta: { className: "text-right min-w-20", align: "right" },
    cell: ({ row }) => {
      return (
        <ContentFlow customKey={row.original.id}>
          {row.original.estimatedWithdrawalTimestamp !== "0"
            ? formatDate(
                Number(row.original.estimatedWithdrawalTimestamp) * 1000,
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
    header: "ESTIMATED APY",
    meta: { className: "text-right min-w-20", align: "right" },
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
