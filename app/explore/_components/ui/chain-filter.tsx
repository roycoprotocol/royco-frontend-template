"use client";

import React from "react";
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
import { ToggleBadge } from "@/components/common/toggle-badge";

export const ChainFilter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [filters, setFilters] = useAtom(exploreFiltersAtom);
  const [page, setPage] = useAtom(explorePageAtom);

  const chains = [
    ArbitrumOne,
    Base,
    Corn,
    EthereumMainnet,
    Hyperevm,
    Plume,
    Sonic,
    EthereumSepolia,
  ];

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

  return (
    <div ref={ref} className={cn("flex flex-wrap gap-2", className)} {...props}>
      {chains.map((chain) => {
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
          <ToggleBadge
            onClick={() => handleChainToggle(chain.id)}
            className={cn(
              shouldHide && "hidden",
              isChainSelected(chain.id) && "bg-focus"
            )}
            key={`filter:chains:${chain.id}`}
            tokens={[chain]}
          />
        );
      })}
    </div>
  );
});

ChainFilter.displayName = "ChainFilter";
