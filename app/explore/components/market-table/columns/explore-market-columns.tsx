import { cn } from "@/lib/utils";
import { TokenDisplayer } from "@/components/common";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createPortal } from "react-dom";
import React from "react";
import {
  ArrowUpDownIcon,
  ClockIcon,
  CoinsIcon,
  DatabaseIcon,
  MoveDownIcon,
  MoveUpIcon,
  SparklesIcon,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MarketType } from "@/store";
import validator from "validator";
import { MULTIPLIER_ASSET_TYPE } from "royco/boyco";
import {
  PrimaryLabel,
  SecondaryLabel,
} from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { SONIC_APP_TYPE } from "royco/sonic";
import { Button } from "@/components/ui/button";
import { EnrichedMarket } from "royco/api";
import NumberFlow from "@number-flow/react";
import { ContentFlow } from "@/components/animations/content-flow";
import { AnnualYieldAssumption } from "@/app/vault/common/annual-yield-assumption";
import { CustomProgress } from "@/app/vault/common/custom-progress";
import { useAtom } from "jotai";
import { marketSortAtom } from "@/store/explore/explore-market";

export const exploreMarketColumnNames = {
  name: { label: "Market", type: "default" },
  totalYield: {
    label: "Est. Total APY",
    enableSorting: true,
    sortId: "yieldRate",
    type: "default",
  },
  tokenYield: {
    label: "Est. Token APY",
    icon: <CoinsIcon className="h-3 w-3" />,
    type: "default",
  },
  pointsYield: {
    label: "Est. Points APY",
    icon: <SparklesIcon className="h-3 w-3" />,
    type: "default",
  },
  fillable: {
    label: "Fillable",
    icon: <DatabaseIcon className="h-3 w-3" />,
    sortId: "fillableUsd",
    type: "default",
  },
  lockup: {
    label: "Lockup",
    icon: <ClockIcon className="h-3 w-3" />,
    type: "default",
  },
  appType: { label: "Gem Allocation", type: "sonic" },
  poolType: { label: "Pool Type", type: "boyco" },
};

export const HeaderWrapper = React.forwardRef<HTMLDivElement, any>(
  ({ className, column, ...props }, ref) => {
    const columnName = (exploreMarketColumnNames as any)[column.id];

    if (!columnName) {
      return;
    }

    const [marketSort, setMarketSort] = useAtom(marketSortAtom);
    const isSorted = marketSort.find((item) => item.id === columnName.sortId);
    const isDesc = isSorted?.desc;

    return (
      <div className={cn("flex items-center gap-1", className)} {...props}>
        {columnName?.icon}

        <SecondaryLabel className="text-xs font-medium text-_secondary_">
          {columnName.label.toUpperCase()}
        </SecondaryLabel>

        {column.getCanSort() &&
          (() => {
            if (!isSorted) {
              return (
                <Button
                  variant="none"
                  onClick={() => {
                    setMarketSort([
                      {
                        id: columnName.sortId,
                        desc: true,
                      },
                    ]);
                  }}
                  className="place-content-center p-1 outline-none hover:text-_primary_"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                </Button>
              );
            }

            if (isSorted) {
              if (isDesc) {
                return (
                  <Button
                    variant="none"
                    onClick={() => {
                      setMarketSort([
                        {
                          id: columnName.sortId,
                          desc: false,
                        },
                      ]);
                    }}
                    className="place-content-center p-1 outline-none hover:text-_primary_"
                  >
                    <MoveUpIcon className="h-4 w-4" />
                  </Button>
                );
              } else {
                return (
                  <Button
                    variant="none"
                    onClick={() => {
                      setMarketSort([
                        {
                          id: columnName.sortId,
                          desc: true,
                        },
                      ]);
                    }}
                    className="place-content-center p-1 outline-none hover:text-_primary_"
                  >
                    <MoveDownIcon className="h-4 w-4" />
                  </Button>
                );
              }
            }
          })()}
      </div>
    );
  }
);

