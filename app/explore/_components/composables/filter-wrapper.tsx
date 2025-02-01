"use client";

import React from "react";

import { cn } from "@/lib/utils";
import type { MarketFilter } from "royco/queries";
import { TokenBadge } from "@/components/common";
import { useExplore } from "@/store";

interface FilterWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  filter: MarketFilter;
  token: {
    id?: string;
    image?: string;
    symbol: string;
    ids?: Array<string>;
  };
}

const FilterWrapper = React.forwardRef<HTMLDivElement, FilterWrapperProps>(
  ({ className, children, filter, token, ...props }, ref) => {
    const { exploreFilters, setExploreFilters, setExplorePageIndex } =
      useExplore();

    const doFilterExists = ({ id, value }: MarketFilter): [boolean, number] => {
      for (let i = 0; i < exploreFilters.length; i++) {
        if (
          exploreFilters[i].id === id &&
          exploreFilters[i].value.toString() === value.toString()
        ) {
          return [true, i];
        }
      }

      return [false, -1];
    };

    const setFilter = (filter: MarketFilter) => {
      const filters = [...exploreFilters];

      const [filterExists, filterIndex] = doFilterExists({
        id: filter.id,
        value: filter.value,
      });

      if (filterExists && filterIndex !== -1 && filterIndex < filters.length) {
        filters.splice(filterIndex, 1);
      } else {
        filters.push(filter);
      }

      setExploreFilters(filters);
      setExplorePageIndex(0);
    };

    return (
      <TokenBadge
        onClick={() => setFilter(filter)}
        className={cn(doFilterExists(filter)[0] === true ? "bg-focus" : "")}
        token={token}
      />
    );
  }
);
FilterWrapper.displayName = "FilterWrapper";

const ChainFilterWrapper = React.forwardRef<HTMLDivElement, FilterWrapperProps>(
  ({ className, children, filter, token, ...props }, ref) => {
    const { exploreFilters, setExploreFilters, setExplorePageIndex } =
      useExplore();

    const doFilterExists = ({ id, value }: MarketFilter): [boolean, number] => {
      for (let i = 0; i < exploreFilters.length; i++) {
        if (
          exploreFilters[i].id === id &&
          exploreFilters[i].value.toString() === value.toString() &&
          exploreFilters[i].condition === undefined
        ) {
          return [true, i];
        }
      }

      return [false, -1];
    };

    const setFilter = (filter: MarketFilter) => {
      const filters = [...exploreFilters];

      const [filterExists, filterIndex] = doFilterExists({
        id: filter.id,
        value: filter.value,
      });

      if (filterExists && filterIndex !== -1 && filterIndex < filters.length) {
        filters.splice(filterIndex, 1);
      } else {
        filters.push(filter);
      }

      setExploreFilters(filters);
      setExplorePageIndex(0);
    };

    return (
      <TokenBadge
        onClick={() => setFilter(filter)}
        className={cn(
          exploreFilters.some(
            (f) =>
              f.id === filter.id &&
              f.value === filter.value &&
              f.condition === undefined
          )
            ? "bg-focus"
            : ""
        )}
        token={token}
      />
    );
  }
);
ChainFilterWrapper.displayName = "ChainFilterWrapper";

const PoolTypeFilterWrapper = React.forwardRef<
  HTMLDivElement,
  FilterWrapperProps
>(({ className, children, filter, token, ...props }, ref) => {
  const { exploreFilters, setExploreFilters, setExplorePageIndex } =
    useExplore();

  const doFilterExists = ({
    id,
    matches = [],
  }: MarketFilter): [boolean, number[]] => {
    let filterIndexArray: number[] = [];
    for (let i = 0; i < matches.length; i++) {
      const index = exploreFilters.findIndex(
        (f) => f.id === id && f.value.toString() === matches[i].toString()
      );
      if (index === -1) {
        filterIndexArray = [];
        break;
      }
      filterIndexArray.push(index);
    }

    if (matches.length === 0 || filterIndexArray.length === 0) {
      return [false, []];
    }

    return [true, filterIndexArray];
  };

  const setFilter = (filter: MarketFilter) => {
    const filters: (MarketFilter | null)[] = [...exploreFilters];

    const [filterExists, filterIndexArray] = doFilterExists({
      id: filter.id,
      value: filter.value,
      matches: filter.matches,
    });

    if (filterExists && filterIndexArray.length > 0) {
      for (let i = 0; i < filterIndexArray.length; i++) {
        filters.splice(filterIndexArray[i], 1, null);
      }
    } else {
      if (filter.matches) {
        for (let i = 0; i < filter.matches.length; i++) {
          filters.push({
            id: filter.id,
            value: filter.matches[i],
          });
        }
      }
    }

    setExploreFilters(filters.filter((f) => f !== null));
    setExplorePageIndex(0);
  };

  return (
    <TokenBadge
      onClick={() => setFilter(filter)}
      className={cn(doFilterExists(filter)[0] === true ? "bg-focus" : "")}
      token={token}
    />
  );
});
PoolTypeFilterWrapper.displayName = "PoolTypeFilterWrapper";

export { FilterWrapper, ChainFilterWrapper, PoolTypeFilterWrapper };
