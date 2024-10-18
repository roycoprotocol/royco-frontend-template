"use client";

import { Fragment } from "react";
import { LoadingSpinner } from "@/components/composables";
import { useContractTypes } from "@/sdk/hooks";
import { useSelectionMenu } from "@/store";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const ContractTypeSelector = () => {
  const { chainId, filters, setFilters } = useSelectionMenu();

  const { data, isLoading } = useContractTypes({ chain_id: chainId });

  const activeType = filters.find((filter) => filter.id === "type");

  if (isLoading) {
    // 27.6px = 1.725rem :)
    return (
      <div className="flex h-[1.725rem] w-full flex-col items-center">
        <LoadingSpinner className="h-4 w-4" />
      </div>
    );
  }

  if (data && data.length > 0) {
    return (
      <Fragment>
        <ul className="list badge flex w-full flex-row flex-wrap items-center gap-2">
          <motion.li
            layoutId={`contract-type-selector:all`}
            key={`contract-type-selector:all`}
            tabIndex={0}
            onClick={() => {
              const newFilters = filters.filter(
                (currFilter) => currFilter.id !== "type"
              );

              setFilters(newFilters);
            }}
            className={cn(
              "relative cursor-pointer rounded-md border border-divider bg-z2 px-2 py-1 text-secondary transition-all duration-200 ease-in-out",
              !activeType ? "text-focus" : "hover:bg-focus hover:text-primary"
            )}
          >
            {!activeType ? (
              <motion.div
                initial={false}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  type: "spring",
                  bounce: 0,
                }}
                layoutId="contract-type-selector:indicator"
                className="absolute inset-0 z-10 rounded-md bg-secondary"
              ></motion.div>
            ) : null}

            <span className="relative z-10 capitalize text-inherit">all</span>
          </motion.li>

          {data.map((contract, index) => {
            const activeFilter = filters.find((filter) => filter.id === "type");

            return (
              <motion.li
                layoutId={`contract-type-selector:${contract.type}`}
                key={`contract-type-selector:${contract.type}`}
                tabIndex={0}
                onClick={() => {
                  const newFilters = filters.filter(
                    (currFilter) => currFilter.id !== "type"
                  );

                  if (!!contract.type) {
                    setFilters([
                      ...newFilters,
                      {
                        id: "type",
                        value: contract.type,
                      },
                    ]);
                  }
                }}
                className={cn(
                  "relative cursor-pointer rounded-md border border-divider bg-z2 px-2 py-1 text-secondary transition-all duration-200 ease-in-out",
                  activeFilter && activeFilter.value === contract.type
                    ? "text-focus"
                    : "hover:bg-focus hover:text-primary"
                )}
              >
                {activeFilter && activeFilter.value === contract.type ? (
                  <motion.div
                    initial={false}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                      type: "spring",
                      bounce: 0,
                    }}
                    layoutId="contract-type-selector:indicator"
                    className="absolute inset-0 z-10 rounded-md bg-secondary"
                  ></motion.div>
                ) : null}

                <span className="relative z-10 capitalize text-inherit">
                  {contract.type}
                </span>
              </motion.li>
            );
          })}
        </ul>
      </Fragment>
    );
  }
};
