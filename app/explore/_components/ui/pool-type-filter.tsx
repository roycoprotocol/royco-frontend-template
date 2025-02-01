"use client";

import { Fragment, useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/composables";
import { PoolTypeFilterWrapper } from "../composables";
import {
  overrideMarketMap as boycoMarketMap,
  MULTIPLIER_ASSET_TYPE,
} from "royco/boyco";

const chainId = 1;
const marketType = 0;

export const PoolTypeFilter = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex w-full flex-col place-content-center items-center">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  }

  const getPoolType = (poolType: MULTIPLIER_ASSET_TYPE) => {
    if (poolType === MULTIPLIER_ASSET_TYPE.MAJOR_ONLY) {
      return "Major";
    } else if (poolType === MULTIPLIER_ASSET_TYPE.THIRD_PARTY_ONLY) {
      return "Third-Party";
    } else {
      return "Hybrid";
    }
  };

  return (
    <Fragment>
      <div className="flex flex-wrap gap-2">
        {Object.values(MULTIPLIER_ASSET_TYPE).map((poolType) => (
          <div key={`filter-wrapper:pool-type:${poolType}`}>
            <PoolTypeFilterWrapper
              filter={{
                id: "id",
                value: poolType,
                matches: boycoMarketMap
                  .filter((market) => market.assetType === poolType)
                  .map((market) => `${chainId}_${marketType}_${market.id}`),
              }}
              token={{
                id: poolType,
                symbol: getPoolType(poolType),
              }}
            />
          </div>
        ))}
      </div>
    </Fragment>
  );
};
