"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { exploreFiltersAtom, explorePageAtom } from "@/store/explore/atoms";
import {
  ArbitrumOne,
  Base,
  Corn,
  EthereumMainnet,
  EthereumSepolia,
  Hyperevm,
  Plume,
  Sonic,
} from "royco/constants";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { ListFilter } from "lucide-react";
import { FilterSelector } from "@/app/explore/common/filter-selector";

export const ChainFilter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [filters, setFilters] = useAtom(exploreFiltersAtom);
  const [page, setPage] = useAtom(explorePageAtom);

  const chainOptions = useMemo(() => {
    return [
      ArbitrumOne,
      Base,
      Corn,
      EthereumMainnet,
      Hyperevm,
      Plume,
      Sonic,
      EthereumSepolia,
    ]
      .filter((chain) => {
        const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG ?? "default";

        let shouldHide = false;

        if (frontendTag !== "dev" && frontendTag !== "testnet") {
          if (chain?.testnet === true) {
            shouldHide = true;
          } else if (chain.id === 98866) {
            shouldHide = true;
          }
        }

        return !shouldHide;
      })
      .map((chain) => ({
        label: chain.name,
        value: chain.id,
      }));
  }, []);

  const handleChainToggle = (chainId: number) => {
    const chainIdFilterIndex = filters.findIndex(
      (filter) => filter.id === "chainId" && filter.condition === "inArray"
    );
    const currentChainIds =
      chainIdFilterIndex !== -1
        ? (filters[chainIdFilterIndex].value as number[])
        : [];

    const newChainIds = currentChainIds.includes(chainId)
      ? currentChainIds.filter((id) => id !== chainId)
      : [...currentChainIds, chainId];

    const newFilters =
      newChainIds.length === 0
        ? filters.filter((filter) => filter.id !== "chainId")
        : [
            ...filters.filter((filter) => filter.id !== "chainId"),
            { id: "chainId", value: newChainIds, condition: "inArray" },
          ];

    setFilters(newFilters);
    setPage(1);
  };

  const isChainSelected = (chainId: number) => {
    const chainFilter = filters.find(
      (filter) => filter.id === "chainId" && Array.isArray(filter.value)
    );
    return chainFilter
      ? (chainFilter.value as number[]).includes(chainId)
      : false;
  };

  const onClearFilter = () => {
    setFilters(filters.filter((filter) => filter.id !== "chainId"));
    setPage(1);
  };

  return (
    <div ref={ref} className={cn("flex flex-wrap gap-2", className)} {...props}>
      <FilterSelector
        data={chainOptions}
        selected={chainOptions
          .filter((chain) => isChainSelected(chain.value))
          .map((chain) => chain.value)}
        onSelect={(id) => handleChainToggle(Number(id))}
        onClear={onClearFilter}
      >
        <PrimaryLabel className="text-sm font-medium text-_primary_">
          Chain
        </PrimaryLabel>

        <ListFilter className="h-5 w-5" />
      </FilterSelector>
    </div>
  );
});
