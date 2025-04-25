"use client";

import React, { Fragment } from "react";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { exploreFiltersAtom, explorePageAtom } from "@/store/explore/atoms";
import { SONIC_APP_TYPE } from "royco/sonic";
import { ToggleBadge } from "@/components/common/toggle-badge";

export const AppTypeFilter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [filters, setFilters] = useAtom(exploreFiltersAtom);
  const [page, setPage] = useAtom(explorePageAtom);

  const handleAppTypeToggle = (appType: SONIC_APP_TYPE) => {
    const appTypeFilterIndex = filters.findIndex(
      (filter) =>
        filter.id === "marketMetadata.appType" && filter.condition === "inArray"
    );
    const currentAppTypes =
      appTypeFilterIndex !== -1
        ? (filters[appTypeFilterIndex].value as string[])
        : [];

    const newAppTypes = currentAppTypes.includes(appType)
      ? currentAppTypes.filter((id) => id !== appType)
      : [...currentAppTypes, appType];

    const newFilters =
      newAppTypes.length === 0
        ? filters.filter((filter) => filter.id !== "marketMetadata.appType")
        : [
            ...filters.filter(
              (filter) => filter.id !== "marketMetadata.appType"
            ),
            {
              id: "marketMetadata.appType",
              value: newAppTypes,
              condition: "inArray",
            },
          ];

    setFilters(newFilters);
    setPage(1);
  };

  const isAppTypeSelected = (appType: SONIC_APP_TYPE) => {
    const appTypeFilter = filters.find(
      (filter) => filter.id === "marketMetadata.appType"
    );
    return appTypeFilter
      ? (appTypeFilter.value as string[]).includes(appType)
      : false;
  };

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
        {Object.values(SONIC_APP_TYPE).map((appType) => {
          return (
            <ToggleBadge
              key={`filter:app-type:${appType}`}
              onClick={() => handleAppTypeToggle(appType)}
              className={cn(
                isAppTypeSelected(appType) && "bg-focus",
                "border border-success text-success hover:border-green-800 hover:text-green-800"
              )}
            >
              {getAppType(appType)}
            </ToggleBadge>
          );
        })}
      </div>
    </Fragment>
  );
});

// <div key={`filter:app-type:${appType}`}>
//   <AppTypeFilterWrapper
//     filter={{
//       id: "id",
//       value: appType,
//       matches: sonicMarketMap
//         .filter((market) => market.appType === appType)
//         .map((market) => market.id),
//     }}
//     token={{
//       id: appType,
//       symbol: getAppType(appType),
//     }}
//   />
// </div>
