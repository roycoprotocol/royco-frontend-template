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
import { useExplore } from "@/store";

import { motion } from "framer-motion";
import { InfoGrid, InfoTip } from "@/components/common";

import { FallMotion } from "@/components/animations";
import { ScrollArea } from "@radix-ui/react-scroll-area";

/**
 * @description DataTable component props
 */
interface DataTableProps<TData, TValue> {
  columns: TData[];
  data: TData[];
  placeholderDatas: TData[][] | null | undefined;
  view: "grid" | "list";
  props: {
    sorting: SortingState;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  placeholderDatas,
  props,
}: DataTableProps<TData, TValue>) {
  const {
    exploreView: view,
    explorePoolSelected: marketSelected,
    setExplorePoolSelected: setPoolSelected,
    setExplorePageIndex: setPageIndex,
    exploreColumnVisibility: columnVisibility,
    exploreSort,
    setExploreSort,
  } = useExplore();

  const [columnVisibilityChanged, setColumnVisibilityChanged] =
    React.useState(false);

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
    state: {
      // sorting: exploreSort,
      columnVisibility,
    },
    manualPagination: true,
  });

  useEffect(() => {
    setColumnVisibilityChanged(!columnVisibilityChanged);
  }, [columnVisibility]);

  return (
    <Fragment>
      <div
        className={cn(
          "hide-scrollbar relative w-full overflow-y-scroll",
          view === "list" && "rounded-[1.25rem] border border-divider bg-white",
          view === "grid" &&
            "grid grid-cols-1 gap-x-3 lg:grid-cols-2 xl:grid-cols-3"
        )}
      >
        {view === "grid" && (
          <div key="table:grid" className="contents">
            {table.getRowModel().rows.map((row) => {
              const cells = row.getVisibleCells();

              const name = cells.find((cell) => cell.column.id === "name");

              const inputTokenId = cells.find(
                (cell) => cell.column.id === "input_token_id"
              );
              const marketType = cells.find(
                (cell) => cell.column.id === "market_type"
              );
              const lockedQuantityUsd = cells.find(
                (cell) => cell.column.id === "locked_quantity_usd"
              );

              const annualChangeRatio = cells.find(
                (cell) => cell.column.id === "annual_change_ratio"
              );

              const totalIncentivesAmountUsd = cells.find(
                (cell) => cell.column.id === "total_incentive_amounts_usd"
              );

              const chainId = cells.find(
                (cell) => cell.column.id === "chain_id"
              );

              return (
                <motion.a
                  target="_self"
                  rel="noopener noreferrer"
                  href={`/market/${row.original.chain_id}/${row.original.market_type}/${row.original.market_id}`}
                  // onClick={() => {
                  //   window.open(
                  //     `/market/${row.original.chain_id}/${row.original.market_type}/${row.original.market_id}`,
                  //     "_self",
                  //     "noopener,noreferrer"
                  //   );
                  // }}
                  key={`grid:row:${row.id}`}
                  className="relative mb-3 w-full cursor-pointer rounded-[1.25rem] border border-divider bg-white p-5 transition-all duration-200 ease-in-out hover:shadow-md"
                >
                  {!!name && columnVisibility.name && (
                    <FallMotion
                      customKey={`grid:content:${row.original.id}:name`}
                      height="1.75rem"
                    >
                      {flexRender(name.column.columnDef.cell, {
                        ...name.getContext(),
                        placeholderDatas,
                        view,
                      })}
                    </FallMotion>
                  )}

                  {(columnVisibility.input_token_id ||
                    columnVisibility.market_type ||
                    columnVisibility.locked_quantity_usd ||
                    columnVisibility.chain_id) && (
                    <FallMotion
                      containerClassName={cn(columnVisibility.name && "mt-2")}
                      customKey={`grid:content:${row.original.id}:assetsInfo:action:tvl`}
                      noContentWidth
                      contentClassName="flex flex-row items-center space-x-2 place-content-start overflow-x-scroll hide-scrollbar"
                      height="2.45rem"
                    >
                      <ScrollArea className="flex gap-x-2">
                        {!!lockedQuantityUsd &&
                          columnVisibility.locked_quantity_usd &&
                          flexRender(lockedQuantityUsd.column.columnDef.cell, {
                            ...lockedQuantityUsd.getContext(),
                            placeholderDatas,
                            view,
                          })}

                        {!!chainId &&
                          columnVisibility.chain_id &&
                          flexRender(chainId.column.columnDef.cell, {
                            ...chainId.getContext(),
                            placeholderDatas,
                            view,
                          })}

                        {!!inputTokenId &&
                          columnVisibility.input_token_id &&
                          flexRender(inputTokenId.column.columnDef.cell, {
                            ...inputTokenId.getContext(),
                            placeholderDatas,
                            view,
                          })}

                        {!!marketType &&
                          columnVisibility.market_type &&
                          flexRender(marketType.column.columnDef.cell, {
                            ...marketType.getContext(),
                            placeholderDatas,
                            view,
                          })}
                      </ScrollArea>
                    </FallMotion>
                  )}

                  {(columnVisibility.annual_change_ratio ||
                    columnVisibility.total_incentive_amounts_usd) && (
                    <InfoGrid.Container
                      className={cn(
                        columnVisibility.name ||
                          columnVisibility.input_token_id ||
                          columnVisibility.market_type ||
                          columnVisibility.locked_quantity_usd
                          ? "mt-6"
                          : "mt-0",
                        columnVisibility.annual_change_ratio &&
                          columnVisibility.total_incentive_amounts_usd
                          ? "grid-cols-2"
                          : "grid-cols-1",
                        "bg-z2"
                      )}
                    >
                      {!!annualChangeRatio &&
                        columnVisibility.annual_change_ratio && (
                          <InfoGrid.Item>
                            <InfoGrid.Content.Secondary>
                              <div
                                className={InfoGrid.Content.Secondary.Wrapper}
                              >
                                <span
                                  className={InfoGrid.Content.Secondary.Span}
                                >
                                  APR
                                </span>
                              </div>

                              <InfoTip>Annual Percentage Rate</InfoTip>
                            </InfoGrid.Content.Secondary>

                            <FallMotion
                              noContentWidth
                              customKey={`grid:content:${row.original.id}:aip`}
                              height="2.438rem"
                            >
                              {flexRender(
                                annualChangeRatio.column.columnDef.cell,
                                {
                                  ...annualChangeRatio.getContext(),
                                  placeholderDatas,
                                  view,
                                }
                              )}
                            </FallMotion>
                          </InfoGrid.Item>
                        )}

                      {!!totalIncentivesAmountUsd &&
                        columnVisibility.total_incentive_amounts_usd &&
                        (totalIncentivesAmountUsd.row.original as any)
                          .total_incentive_amounts_usd > 0 && (
                          <InfoGrid.Item>
                            <InfoGrid.Content.Secondary>
                              <div
                                className={InfoGrid.Content.Secondary.Wrapper}
                              >
                                <span
                                  className={InfoGrid.Content.Secondary.Span}
                                >
                                  Incentives
                                </span>
                              </div>

                              <InfoTip>Incentives</InfoTip>
                            </InfoGrid.Content.Secondary>

                            <FallMotion
                              noContentWidth
                              customKey={`grid:content:${row.original.id}:rewards`}
                              height="2.438rem"
                            >
                              {flexRender(
                                totalIncentivesAmountUsd.column.columnDef.cell,
                                {
                                  ...totalIncentivesAmountUsd.getContext(),
                                  placeholderDatas,
                                  view,
                                }
                              )}
                            </FallMotion>
                          </InfoGrid.Item>
                        )}
                    </InfoGrid.Container>
                  )}
                </motion.a>
              );
            })}
          </div>
        )}

        {view === "list" && (
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
                            "body-2 shrink-0 px-2 py-4 text-secondary",
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

              <TableBody className={cn("bg-white")}>
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

                    // @ts-ignore
                    const market = row.original.id;

                    return (
                      <TableRow
                        onClick={() => {
                          window.open(
                            `/market/${row.original.chain_id}/${row.original.market_type}/${row.original.market_id}`,
                            "_self",
                            "noopener,noreferrer"
                          );
                        }}
                        // key={`list:row:${row.index}`}
                        data-state={row.getIsSelected() && "selected"}
                        className={cn(
                          "cursor-pointer px-5 hover:bg-focus",
                          rowIndex !== 20 - 1 &&
                            // marketsPerPage
                            "border-b border-divider"
                        )}
                      >
                        {row.getVisibleCells().map(
                          // @ts-ignore
                          // @TODO strict type this
                          (cell, index) => (
                            <TableCell
                              key={`list:cell:${cell.id}`}
                              className={cn(
                                "body-2 min-w-fit truncate text-ellipsis whitespace-nowrap text-primary",
                                index === 0 && "pl-5",
                                index !== 0 &&
                                  index === row.getVisibleCells().length - 1 &&
                                  "pr-5",
                                "h-[3rem]",
                                "py-0"
                              )}
                            >
                              <FallMotion
                                customKey={`list:content:${row.original.id}`}
                                height="3rem"
                                delay={rowIndex * 0.02}
                              >
                                {flexRender(cell.column.columnDef.cell, {
                                  ...cell.getContext(),
                                  placeholderDatas,
                                  view,
                                })}
                              </FallMotion>
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </div>
    </Fragment>
  );
}
