"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  boycoColumns,
  ExploreMarketColumnDataElement,
  exploreMarketColumns,
  sonicColumns,
} from "./columns/explore-market-columns";

export const ExploreMarketTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: ExploreMarketColumnDataElement[];
    isLoading: boolean;
    isRefetching: boolean;
  }
>(({ className, data, isLoading, isRefetching, ...props }, ref) => {
  const exploreColumns = useMemo(() => {
    if (process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco") {
      return boycoColumns;
    }

    if (process.env.NEXT_PUBLIC_FRONTEND_TAG === "sonic") {
      return sonicColumns;
    }

    return exploreMarketColumns;
  }, [exploreMarketColumns]);

  const table = useReactTable({
    data,
    columns: exploreColumns,
    enableSorting: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        ease: "easeInOut",
        duration: 0.2,
      }}
      className="animated-element w-full"
    >
      <Table>
        <TableHeader
          className={cn(
            "[&_tr]:border-b-1 sticky top-0 z-10 [&_tr]:border-_divider_"
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className={cn("bg-white hover:bg-white")}
            >
              {headerGroup.headers.map((header, index) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "px-4 py-3 font-normal text-secondary",
                      header.column.columnDef.meta
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody
          className={cn(
            "bg-white [&_tr:last-child]:border-b [&_tr]:border-b-_divider_"
          )}
        >
          {table.getRowModel().rows?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={exploreColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row, index) => {
              return (
                <Link
                  key={`row:${row.index}`}
                  target="_self"
                  rel="noopener noreferrer"
                  href={`/market/${row.original.chainId}/${row.original.marketType}/${row.original.marketId}`}
                  className="contents"
                >
                  <TableRow
                    key={`list:row:${index}`}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "hover:bg-focus data-[state=selected]:bg-focus",
                      isLoading &&
                        "cursor-disabled animate-pulse duration-500 ease-in-out"
                    )}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={`row:cell:${cell.id}`}
                        className={cn(
                          "min-w-fit whitespace-nowrap px-4 py-0 text-sm font-normal text-black",
                          "h-[3rem]",
                          index === 0 && "pl-5",
                          index !== 0 &&
                            index === row.getVisibleCells().length - 1 &&
                            "pr-5"
                        )}
                      >
                        <div className="flex flex-col items-start justify-center">
                          {flexRender(cell.column.columnDef.cell, {
                            ...cell.getContext(),
                          })}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </Link>
              );
            })
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
});