export type ExploreMarketColumnDataElement = EnrichedMarket;
export const exploreMarketColumns: ColumnDef<ExploreMarketColumnDataElement>[] =
  [
    {
      accessorKey: "name",
      enableResizing: true,
      enableSorting: false,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "w-[500px] min-w-60",
      cell: ({ row, column }: { row: any; column: any }) => {
        return (
          <ContentFlow customKey={row.original.id}>
            <div
              className={cn("flex items-center gap-3", column.columnDef.meta)}
            >
              <TokenDisplayer
                size={6}
                tokens={[row.original.inputToken]}
                symbols={false}
              />

              <div className="truncate">
                {validator.unescape(row.original.name.trim())}
              </div>
            </div>
          </ContentFlow>
        );
      },
    },
    {
      accessorKey: "totalYield",
      enableResizing: true,
      enableSorting: true,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "min-w-52 w-60",
      cell: ({ row }) => {
        const activeIncentives = row.original.activeIncentives || [];
        const underlyingIncentives = row.original.underlyingIncentives || [];
        const nativeIncentives = row.original.nativeIncentives || [];

        const fixedIncentives = activeIncentives;
        const variableIncentives = [
          ...underlyingIncentives,
          ...nativeIncentives,
        ];
        const incentives = [...fixedIncentives, ...variableIncentives];
        const totalYieldRate = incentives.reduce(
          (acc, curr) => acc + (curr?.yieldRate || 0),
          0
        );

        return (
          <ContentFlow customKey={row.original.id}>
            {incentives.length > 0 ? (
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger
                  className={cn("flex cursor-pointer items-center")}
                >
                  <div className="flex items-center gap-1">
                    <PrimaryLabel className="text-base font-normal text-_primary_">
                      <NumberFlow
                        value={totalYieldRate}
                        format={{
                          style: "percent",
                          notation: "compact",
                          useGrouping: true,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }}
                      />
                    </PrimaryLabel>

                    <TokenDisplayer
                      size={4}
                      tokens={incentives}
                      symbols={false}
                    />
                  </div>
                </HoverCardTrigger>

                {incentives.length > 0 &&
                  typeof window !== "undefined" &&
                  createPortal(
                    <HoverCardContent
                      className={cn(
                        "min-w-[320px] rounded-sm border border-_divider_ bg-_surface_ p-2 shadow-none"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col gap-4">
                        {fixedIncentives.length > 0 && (
                          <>
                            <SecondaryLabel className="text-xs font-medium text-_secondary_">
                              <div className="flex w-full items-center justify-between gap-2">
                                <div>FIXED RATE</div>
                                <div>EST. APY</div>
                              </div>
                            </SecondaryLabel>
                            <AnnualYieldAssumption
                              incentives={fixedIncentives}
                              className="divide-y-0"
                            />
                          </>
                        )}

                        {variableIncentives.length > 0 && (
                          <>
                            <SecondaryLabel className="text-xs font-medium text-_secondary_">
                              <div className="flex w-full items-center justify-between gap-2">
                                <div>VARIABLE RATE</div>
                                <div>EST. APY</div>
                              </div>
                            </SecondaryLabel>
                            <AnnualYieldAssumption
                              incentives={variableIncentives}
                              className="divide-y-0"
                            />
                          </>
                        )}
                      </div>
                    </HoverCardContent>,
                    document.body
                  )}
              </HoverCard>
            ) : (
              <span>-</span>
            )}
          </ContentFlow>
        );
      },
    },
    {
      accessorKey: "tokenYield",
      enableResizing: true,
      enableSorting: false,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "min-w-52 w-60",
      cell: ({ row }) => {
        const activeIncentives = row.original.activeIncentives || [];
        const underlyingIncentives = row.original.underlyingIncentives || [];
        const nativeIncentives = row.original.nativeIncentives || [];

        const incentives = [
          ...activeIncentives,
          ...underlyingIncentives,
          ...nativeIncentives,
        ].filter((item) => item.type === "token");
        const totalYieldRate = incentives.reduce(
          (acc, curr) => acc + (curr?.yieldRate || 0),
          0
        );

        return (
          <ContentFlow customKey={row.original.id}>
            {incentives.length > 0 ? (
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger
                  className={cn("flex cursor-pointer items-center")}
                >
                  <div className="flex items-center gap-1">
                    <PrimaryLabel className="text-base font-normal text-_primary_">
                      <NumberFlow
                        value={totalYieldRate}
                        format={{
                          style: "percent",
                          notation: "compact",
                          useGrouping: true,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }}
                      />
                    </PrimaryLabel>

                    <TokenDisplayer
                      size={4}
                      tokens={incentives}
                      symbols={false}
                    />
                  </div>
                </HoverCardTrigger>

                {incentives.length > 0 &&
                  typeof window !== "undefined" &&
                  createPortal(
                    <HoverCardContent
                      className={cn(
                        "min-w-[320px] rounded-sm border border-_divider_ bg-_surface_ p-2 shadow-none"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col gap-4">
                        <AnnualYieldAssumption
                          incentives={incentives}
                          className="divide-y-0"
                        />
                      </div>
                    </HoverCardContent>,
                    document.body
                  )}
              </HoverCard>
            ) : (
              <span>-</span>
            )}
          </ContentFlow>
        );
      },
    },
    {
      accessorKey: "pointsYield",
      enableResizing: true,
      enableSorting: false,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },

      meta: "min-w-52 w-60",
      cell: ({ row }) => {
        const activeIncentives = row.original.activeIncentives || [];
        const underlyingIncentives = row.original.underlyingIncentives || [];
        const nativeIncentives = row.original.nativeIncentives || [];

        const incentives = [
          ...activeIncentives,
          ...underlyingIncentives,
          ...nativeIncentives,
        ].filter((item) => item.type === "point");
        const totalYieldRate = incentives.reduce(
          (acc, curr) => acc + (curr?.yieldRate || 0),
          0
        );

        return (
          <ContentFlow customKey={row.original.id}>
            {incentives.length > 0 ? (
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger
                  className={cn("flex cursor-pointer items-center")}
                >
                  <div className="flex items-center gap-1">
                    <PrimaryLabel className="text-base font-normal text-_primary_">
                      <NumberFlow
                        value={totalYieldRate}
                        format={{
                          style: "percent",
                          notation: "compact",
                          useGrouping: true,
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }}
                      />
                    </PrimaryLabel>

                    <TokenDisplayer
                      size={4}
                      tokens={incentives}
                      symbols={false}
                    />
                  </div>
                </HoverCardTrigger>

                {incentives.length > 0 &&
                  typeof window !== "undefined" &&
                  createPortal(
                    <HoverCardContent
                      className={cn(
                        "min-w-[320px] rounded-sm border border-_divider_ bg-_surface_ p-2 shadow-none"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col gap-4">
                        <AnnualYieldAssumption
                          incentives={incentives}
                          className="divide-y-0"
                        />
                      </div>
                    </HoverCardContent>,
                    document.body
                  )}
              </HoverCard>
            ) : (
              <span>-</span>
            )}
          </ContentFlow>
        );
      },
    },
    {
      accessorKey: "fillable",
      enableResizing: true,
      enableSorting: true,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "min-w-40 w-52",
      cell: ({ row }) => {
        return (
          <ContentFlow customKey={row.original.id}>
            {row.original.marketType === 0 ? (
              <div className={cn("flex cursor-pointer items-center gap-2")}>
                <CustomProgress
                  className="h-3 w-7"
                  segmentWidth={1.2}
                  value={(1 - row.original.capacityRatio) * 100}
                />

                <PrimaryLabel className="text-base font-normal text-_primary_">
                  <NumberFlow
                    value={row.original.fillableUsd}
                    format={{
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      useGrouping: true,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }}
                    className={cn("h-5")}
                  />
                </PrimaryLabel>
              </div>
            ) : (
              <span>No Limit</span>
            )}
          </ContentFlow>
        );
      },
    },
    {
      accessorKey: "lockup",
      enableResizing: true,
      enableSorting: false,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "min-w-40 w-40",
      cell: ({ row }) => {
        if (row.original.marketType === MarketType.vault.value) {
          return (
            <ContentFlow customKey={`${row.original.id}`}>
              <span>-</span>
            </ContentFlow>
          );
        }

        const lockupType =
          row.original.rewardStyle !== 2 ? "Hard Lock" : "Soft Lock";

        if (!row.original.lockupTime) {
          return (
            <ContentFlow customKey={`${row.original.id}`}>
              <span>-</span>
            </ContentFlow>
          );
        }

        let formattedValue = "-";
        const seconds = parseInt(row.original.lockupTime);
        const hours = seconds / 3600;
        if (hours < 24) {
          formattedValue = `${Math.round(hours)}H`;
        } else {
          formattedValue = `${Math.round(hours / 24)}D`;
        }

        let tooltipContent = "";
        if (lockupType === "Hard Lock") {
          tooltipContent = `You may not withdraw your funds for ${formattedValue} after depositing.`;
        } else {
          tooltipContent = `If you withdraw before ${formattedValue}, you'll forfeit the rewards you earned during that period.`;
        }

        return (
          <div key={`market:rewardStyle`} className={cn("flex h-fit w-fit")}>
            <ContentFlow customKey={row.original.id}>
              <Tooltip>
                <TooltipTrigger
                  className={cn("flex cursor-pointer items-center")}
                >
                  {formattedValue + " " + lockupType}
                </TooltipTrigger>

                {typeof window !== "undefined" &&
                  createPortal(
                    <TooltipContent
                      side="bottom"
                      align="start"
                      className={cn(
                        "max-w-[320px] rounded-sm border border-_divider_ bg-_surface_ p-2 shadow-none"
                      )}
                    >
                      <div
                        className={cn(
                          "break-normal text-sm font-normal text-_secondary_"
                        )}
                      >
                        {tooltipContent}
                      </div>
                    </TooltipContent>,
                    document.body
                  )}
              </Tooltip>
            </ContentFlow>
          </div>
        );
      },
    },
  ];

export const boycoExploreMarketColumns: ColumnDef<ExploreMarketColumnDataElement>[] =
  [
    ...exploreMarketColumns,
    {
      accessorKey: "poolType",
      enableResizing: true,
      enableSorting: false,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "min-w-40 w-52",
      cell: ({ row }) => {
        const poolType = row.original.marketMetadata?.boyco?.assetType;
        const marketMultiplier = row.original.marketMetadata?.boyco?.multiplier;

        let formattedPoolType = "-";

        if (poolType === MULTIPLIER_ASSET_TYPE.MAJOR_ONLY) {
          formattedPoolType = "Major";
        } else if (poolType === MULTIPLIER_ASSET_TYPE.THIRD_PARTY_ONLY) {
          formattedPoolType = "Third-Party";
        } else if (poolType === MULTIPLIER_ASSET_TYPE.HYBRID) {
          formattedPoolType = "Hybrid";
        }

        return (
          <ContentFlow customKey={row.original.id}>
            <div className={cn("flex flex-row items-center gap-2")}>
              <span className="leading-5">{formattedPoolType}</span>

              {marketMultiplier && (
                <SecondaryLabel className="h-full rounded-full border border-success px-2 py-1 text-xs font-medium text-success">
                  {marketMultiplier}x
                </SecondaryLabel>
              )}
            </div>
          </ContentFlow>
        );
      },
    },
  ];

export const sonicExploreMarketColumns: ColumnDef<ExploreMarketColumnDataElement>[] =
  [
    ...exploreMarketColumns,
    {
      accessorKey: "appType",
      enableResizing: true,
      enableSorting: false,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "min-w-40 w-52",
      cell: ({ row }) => {
        const appType =
          row.original.marketMetadata?.sonic?.appType ?? "unknown";

        if (appType === "unknown") {
          return <span>-</span>;
        }

        let formattedAppType = "-";
        if (appType === SONIC_APP_TYPE.EMERALD) {
          formattedAppType = "Emerald";
        } else if (appType === SONIC_APP_TYPE.SAPPHIRE) {
          formattedAppType = "Sapphire";
        } else if (appType === SONIC_APP_TYPE.RUBY) {
          formattedAppType = "Ruby";
        }

        let tooltipContent = "";
        if (appType === SONIC_APP_TYPE.EMERALD) {
          tooltipContent = `13,125 Gems allocated to App`;
        } else if (appType === SONIC_APP_TYPE.SAPPHIRE) {
          tooltipContent = `8,750 Gems allocated to App`;
        } else if (appType === SONIC_APP_TYPE.RUBY) {
          tooltipContent = `4,375 Gems allocated to App`;
        }

        return (
          <ContentFlow customKey={row.original.id}>
            <Tooltip>
              <TooltipTrigger
                className={cn("flex cursor-pointer items-center")}
              >
                <SecondaryLabel className="h-full rounded-full border border-success px-2 py-1 text-sm font-normal text-success">
                  {formattedAppType}
                </SecondaryLabel>
              </TooltipTrigger>

              {typeof window !== "undefined" &&
                createPortal(
                  <TooltipContent
                    side="bottom"
                    align="start"
                    className={cn(
                      "max-w-[320px] rounded-sm border border-_divider_ bg-_surface_ p-2 shadow-none"
                    )}
                  >
                    <div
                      className={cn(
                        "break-normal text-sm font-normal text-_secondary_"
                      )}
                    >
                      {tooltipContent}
                    </div>
                  </TooltipContent>,
                  document.body
                )}
            </Tooltip>
          </ContentFlow>
        );
      },
    },
  ];
