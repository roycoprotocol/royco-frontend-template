import { ColumnDef } from "@tanstack/react-table";
import { UserLeaderboardInfo } from "royco/api";
import NumberFlow from "@number-flow/react";
import { ContentFlow } from "@/components/animations/content-flow";
import { SpringNumber } from "@/components/composables";

export type LeaderboardColumnDataElement = UserLeaderboardInfo & {
  prevBalanceUsd: number;
};

export const leaderboardColumns: ColumnDef<LeaderboardColumnDataElement>[] = [
  {
    accessorKey: "rank",
    enableResizing: true,
    enableSorting: false,
    header: "Rank",
    meta: "max-w-24 text-left",
    cell: ({ row }) => {
      return (
        <ContentFlow customKey={`row:content:${row.original.rank}:rank`}>
          <div className="text-left">
            <NumberFlow
              value={row.original.rank}
              format={{
                style: "decimal",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                useGrouping: true,
              }}
            />
          </div>
        </ContentFlow>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Name",
    meta: "text-left",
    cell: ({ row }) => {
      return (
        <ContentFlow customKey={`row:content:${row.original.rank}:name`}>
          <div className="text-left">{row.original.name}</div>
        </ContentFlow>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Days",
    meta: "max-w-24 text-center",
    cell: ({ row }) => {
      return (
        <ContentFlow customKey={`row:content:${row.original.rank}:duration`}>
          <NumberFlow
            value={row.original.duration}
            format={{
              style: "decimal",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              useGrouping: true,
            }}
          />
        </ContentFlow>
      );
    },
  },
  {
    accessorKey: "balance",
    header: "Net Worth",
    meta: "text-right",
    cell: ({ row }) => {
      return (
        <ContentFlow customKey={`row:content:${row.original.rank}:balance`}>
          <SpringNumber
            previousValue={row.original.prevBalanceUsd}
            currentValue={row.original.balanceUsd}
            numberFormatOptions={{
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            }}
          />
        </ContentFlow>
      );
    },
  },
];
