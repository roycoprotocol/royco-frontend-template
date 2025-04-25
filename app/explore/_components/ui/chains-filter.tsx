"use client";

import React, { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useBaseChains } from "royco/hooks";

import { ChainFilterWrapper } from "../composables";
import { explorePageAtom, exploreFiltersAtom } from "@/store/explore/atoms";
import { ToggleBadge } from "@/components/common/toggle-badge";
import { useAtom } from "jotai";

export const ToggleBadgeButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    tokens: {
      id: string;
      image: string;
      symbol: string;
    }[];
  }
>(({ className, tokens, ...props }, ref) => {
  const [filters, setFilters] = useAtom(exploreFiltersAtom);
  const [page, setPage] = useAtom(explorePageAtom);

  return (
    <ToggleBadge
      ref={ref}
      className={cn("", className)}
      {...props}
      tokens={tokens}
    />
  );
});

export const ChainsFilter = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data } = useBaseChains();

  return (
    <Fragment>
      {mounted &&
        data.map((chain) => {
          const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG ?? "default";

          let shouldHide = false;

          if (frontendTag !== "dev" && frontendTag !== "testnet") {
            if (chain?.testnet === true) {
              shouldHide = true;
            } else if (chain.id === 98866) {
              shouldHide = true;
            }
          }

          return (
            <ToggleBadgeButton
              className={cn(shouldHide && "hidden")}
              key={`filter:chains:${chain.id}`}
              tokens={[
                {
                  id: chain.id.toString(),
                  image: chain.image,
                  symbol: chain.symbol,
                },
              ]}
            />
          );
        })}
    </Fragment>
  );
};
