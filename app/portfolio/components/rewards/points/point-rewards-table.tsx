"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { AlertIndicator } from "@/components/common";

export const PointRewardsTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    data: any[];
    columns: any[];
  }
>(({ className, data, columns, ...props }, ref) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log({ data });

  return (
    <div className="w-full">
      <Table ref={ref} className={cn(className)} {...props}>
        <TableBody
          className={cn("min-h-80 overflow-y-scroll [&_tr]:border-b-_divider_")}
        >
          {table.getRowModel().rows?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 border-l border-r border-t border-_divider_ text-center"
              >
                <AlertIndicator className="py-10">
                  <span className="text-base">No withdrawals available</span>
                </AlertIndicator>
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row, index) => {
              return (
                <React.Fragment key={`list:row:${index}`}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "group cursor-pointer hover:bg-gray-50 data-[state=selected]:bg-gray-50",
                      index !== table.getRowModel().rows.length - 1
                    )}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      return (
                        <>
                          <TableCell
                            key={`row:cell:${cell.id}`}
                            className={cn(
                              "min-w-fit whitespace-nowrap px-0 py-4 text-base font-normal text-primary",
                              (cell.column.columnDef.meta as any).className
                            )}
                          >
                            <div
                              className={cn(
                                "flex items-center gap-1",
                                (cell.column.columnDef.meta as any).align ===
                                  "right" && "justify-end",
                                (cell.column.columnDef.meta as any).align ===
                                  "left" && "justify-start",
                                (cell.column.columnDef.meta as any).align ===
                                  "center" && "justify-center"
                              )}
                            >
                              {flexRender(cell.column.columnDef.cell, {
                                ...cell.getContext(),
                              })}
                            </div>
                          </TableCell>
                        </>
                      );
                    })}
                  </TableRow>
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
});
