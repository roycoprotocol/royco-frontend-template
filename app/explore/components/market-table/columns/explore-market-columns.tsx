import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createPortal } from "react-dom";
import React from "react";
import {
  ArrowUpDownIcon,
  CirclePercentIcon,
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
import { EnrichedMarket, GenericIncentive } from "royco/api";
import NumberFlow from "@number-flow/react";
import { ContentFlow } from "@/components/animations/content-flow";
import { AnnualYieldAssumption } from "@/app/vault/common/annual-yield-assumption";
import { CustomProgress } from "@/app/vault/common/custom-progress";
import { useAtom } from "jotai";
import { marketSortAtom } from "@/store/explore/explore-market";
import formatNumber from "@/utils/numbers";
import { TokenDisplayer } from "@/app/_components/common/token-displayer";
import {
  formatLockupTime,
  formatLockupTimeAbbreviated,
} from "@/utils/lockup-time";

export const exploreMarketColumnNames = {
  name: { label: "Market", type: ["default", "boyco", "sonic", "plume"] },
  totalYield: {
    label: "Total APY",
    sortId: "yieldRate",
    type: ["default", "boyco", "sonic", "plume"],
  },
  realYield: {
    label: "Real Yields",
    sortId: "realYieldRate",
    icon: <CirclePercentIcon className="h-3 w-3" />,
    type: ["default", "boyco", "sonic"],
  },
  tokenYield: {
    label: "Token Incentives",
    sortId: "tokenYieldRate",
    icon: <CoinsIcon className="h-3 w-3" />,
    type: ["default", "boyco", "sonic", "plume"],
  },
  pointsYield: {
    label: "Est. Points",
    sortId: "pointYieldRate",
    icon: <SparklesIcon className="h-3 w-3" />,
    type: ["default", "boyco", "sonic"],
  },
  fillable: {
    label: "Capacity",
    icon: <DatabaseIcon className="h-3 w-3" />,
    sortId: "fillableUsd",
    type: ["default", "boyco", "sonic", "plume"],
  },
  lockup: {
    label: "Lockup",
    icon: <ClockIcon className="h-3 w-3" />,
    type: ["default", "boyco", "sonic", "plume"],
  },
  appType: { label: "Gem Allocation", type: ["sonic"] },
  poolType: { label: "Pool Type", type: ["boyco"] },
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
      <div
        onClick={() => {
          if (!column.getCanSort()) {
            return;
          }

          if (!isSorted) {
            setMarketSort([
              {
                id: columnName.sortId,
                desc: true,
              },
            ]);
            return;
          }

          if (isDesc) {
            setMarketSort([
              {
                id: columnName.sortId,
                desc: false,
              },
            ]);
            return;
          }

          setMarketSort([
            {
              id: columnName.sortId,
              desc: true,
            },
          ]);
        }}
        className={cn(
          "group flex cursor-pointer items-center gap-1",
          column.getCanSort() && "hover:text-_primary_",
          className
        )}
        {...props}
      >
        {columnName?.icon}

        <SecondaryLabel
          className={cn(
            "text-xs font-medium text-_secondary_ transition-colors duration-300",
            column.getCanSort() && "group-hover:text-_primary_"
          )}
        >
          {columnName.label.toUpperCase()}
        </SecondaryLabel>

        {column.getCanSort() &&
          (() => {
            if (!isSorted) {
              return (
                <Button
                  variant="none"
                  className={cn(
                    "place-content-center p-1 outline-none",
                    column.getCanSort() && "group-hover:text-_primary_"
                  )}
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                </Button>
              );
            }

            if (isDesc) {
              return (
                <Button
                  variant="none"
                  className={cn(
                    "place-content-center p-1 outline-none",
                    column.getCanSort() && "group-hover:text-_primary_"
                  )}
                >
                  <MoveUpIcon className="h-4 w-4" />
                </Button>
              );
            }

            return (
              <Button
                variant="none"
                className={cn(
                  "place-content-center p-1 outline-none",
                  column.getCanSort() && "group-hover:text-_primary_"
                )}
              >
                <MoveDownIcon className="h-4 w-4" />
              </Button>
            );
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
      enableResizing: false,
      enableSorting: false,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "max-w-96",
      cell: ({ row, column }: { row: any; column: any }) => {
        return (
          <ContentFlow customKey={row.original.id}>
            <div className={cn("flex items-center gap-3")}>
              <TokenDisplayer
                size={6}
                tokens={row.original.inputTokens}
                showSymbol={false}
                showChain={true}
              />

              <div className="overflow-hidden truncate">
                {validator.unescape(row.original.name.trim())}
              </div>
            </div>
          </ContentFlow>
        );
      },
    },
    {
      accessorKey: "totalYield",
      enableResizing: false,
      enableSorting: true,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "min-w-40 w-52",
      cell: ({ row }) => {
        const incentives = [
          ...row.original.realIncentives,
          ...row.original.tokenIncentives,
          ...row.original.pointIncentives,
        ];

        return (
          <ContentFlow customKey={row.original.id}>
            {incentives.length > 0 ? (
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger
                  className={cn("flex cursor-pointer items-center")}
                >
                  <div className="flex items-center gap-1">
                    <PrimaryLabel className="text-base font-normal text-_primary_">
                      {formatNumber(
                        row.original.yieldRate,
                        {
                          type: "percent",
                        },
                        {
                          mantissa: 2,
                        }
                      )}
                    </PrimaryLabel>

                    <TokenDisplayer
                      size={4}
                      tokens={incentives}
                      showSymbol={false}
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
                        {row.original.realIncentives.length > 0 && (
                          <>
                            <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                              <div className="flex w-full items-center justify-between gap-2">
                                <div>REAL YIELDS</div>
                                <div>EST. APY</div>
                              </div>
                            </SecondaryLabel>
                            <AnnualYieldAssumption
                              incentives={row.original.realIncentives}
                              className="divide-y-0"
                              showFdv={false}
                            />
                          </>
                        )}

                        {row.original.tokenIncentives.length > 0 && (
                          <>
                            <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                              <div className="flex w-full items-center justify-between gap-2">
                                <div>TOKEN INCENTIVES</div>
                                <div>EST. APY</div>
                              </div>
                            </SecondaryLabel>
                            <AnnualYieldAssumption
                              incentives={row.original.tokenIncentives}
                              className="divide-y-0"
                              showFdv={false}
                            />
                          </>
                        )}

                        {row.original.pointIncentives.length > 0 && (
                          <>
                            <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                              <div className="flex w-full items-center justify-between gap-2">
                                <div>EST. POINTS</div>
                                <div>EST. APY</div>
                              </div>
                            </SecondaryLabel>
                            <AnnualYieldAssumption
                              incentives={row.original.pointIncentives}
                              className="divide-y-0"
                              showFdv={false}
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
      accessorKey: "realYield",
      enableResizing: false,
      enableSorting: true,

      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "min-w-40 w-52",
      cell: ({ row }) => {
        const incentives = row.original.realIncentives;

        return (
          <ContentFlow customKey={row.original.id}>
            {incentives.length > 0 ? (
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger
                  className={cn("flex cursor-pointer items-center")}
                >
                  <div className="flex items-center gap-1">
                    <PrimaryLabel className="text-base font-normal text-_primary_">
                      {formatNumber(
                        row.original.realYieldRate,
                        {
                          type: "percent",
                        },
                        {
                          mantissa: 2,
                        }
                      )}
                    </PrimaryLabel>

                    <TokenDisplayer
                      size={4}
                      tokens={incentives}
                      showSymbol={false}
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
                        <>
                          <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                            <div className="flex w-full items-center justify-between gap-2">
                              <div>REAL YIELDS</div>
                              <div>EST. APY</div>
                            </div>
                          </SecondaryLabel>
                          <AnnualYieldAssumption
                            incentives={incentives}
                            className="divide-y-0"
                            showFdv={false}
                          />
                        </>
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
      enableResizing: false,
      enableSorting: true,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "min-w-48 w-52",
      cell: ({ row }) => {
        const incentives = row.original.tokenIncentives;

        return (
          <ContentFlow customKey={row.original.id}>
            {incentives.length > 0 ? (
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger
                  className={cn("flex cursor-pointer items-center")}
                >
                  <div className="flex items-center gap-1">
                    <PrimaryLabel className="text-base font-normal text-_primary_">
                      {"+ "}
                      {formatNumber(
                        row.original.tokenYieldRate,
                        {
                          type: "percent",
                        },
                        {
                          mantissa: 2,
                        }
                      )}
                    </PrimaryLabel>

                    <TokenDisplayer
                      size={4}
                      tokens={incentives}
                      showSymbol={false}
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
                        <>
                          <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                            <div className="flex w-full items-center justify-between gap-2">
                              <div>TOKEN INCENTIVES</div>
                              <div>EST. APY</div>
                            </div>
                          </SecondaryLabel>
                          <AnnualYieldAssumption
                            incentives={incentives}
                            className="divide-y-0"
                            showFdv={false}
                          />
                        </>
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
      enableResizing: false,
      enableSorting: true,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "min-w-40 w-52",
      cell: ({ row }) => {
        const incentives = row.original.pointIncentives;

        return (
          <ContentFlow customKey={row.original.id}>
            {incentives.length > 0 ? (
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger
                  className={cn("flex cursor-pointer items-center")}
                >
                  <div className="flex items-center gap-1">
                    <PrimaryLabel className="text-base font-normal text-_primary_">
                      {"+ "}
                      {formatNumber(
                        row.original.pointYieldRate,
                        {
                          type: "percent",
                        },
                        {
                          mantissa: 2,
                        }
                      )}
                    </PrimaryLabel>

                    <TokenDisplayer
                      size={4}
                      tokens={incentives}
                      showSymbol={false}
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
                        <>
                          <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                            <div className="flex w-full items-center justify-between gap-2">
                              <div>EST. POINTS</div>
                              <div>EST. APY</div>
                            </div>
                          </SecondaryLabel>
                          <AnnualYieldAssumption
                            incentives={incentives}
                            className="divide-y-0"
                            showFdv={false}
                          />
                        </>
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
      enableResizing: false,
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
      enableResizing: false,
      enableSorting: false,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "min-w-40 w-52",
      cell: ({ row }) => {
        if (row.original.marketType === MarketType.vault.value) {
          return (
            <ContentFlow customKey={`${row.original.id}`}>
              <span>-</span>
            </ContentFlow>
          );
        }

        if (!row.original.lockupTime) {
          return (
            <ContentFlow customKey={`${row.original.id}`}>
              <span>-</span>
            </ContentFlow>
          );
        }

        const isLocked = row.original.rewardStyle !== 2;

        const formattedValue = formatLockupTimeAbbreviated(
          row.original.lockupTime
        );
        const lockupType = isLocked ? "Hard Lock" : "Forfeit to Exit";

        let tooltipContent = "";
        if (isLocked) {
          tooltipContent = `You may not withdraw your funds for ${formatLockupTime(row.original.lockupTime).toLowerCase()} after depositing.`;
        } else {
          tooltipContent = `Withdrawing funds before ${formatLockupTime(row.original.lockupTime).toLowerCase()} will result in forfeiture of all rewards earned during that period.`;
        }

        return (
          <ContentFlow customKey={row.original.id}>
            <Tooltip>
              <TooltipTrigger
                className={cn("flex cursor-pointer items-center")}
              >
                {formattedValue + ", " + lockupType}
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
    {
      accessorKey: "appType",
      enableResizing: false,
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
    {
      accessorKey: "poolType",
      enableResizing: false,
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
