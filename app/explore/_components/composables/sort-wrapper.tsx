"use client";

import React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { TokenBadge } from "@/components/common";

interface SortWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  currentSortKey: string;
  currentSortValue: string;
}

const SortWrapper = React.forwardRef<HTMLDivElement, SortWrapperProps>(
  (
    { className, children, currentSortKey, currentSortValue, ...props },
    ref
  ) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const doSortExists = (): boolean => {
      const sortKey = searchParams.get("sortKey");

      if (sortKey === undefined || sortKey !== currentSortKey) {
        return false;
      }

      return true;
    };

    const setSort = () => {
      const params = new URLSearchParams(searchParams.toString());

      const sortKey = searchParams.get("sortKey");
      const sortDirection = searchParams.get("sortDirection");

      if (sortKey === null || sortKey !== currentSortKey) {
        params.set("sortKey", currentSortKey);

        if (sortDirection === null) {
          params.set("sortDirection", "desc");
        }
      } else {
        params.delete("sortKey");
      }

      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    };

    return (
      <TokenBadge
        onClick={() => setSort()}
        className={cn("normal-case", doSortExists() === true ? "bg-focus" : "")}
        token={{
          symbol: currentSortValue,
        }}
      />
    );
  }
);
SortWrapper.displayName = "SortWrapper";

export { SortWrapper };
