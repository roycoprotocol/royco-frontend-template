"use client";

import React from "react";
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
import {
  PositionsBoycoColumnDataElement,
  positionsBoycoColumns,
} from "./positions-boyco-columns";
import { motion } from "framer-motion";
import { AlertIndicator } from "@/components/common";

export const PositionsBoycoTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: PositionsBoycoColumnDataElement[];
    isLoading: boolean;
    isRefetching: boolean;
  }
>(({ className, data, isLoading, isRefetching, ...props }, ref) => {
  const table = useReactTable({
    data,
    columns: positionsBoycoColumns,
    getCoreRowModel: getCoreRowModel(),
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

          <tr
            suppressHydrationWarning
            className="absolute bottom-0 left-0 h-[1px] w-full bg-divider"
          />
        </TableHeader>

        <TableBody className={cn("overflow-y-scroll bg-white")}>
          {table.getRowModel().rows?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={positionsBoycoColumns.length}
                className="h-24 text-center"
              >
                <AlertIndicator>No positions found.</AlertIndicator>
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row, index) => {
              return (
                <TableRow
                  key={`list:row:${index}`}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "hover:bg-focus data-[state=selected]:bg-focus"
                  )}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={`row:cell:${cell.id}`}
                      className={cn(
                        "min-w-fit whitespace-nowrap px-3 py-0 text-sm font-light text-black",
                        "h-[4rem]",
                        index === 0 && "pl-5",
                        index !== 0 &&
                          index === row.getVisibleCells().length - 1 &&
                          "pr-5"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, {
                        ...cell.getContext(),
                      })}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
});
