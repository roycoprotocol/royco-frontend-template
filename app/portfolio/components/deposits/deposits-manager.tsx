"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { DepositsTable } from "./deposits-table";
import { DepositsPagination } from "./deposits-pagination";
import { DepositsColumnDataElement, depositsColumns } from "./deposits-columns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DepositsManagerProps {
  data: DepositsColumnDataElement[];
}

export const DepositsManager: React.FC<DepositsManagerProps> = ({ data }) => {
  const table = useReactTable({
    data,
    columns: depositsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="flex flex-col">
      <ScrollArea className={cn("mt-6 w-full overflow-hidden")}>
        <ScrollArea className={cn("mt-6 w-full overflow-hidden")}>
          <DepositsTable data={data} table={table} />

          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <hr className="border-_divider_" />

        <DepositsPagination table={table} />
      </ScrollArea>
    </div>
  );
};
