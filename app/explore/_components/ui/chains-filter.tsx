"use client";

import { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useBaseChains } from "royco/hooks";

import { ChainFilterWrapper } from "../composables";
import { getFrontendTagClient } from "@/components/constants";

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
          const frontendTag = getFrontendTagClient();

          let shouldHide = false;

          if (
            typeof window !== "undefined" &&
            frontendTag !== "dev" &&
            frontendTag !== "testnet"
          ) {
            if (chain?.testnet === true) {
              shouldHide = true;
            } else if (chain.id === 98865) {
              shouldHide = true;
            }
          }

          return (
            <div
              className={cn(shouldHide && "hidden")}
              key={`filter-wrapper:chains:${chain.id}`}
            >
              <ChainFilterWrapper
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
