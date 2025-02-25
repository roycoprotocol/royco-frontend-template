"use client";

import { Fragment, useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/composables";
import { AppTypeFilterWrapper } from "../composables";
import { SONIC_APP_TYPE, sonicMarketMap } from "royco/sonic";

export const AppTypeFilter = () => {
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

  const getAppType = (appType: SONIC_APP_TYPE) => {
    if (appType === SONIC_APP_TYPE.EMERALD) {
      return "Emerald";
    } else if (appType === SONIC_APP_TYPE.SAPPHIRE) {
      return "Sapphire";
    } else {
      return "Ruby";
    }
  };

  return (
    <Fragment>
      <div className="flex flex-wrap gap-2">
        {Object.values(SONIC_APP_TYPE).map((appType) => (
          <div key={`filter-wrapper:app-type:${appType}`}>
            <AppTypeFilterWrapper
              filter={{
                id: "id",
                value: appType,
                matches: sonicMarketMap
                  .filter((market) => market.appType === appType)
                  .map((market) => market.id),
              }}
              token={{
                id: appType,
                symbol: getAppType(appType),
              }}
            />
          </div>
        ))}
      </div>
    </Fragment>
  );
};
