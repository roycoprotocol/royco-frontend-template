"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { PointRewardsTable } from "./point-rewards-table";
import { PointRewardsPagination } from "./point-rewards-pagination";
import {
  PointRewardsColumnDataElement,
  pointRewardsColumns,
} from "./point-rewards-columns";

interface PointRewardsManagerProps {
  data: PointRewardsColumnDataElement[];
}

export const PointRewardsManager: React.FC<PointRewardsManagerProps> = ({
  data,
}) => {
  const table = useReactTable({
    data,
    columns: pointRewardsColumns,
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
      <PointRewardsTable data={data} table={table} />

      <hr className="border-_divider_" />

      <PointRewardsPagination table={table} />
    </div>
  );
};
