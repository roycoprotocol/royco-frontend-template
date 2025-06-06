"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import {
  marketFiltersAtom,
  marketPageAtom,
} from "@/store/explore/explore-market";
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

export const InputTokenFilter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [filters, setFilters] = useAtom(marketFiltersAtom);
  const [page, setPage] = useAtom(marketPageAtom);

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
      (filter) => filter.id === "chainId"
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
    const chainFilter = filters.find((filter) => filter.id === "chainId");
    return chainFilter
      ? (chainFilter.value as number[]).includes(chainId)
      : false;
  };

  return (
    <div ref={ref} className={cn("flex flex-wrap gap-2", className)} {...props}>
      {chains.map((chain) => (
        <ToggleBadge
          onClick={() => handleChainToggle(chain.id)}
          className={cn(isChainSelected(chain.id) && "bg-focus")}
          key={`filter:input-token:${chain.id}`}
          tokens={[chain]}
        />
      ))}
    </div>
  );
});

InputTokenFilter.displayName = "InputTokenFilter";
