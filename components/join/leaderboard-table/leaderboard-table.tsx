"use client";

import React from "react";
import { cn } from "@/lib/utils";

import {
  ColumnDef,
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
  LeaderboardColumnDataElement,
  leaderboardColumns,
  LeaderboardDataElement,
} from "./leaderboard-columns";

import { motion, AnimatePresence } from "framer-motion";
import { FallMotion } from "@/components/animations";

export const LeaderboardTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: LeaderboardColumnDataElement[];
    columns: typeof leaderboardColumns;
  }
>(({ className, data, columns, ...props }, ref) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <motion.div
      key="table:list"
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
        <TableHeader
          className={cn("sticky top-0 z-10 flex w-full flex-col items-center")}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <div className={cn("flex h-fit w-full max-w-2xl flex-col")}>
              <TableRow
                key={headerGroup.id}
                className={cn(
                  "w-full bg-white hover:bg-white data-[state=selected]:bg-white",
                  "flex flex-row"
                )}
              >
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "body-2 shrink-0 px-2 py-4 text-secondary",
                        "h-14 flex-1",
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
            </div>
          ))}

          <tr
            suppressHydrationWarning
            className="absolute bottom-0 left-0 h-[1px] w-full bg-divider"
          />
        </TableHeader>

        <TableBody
          className={cn(
            "flex w-full flex-col items-center bg-white",
            "divide-y divide-divider",
            "max-h-[65vh] overflow-y-scroll"
          )}
        >
          {table.getRowModel().rows?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => {
              const rowIndex = row.index;

              return (
                <div className={cn("flex w-full flex-col items-center")}>
                  <div className={cn("flex h-fit w-full max-w-2xl flex-col")}>
                    <TableRow
                      // key={`list:row:${row.index}`}
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        "hover:bg-white data-[state=selected]:bg-white",
                        rowIndex !== 20 - 1,
                        "flex w-full flex-row"
                      )}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell
                          key={`row:cell:${cell.id}`}
                          className={cn(
                            "body-2 min-w-fit truncate text-ellipsis whitespace-nowrap font-inter text-base font-normal text-black",
                            "h-[3rem]",
                            "py-0",
                            "flex-1",
                            cell.column.columnDef.meta
                          )}
                        >
                          <FallMotion
                            customKey={`row:content:${row.original.rank}`}
                            height="3rem"
                            delay={rowIndex * 0.02}
                            className="h-full"
                            contentClassName="flex flex-col"
                          >
                            {flexRender(cell.column.columnDef.cell, {
                              ...cell.getContext(),
                            })}
                          </FallMotion>
                        </TableCell>
                      ))}
                    </TableRow>
                  </div>
                </div>
              );
            })
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
});
