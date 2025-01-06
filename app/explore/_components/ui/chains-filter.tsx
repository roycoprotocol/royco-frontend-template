"use client";

import { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useBaseChains } from "royco/hooks";

import dynamic from "next/dynamic";

import { getFrontendTag } from "@/store";

/**
 * We need dynamic import here to prevent hydration mismatch
 */
const ChainFilterWrapper = dynamic(
  () =>
    import("../composables/filter-wrapper").then(
      (mod) => mod.ChainFilterWrapper
    ),
  {
    ssr: false,
  }
);

export const ChainsFilter = () => {
  const { data } = useBaseChains();

  /**
   * If we don't add "useEffect" in the component, then it renders on the server and this causes hydration mismatch
   */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Fragment>
      {mounted &&
        data.map((chain) => {
          const frontendTag =
            typeof window !== "undefined" ? getFrontendTag() : "default";

          let shouldHide = false;

          if (!!window && frontendTag !== "dev" && frontendTag !== "testnet") {
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
