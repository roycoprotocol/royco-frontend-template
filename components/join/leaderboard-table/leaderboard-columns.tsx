import { SpringNumber } from "@/components/composables";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useLeaderboard } from "royco/hooks";

export type LeaderboardDataElement = NonNullable<
  NonNullable<NonNullable<ReturnType<typeof useLeaderboard>>["data"]>["data"]
>[number];

export type LeaderboardColumnDataElement = LeaderboardDataElement & {
  prev: LeaderboardDataElement | null;
};

export const leaderboardColumns: ColumnDef<LeaderboardColumnDataElement>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
    meta: "max-w-24 text-left",
    cell: ({ row }) => {
      const previousValue = row.original.prev?.rank || 0;
      const currentValue = row.original.rank || 0;

      return (
        <div className="text-left">
          <SpringNumber
            previousValue={previousValue}
            currentValue={currentValue}
            numberFormatOptions={{
              style: "decimal",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              useGrouping: true,
            }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Name",
    meta: "text-left",
    cell: ({ row }) => {
      const value = row.original.username || "";

      return <div className="text-left">{value}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Days",
    meta: "text-right max-w-24",
    cell: ({ row }) => {
      const previousRawValue = row.original.prev?.created_at || "0";
      const currentRawValue = row.original.created_at || "0";

      const currentTimestamp = new Date().getTime();
      const previousRawTimestamp = new Date(previousRawValue).getTime();
      const currentRawTimestamp = new Date(currentRawValue).getTime();

      const millisecondsInDay = 1000 * 60 * 60 * 24;

      const previousValue =
        previousRawValue !== "0"
          ? Math.floor(
              (currentTimestamp - previousRawTimestamp) / millisecondsInDay
            )
          : 0;
      const currentValue = Math.floor(
        (currentTimestamp - currentRawTimestamp) / millisecondsInDay
      );

      return (
        <div className="text-right">
          <SpringNumber
            previousValue={previousValue}
            currentValue={currentValue}
            numberFormatOptions={{
              style: "decimal",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              useGrouping: true,
            }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: "Net Worth",
    meta: "text-right",

    cell: ({ row }) => {
      const previousValue = row.original.prev?.balance || 0;
      const currentValue = row.original.balance || 0;

      return (
        <div className="text-right">
          <SpringNumber
            previousValue={previousValue}
            currentValue={currentValue}
            numberFormatOptions={{
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            }}
          />
        </div>
      );
    },
  },
];
