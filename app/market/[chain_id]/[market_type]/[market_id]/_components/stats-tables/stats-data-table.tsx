"use client";

/**
 * @description Imports for tanstack data table
 */
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
} from "@tanstack/react-table";

/**
 * @description Shadcn imports
 */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * @description For changing query params client-side
 */
import { cn } from "@/lib/utils";
import React, { Fragment, useEffect } from "react";

import { motion } from "framer-motion";

import { FallMotion } from "@/components/animations";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @description DataTable component props
 */
interface DataTableProps<TData, TValue> {
  columns: TData[];
  data: TData[];
  placeholderDatas: TData[][] | null | undefined;
  props: {
    sorting: SortingState;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    setPage: (page: number) => void;
  };
}

export function StatsDataTable<TData, TValue>({
  columns,
  data,
  placeholderDatas,
  props,
  pagination: { currentPage, totalPages, setPage },
}: DataTableProps<TData, TValue>) {
  /**
   * @description Tanstack table instance
   */
  const table = useReactTable({
    data,
    // @ts-ignore
    columns,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: true,
    manualPagination: true,
  });

  const isPreviousPage = () => {
    return currentPage > 0;
  };

  const isNextPage = () => {
    return currentPage < totalPages - 1;
  };

  const handlePreviousPage = () => {
    if (isPreviousPage()) {
      setPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (isNextPage()) {
      setPage(currentPage + 1);
    }
  };

  return (
    <Fragment>
      <ScrollArea
        className={cn("relative w-full grow overflow-y-scroll", "bg-white")}
      >
        {/* <div
          className={cn("relative w-full grow overflow-y-scroll", "bg-white")}
        > */}
        <Table className={cn("")}>
          <TableHeader className={cn("sticky top-0 z-10 px-3 ")}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-white hover:bg-focus"
              >
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "shrink-0 px-1 py-2 font-gt text-sm font-light text-secondary",
                        "",
                        // @ts-ignore
                        header.column.columnDef.meta.className,
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

            <tr
              suppressHydrationWarning
              className="absolute bottom-0 left-0 h-[1px] w-full bg-divider"
            />
          </TableHeader>

          <TableBody className={cn("overflow-y-scroll bg-white")}>
            {table.getRowModel().rows?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => {
                const rowIndex = row.index;

                return (
                  <TableRow
                    key={row.original.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "cursor-pointer px-5 hover:bg-focus",
                      rowIndex !== 20 - 1 && "border-b border-divider"
                    )}
                  >
                    {row.getVisibleCells().map(
                      // @ts-ignore
                      // @TODO strict type this
                      (cell, index) => (
                        <TableCell
                          key={`stats-row:${row.original.id}:${cell.id}`}
                          className={cn(
                            "min-w-fit truncate text-ellipsis whitespace-nowrap font-gt text-sm font-light text-black",
                            index === 0 && "pl-5",
                            index !== 0 &&
                              index === row.getVisibleCells().length - 1 &&
                              "pr-5",
                            "h-fit",
                            // "py-[0.813rem]"
                            "py-3"
                          )}
                        >
                          {/* <FallMotion
                              customKey={`list:content:${row.original.id}`}
                              height="auto"
                              delay={rowIndex * 0.02}
                            >
                              {flexRender(cell.column.columnDef.cell, {
                                ...cell.getContext(),
                                placeholderDatas,
                              })}
                            </FallMotion> */}

                          {flexRender(cell.column.columnDef.cell, {
                            ...cell.getContext(),
                            placeholderDatas,
                          })}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {/* </div> */}

        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex w-full flex-row items-center justify-between border-t border-divider p-2">
        <div className="font-gt text-sm font-300 text-secondary">
          Page {currentPage + 1} of {totalPages}
        </div>

        <div className="flex flex-row items-center space-x-2">
          <div
            onClick={handlePreviousPage}
            className={cn(
              "flex h-5 w-5 cursor-pointer flex-col place-content-center items-center rounded-md border border-divider bg-z2 text-secondary hover:text-tertiary",
              "shrink-0 transition-all duration-200 ease-in-out hover:opacity-80",
              !isPreviousPage() && "cursor-not-allowed opacity-50"
            )}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </div>

          <div
            onClick={handleNextPage}
            className={cn(
              "flex h-5 w-5 cursor-pointer flex-col place-content-center items-center rounded-md border border-divider bg-z2 text-secondary hover:text-tertiary",
              "shrink-0 transition-all duration-200 ease-in-out hover:opacity-80",
              !isNextPage() && "cursor-not-allowed opacity-50"
            )}
          >
            <ChevronRightIcon className="h-5 w-5 " />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
