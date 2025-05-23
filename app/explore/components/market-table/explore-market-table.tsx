"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
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
  ExploreMarketColumnDataElement,
  exploreMarketColumnNames,
  exploreMarketColumns,
} from "./columns/explore-market-columns";
import { AlertIndicator } from "@/components/common/alert-indicator";
import { useAtomValue } from "jotai";
import { tagAtom } from "@/store/protector/protector";
import { useExploreMarket } from "@/store/explore/use-explore-market";

export const ExploreMarketTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: ExploreMarketColumnDataElement[];
    isLoading: boolean;
  }
>(({ className, data, isLoading, ...props }, ref) => {
  const tag = useAtomValue(tagAtom);
  const { hiddenTableColumns } = useExploreMarket();

  const columns = useMemo(() => {
    let type = "default";
    if (tag === "boyco") {
      type = "boyco";
    }
    if (tag === "sonic") {
      type = "sonic";
    }
    if (tag === "plume") {
      type = "plume";
    }
    const columnNames = Object.entries(exploreMarketColumnNames)
      .filter(([key, value]) => value.type.includes(type))
      .map(([key, value]) => {
        return key;
      });

    return exploreMarketColumns.filter((column) =>
      columnNames.includes((column as any).accessorKey)
    );
  }, [tag]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      columnVisibility: hiddenTableColumns.reduce(
        (acc, column) => {
          acc[column] = false;
          return acc;
        },
        {} as Record<string, boolean>
      ),
    },
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
            "sticky top-0 z-10 [&_tr]:border-b [&_tr]:border-_divider_"
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className={cn("bg-_surface_ hover:bg-transparent")}
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

        <TableBody className={cn("bg-_surface_")}>
          {table.getRowModel().rows?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <AlertIndicator className="py-10">
                  No markets found.
                </AlertIndicator>
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
                          "whitespace-nowrap p-4 pr-8 text-base font-normal text-_primary_",
                          cell.column.columnDef.meta
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, {
                          ...cell.getContext(),
                        })}
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
