"use client";

import React, { use, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";

import { WithdrawalsTable } from "./withdrawals-table";
import { withdrawalsColumns } from "./withdrawals-column";
import { vaultManagerAtom } from "@/store/vault/vault-manager";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";

export const DEFAULT_PAGE_SIZE = 5;

export const Withdrawals = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const vault = useAtomValue(vaultManagerAtom);

  const [page, setPage] = useState(0);

  const data = useMemo(() => {
    if (vault?.account?.withdrawals) {
      return vault?.account?.withdrawals.slice(
        page * DEFAULT_PAGE_SIZE,
        (page + 1) * DEFAULT_PAGE_SIZE
      );
    }
    return [];
  }, [vault?.account?.withdrawals, page]);

  const count = vault?.account?.withdrawals?.length || 0;

  if (count === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      {...props}
      className={cn("hide-scrollbar overflow-x-auto", className)}
    >
      <PrimaryLabel className="text-2xl text-_primary_">
        Withdrawals
      </PrimaryLabel>

      <div className="mt-6">
        <WithdrawalsTable
          data={data}
          columns={withdrawalsColumns}
          page={page}
          pageSize={DEFAULT_PAGE_SIZE}
          count={count}
          setPage={setPage}
        />
      </div>
    </div>
  );
});
