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
  PositionsRecipeColumnDataElement,
  positionsRecipeColumns,
} from "./positions-recipe-columns";
import { motion } from "framer-motion";

export const PositionsRecipeTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: PositionsRecipeColumnDataElement[];
    columns: typeof positionsRecipeColumns;
  }
>(({ className, data, columns, ...props }, ref) => {
  const table = useReactTable({
    data,
    columns,
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
        </TableHeader>

        <TableBody className={cn("bg-white")}>
          {table.getRowModel().rows?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row, index) => {
              const rowIndex = row.index;

              return (
                <TableRow
                  key={`list:row:${index}`}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "hover:bg-focus data-[state=selected]:bg-focus",
                    rowIndex !== 20 - 1
                  )}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={`row:cell:${cell.id}`}
                      className={cn(
                        "min-w-fit whitespace-nowrap px-3 py-0 text-sm font-normal text-black",
                        "h-[4rem]",
                        index === 0 && "pl-5",
                        index !== 0 &&
                          index === row.getVisibleCells().length - 1 &&
                          "pr-5"
                      )}
                    >
                      {/* <FallMotion
                        customKey={`list:content:${row.original.id}`}
                        height="4rem"
                        delay={rowIndex * 0.02}
                        className="h-full"
                        contentClassName="flex flex-col items-center justify-center"
                      >
                        {flexRender(cell.column.columnDef.cell, {
                          ...cell.getContext(),
                        })}
                      </FallMotion> */}

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
