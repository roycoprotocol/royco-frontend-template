"use client";

import { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useBaseChains } from "royco/hooks";

import { ChainFilterWrapper } from "../composables";

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
