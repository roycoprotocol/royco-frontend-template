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
import { AlertIndicator } from "@/components/common/alert-indicator";

export const DepositTable = React.forwardRef<
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

  return (
    <div className="w-full">
      <Table ref={ref} className={cn(className)} {...props}>
        <TableHeader className={cn("sticky top-0 z-10 [&_tr]:border-b-0")}>
          {table.getHeaderGroups().map((item) => (
            <TableRow
              key={item.id}
              className={cn("w-full hover:bg-transparent")}
            >
              {item.headers.map((header, index) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "px-0 py-3 pr-8 text-xs font-medium text-_secondary_",
                      (header.column.columnDef.meta as any).className
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
            "overflow-y-scroll [&_tr:last-child]:border-b [&_tr]:border-b [&_tr]:border-b-_divider_"
          )}
        >
          {table.getRowModel().rows?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 border-l border-r border-t border-_divider_ text-center"
              >
                <AlertIndicator className="py-10">
                  <span className="text-base">No deposits available</span>
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
                      "group cursor-pointer border-b hover:bg-transparent data-[state=selected]:bg-gray-50",
                      index !== table.getRowModel().rows.length - 1
                    )}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      return (
                        <>
                          <TableCell
                            key={`row:cell:${cell.id}`}
                            className={cn(
                              "min-w-fit whitespace-nowrap px-0 py-4 pr-8 text-base font-normal text-primary",
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
