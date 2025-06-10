"use client";

import React from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import {
  GlobalActivityColumnDataElement,
  globalActivityColumns,
} from "./global-activity-columns";
import { GlobalActivityPagination } from "./global-activity-pagination";
import { GlobalActivityTable } from "./global-acitivity-table";
import {
  loadableActivityAtom,
  portfolioActivityPageIndexAtom,
} from "@/store/portfolio";
import { useAtom, useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import { ActivityResponse } from "royco/api";

export const GlobalActivityManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: ActivityResponse;
  }
>(({ className, data, ...props }, ref) => {
  const [page, setPage] = useAtom(portfolioActivityPageIndexAtom);

  const table = useReactTable({
    data: data.data ?? [],
    columns: globalActivityColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div ref={ref} {...props} className={cn(className)}>
      <GlobalActivityTable data={data.data ?? []} table={table} />

      <hr className="border-_divider_" />

      <GlobalActivityPagination
        count={data.count}
        page={{
          index: page,
          size: data.page.size,
          total: data.page.total,
        }}
        setPage={setPage}
        isRefetching={false}
      />
    </div>
  );
});

GlobalActivityManager.displayName = "GlobalActivityManager";
