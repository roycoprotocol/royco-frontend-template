"use client";

import { Fragment } from "react";

import { cn } from "@/lib/utils";

import { useBaseChains } from "royco/hooks";

import { FilterWrapper } from "../composables";

export const ChainsFilter = () => {
  const { data } = useBaseChains();

  return (
    <Fragment>
      {data.map((chain) => {
        const shouldHide =
          process.env.NEXT_PUBLIC_FRONTEND_TYPE !== "TESTNET" &&
          chain?.testnet === true;

        return (
          <div
            className={cn(shouldHide && "hidden")}
            key={`filter-wrapper:chains:${chain.id}`}
          >
            <FilterWrapper
              filter={{
                id: "chain_id",
                value: chain.id,
              }}
              token={chain}
            />
          </div>
        );
      })}
    </Fragment>
  );
};
