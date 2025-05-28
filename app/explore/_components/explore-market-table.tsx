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
import {
  boycoColumns,
  ExploreMarketColumnDataElement,
  exploreMarketColumns,
  sonicColumns,
} from "./explore-market-columns";
import { motion } from "framer-motion";
import Link from "next/link";

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
        bounce: 0,
      }}
      className="animated-element w-full"
    >
      <Table className={cn("")}>
        <TableHeader className={cn("sticky top-0 z-10 px-3")}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className={cn(
                "w-full bg-white hover:bg-white data-[state=selected]:bg-white"
              )}
            >
              {headerGroup.headers.map((header, index) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "px-3 py-2 font-normal text-secondary",
                      header.column.columnDef.meta,
                      index === 0 && "pl-5",
                      index !== 0 &&
                        index === headerGroup.headers.length - 1 &&
                        "pr-5"
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

        <TableBody className={cn("bg-white")}>
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
                      row.index !== 20 - 1,
                      isLoading &&
                        "cursor-disabled animate-pulse duration-500 ease-in-out"
                    )}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={`row:cell:${cell.id}`}
                        className={cn(
                          "min-w-fit whitespace-nowrap px-3 py-0 text-sm font-normal text-black",
                          "h-[3rem]",
                          index === 0 && "pl-5",
                          index !== 0 &&
                            index === row.getVisibleCells().length - 1 &&
                            "pr-5"
                        )}
                      >
                        <div className="flex flex-col items-center justify-center">
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
