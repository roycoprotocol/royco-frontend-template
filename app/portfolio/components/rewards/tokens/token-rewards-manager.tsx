"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { TokenRewardsTable } from "./token-rewards-table";
import { TokenRewardsPagination } from "./token-rewards-pagination";
import {
  TokenRewardsColumnDataElement,
  tokenRewardsColumns,
} from "./token-rewards-columns";

interface TokenRewardsManagerProps {
  data: TokenRewardsColumnDataElement[];
}

export const TokenRewardsManager: React.FC<TokenRewardsManagerProps> = ({
  data,
}) => {
  const table = useReactTable({
    data,
    columns: tokenRewardsColumns,
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
      <TokenRewardsTable data={data} table={table} />

      <hr className="border-_divider_" />

      <TokenRewardsPagination table={table} />
    </div>
  );
};
