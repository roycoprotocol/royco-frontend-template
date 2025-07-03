"use client";

import React, { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  marketFiltersAtom,
  marketPageAtom,
} from "@/store/explore/explore-market";
import {
  ArbitrumOne,
  Base,
  EthereumMainnet,
  EthereumSepolia,
  Hyperevm,
  Plume,
  Sonic,
  SupportedChainMap,
} from "royco/constants";
import { PrimaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { ListFilter } from "lucide-react";
import { FilterSelector } from "@/app/explore/common/filter-selector";
import { tagAtom } from "@/store/protector/protector";
import { useMixpanel } from "@/services/mixpanel/use-mixpanel";

const FILTER_ID = "chainId";

const exploreChains = [EthereumMainnet, EthereumSepolia, Base, Plume, Sonic];

export const ChainFilter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { trackExploreChainChanged } = useMixpanel();

  const tag = useAtomValue(tagAtom);
  const [filters, setFilters] = useAtom(marketFiltersAtom);
  const setExploreMarketPage = useSetAtom(marketPageAtom);

  const selectOptions = useMemo(() => {
    return Object.values(exploreChains)
      .filter((item) => {
        if (tag !== "dev" && tag !== "testnet") {
          if (item?.testnet === true) {
            return false;
          }
        }
        return true;
      })
      .map((item) => ({
        label: item.name,
        value: item.id,
        icon: (
          <img
            src={item.image}
            alt={item.name}
            width={20}
            height={20}
            className="mr-1 rounded-full"
          />
        ),
      }));
  }, [tag]);

  const allOptions = useMemo(() => {
    return [...selectOptions];
  }, [selectOptions]);

  const doFilterExists = (id: number) => {
    const chainFilter = filters.find((item) => item.id === FILTER_ID);
    if (!chainFilter) return false;

    return (chainFilter.value as number[]).includes(id);
  };

  const addFilter = (id: number) => {
    if (doFilterExists(id)) return;

    let chainFilter = filters.find((item) => item.id === FILTER_ID);
    if (!chainFilter) {
      chainFilter = {
        id: FILTER_ID,
        value: [],
        condition: "inArray",
      };
    }

    const newFilters = filters.filter((item) => item.id !== FILTER_ID);
    newFilters.push({
      ...chainFilter,
      value: [...(chainFilter.value as number[]), id],
    });

    setFilters(newFilters);
  };

  const removeFilter = (id: number) => {
    if (!doFilterExists(id)) return;

    let chainFilter = filters.find((item) => item.id === FILTER_ID);
    if (!chainFilter) return;

    const newFilters = filters.filter((item) => item.id !== FILTER_ID);
    newFilters.push({
      ...chainFilter,
      value: (chainFilter.value as number[]).filter((value) => value !== id),
    });

    setFilters(newFilters);
  };

  const handleToggle = (id: number) => {
    if (doFilterExists(id)) {
      removeFilter(id);
    } else {
      addFilter(id);
    }
    setExploreMarketPage(1);
  };

  const onClearFilter = () => {
    setFilters(filters.filter((filter) => filter.id !== FILTER_ID));
    setExploreMarketPage(1);
  };

  const selectedOptions = useMemo(() => {
    return allOptions.filter((option) => doFilterExists(option.value));
  }, [allOptions, filters]);

  useEffect(() => {
    trackExploreChainChanged({
      chains: selectedOptions.map((option) => option.value),
    });
  }, [selectedOptions]);

  return (
    <div ref={ref} className={cn("flex flex-wrap gap-2", className)} {...props}>
      <FilterSelector
        data={selectOptions}
        selected={selectedOptions.map((item) => item.value)}
        onSelect={(id) => handleToggle(Number(id))}
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
