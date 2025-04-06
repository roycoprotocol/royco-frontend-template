"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

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
import { WithdrawalModal } from "./withdrawal-modal";
import { WithdrawalPagination } from "./withdrawal-pagination";

export const WithdrawalsTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    data: any[];
    columns: any[];
    page: number;
    pageSize: number;
    count: number;
    setPage: (page: number) => void;
  }
>(
  (
    { className, data, columns, page, pageSize, count, setPage, ...props },
    ref
  ) => {
    const [opened, setOpened] = useState<Record<number, boolean>>({});

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
        <Table ref={ref} className={cn(className)} {...props}>
          <TableHeader className={cn("sticky top-0 z-10 px-3")}>
            {table.getHeaderGroups().map((item) => (
              <TableRow
                key={item.id}
                className={cn(
                  "w-full bg-white hover:bg-white data-[state=selected]:bg-white"
                )}
              >
                {item.headers.map((header, index) => {
                  const corner =
                    index === 0
                      ? "pl-6"
                      : index === item.headers.length - 1
                        ? "pr-6"
                        : "";

                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "px-4 py-3 text-sm font-normal text-secondary",
                        index === 0 && "text-base text-primary",
                        (header.column.columnDef.meta as any).className,
                        corner
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
                  No withdrawals found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row, index) => {
                return (
                  <React.Fragment key={`list:row:${index}`}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        "group cursor-pointer hover:bg-focus data-[state=selected]:bg-focus",
                        index !== table.getRowModel().rows.length - 1
                      )}
                      onClick={() =>
                        setOpened((prev) => ({
                          ...prev,
                          [index]: true,
                        }))
                      }
                    >
                      {row.getVisibleCells().map((cell, cellIndex) => {
                        const corner =
                          cellIndex === 0
                            ? "pl-6"
                            : cellIndex === row.getVisibleCells().length - 1
                              ? "pr-6"
                              : "";

                        return (
                          <>
                            <TableCell
                              key={`row:cell:${cell.id}`}
                              className={cn(
                                "min-w-fit whitespace-nowrap px-4 py-3 text-sm font-normal text-primary",
                                (cell.column.columnDef.meta as any).className,
                                corner
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

                    <WithdrawalModal
                      isOpen={opened[index]}
                      onOpenModal={(value) =>
                        setOpened((prev) => ({
                          ...prev,
                          [index]: value,
                        }))
                      }
                      withdrawal={row.original}
                    />
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>

        <hr />

        <WithdrawalPagination
          page={page}
          pageSize={pageSize}
          count={count}
          setPage={setPage}
        />
      </motion.div>
    );
  }
);
