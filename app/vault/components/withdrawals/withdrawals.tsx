"use client";

import React, { use, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";

import { WithdrawalsTable } from "./withdrawals-table";
import { withdrawalsColumns } from "./withdrawals-column";
import { vaultManagerAtom } from "@/store/vault/vault-manager";

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

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "hide-scrollbar min- overflow-x-auto rounded-2xl border border-divider bg-white pt-3",
        className
      )}
    >
      <WithdrawalsTable
        data={data}
        columns={withdrawalsColumns}
        page={page}
        pageSize={DEFAULT_PAGE_SIZE}
        count={count}
        setPage={setPage}
      />
    </div>
  );
});
