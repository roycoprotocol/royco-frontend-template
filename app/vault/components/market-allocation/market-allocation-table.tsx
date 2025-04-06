"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronsUpDown } from "lucide-react";

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
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { TokenDisplayer } from "@/components/common";
import formatNumber from "@/utils/numbers";
import { SlideUpWrapper } from "@/components/animations";

export const MarketAllocationTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    data: any[];
    columns: any[];
  }
>(({ className, data, columns, ...props }, ref) => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({
    0: true,
  });

  const toggleRowDetails = (index: number) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No allocations found.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row, index) => {
              const open = expanded[index];

              return (
                <React.Fragment key={`list:row:${index}`}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "group cursor-pointer hover:bg-focus data-[state=selected]:bg-focus",
                      index !== table.getRowModel().rows.length - 1
                    )}
                    onClick={() => toggleRowDetails(index)}
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

                              {cellIndex ===
                                row.getVisibleCells().length - 1 && (
                                <motion.div
                                  animate={{ rotate: open ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="ml-1"
                                >
                                  <ChevronsUpDown className="h-4 w-4 text-secondary" />
                                </motion.div>
                              )}
                            </div>
                          </TableCell>
                        </>
                      );
                    })}
                  </TableRow>

                  <AnimatePresence>
                    {open && (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1}>
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex flex-col gap-4 py-2">
                              {data[index].incentiveTokens.map(
                                (reward: any, index: number) => {
                                  return (
                                    <SlideUpWrapper
                                      key={reward.id}
                                      delay={index * 0.1}
                                    >
                                      <div className="flex items-start justify-between pl-8 pr-11">
                                        <div className="flex items-center gap-2">
                                          <TokenDisplayer
                                            size={4}
                                            tokens={[reward]}
                                            symbols={false}
                                          />

                                          <PrimaryLabel className="text-sm font-normal">
                                            {reward.name}
                                          </PrimaryLabel>
                                        </div>

                                        <PrimaryLabel className="text-sm text-success">
                                          {(() => {
                                            if (reward.yieldRate) {
                                              return formatNumber(
                                                reward.yieldRate,
                                                {
                                                  type: "percent",
                                                }
                                              );
                                            }

                                            if (
                                              reward.yieldRate === 0 &&
                                              reward.tokenAmount
                                            ) {
                                              return `${formatNumber(
                                                reward.tokenAmount,
                                                {
                                                  type: "number",
                                                }
                                              )} ${reward.symbol}`;
                                            }

                                            if (reward.yieldText) {
                                              return reward.yieldText;
                                            }

                                            return;
                                          })()}
                                        </PrimaryLabel>
                                      </div>
                                    </SlideUpWrapper>
                                  );
                                }
                              )}
                            </div>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
});
