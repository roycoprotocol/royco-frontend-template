import { cn } from "@/lib/utils";
import { IncentiveBreakdown, YieldBreakdown } from "@/components/composables";
import { TokenDisplayer } from "@/components/common";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createPortal } from "react-dom";
import React from "react";
import {
  ClockIcon,
  DatabaseIcon,
  ShieldHalfIcon,
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
import { TokenEstimator } from "@/app/_components/ui/token-estimator/token-estimator";
import { Button } from "@/components/ui/button";
import { EnrichedMarket } from "royco/api";
import { SupportedChainMap } from "royco/constants";
import NumberFlow from "@number-flow/react";
import { ContentFlow } from "@/components/animations/content-flow";
import { ContentFade } from "@/components/animations/content-fade";
import { AnnualYieldAssumption } from "@/app/vault/common/annual-yield-assumption";
import { CustomProgress } from "@/app/vault/common/custom-progress";

export const exploreColumnNames = {
  name: { label: "Market" },
  fillable: {
    label: "Fillable",
    icon: <DatabaseIcon className="h-3 w-3" />,
  },
  fixedYield: {
    label: "Est. Fixed APY",
    icon: <ShieldHalfIcon className="h-3 w-3" />,
  },
  variableYield: {
    label: "Est. Variable Bonus",
    icon: <SparklesIcon className="h-3 w-3" />,
  },
  lockup: { label: "Lockup", icon: <ClockIcon className="h-3 w-3" /> },

  appType: { label: "Gem Allocation" },
  poolType: { label: "Pool Type" },
};

export const HeaderWrapper = React.forwardRef<HTMLDivElement, any>(
  ({ className, column, ...props }, ref) => {
    const name = (exploreColumnNames as any)[column.id];

    return (
      <div className={cn("flex items-center gap-1", className)} {...props}>
        {name.icon}

        <SecondaryLabel className="text-xs font-medium text-_secondary_">
          {name.label.toUpperCase()}
        </SecondaryLabel>
      </div>
    );
  }
);

export type ExploreMarketColumnDataElement = EnrichedMarket;

/**
 * @description Column definitions for the table
 * @note For cell formatting @see {@link https://tanstack.com/table/v8/docs/guide/column-defs}
 */
export const exploreMarketColumns: ColumnDef<ExploreMarketColumnDataElement>[] =
  [
    {
      accessorKey: "name",
      enableResizing: false,
      enableSorting: true,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "min-w-60 w-[600px]",
      cell: ({ row }) => {
        return (
          <div
            className={cn(
              "body-2 text-black",
              "flex flex-row items-center justify-between"
            )}
          >
            <ContentFlow
              customKey={row.original.id}
              className="w-80"
              motionProps={{
                transition: {
                  delay: 0.04 * row.index,
                },
              }}
            >
              <div className="flex w-full flex-row items-center">
                <TokenDisplayer
                  tokens={[row.original.inputToken]}
                  symbols={false}
                  className={cn("mr-1 flex items-center")}
                />

                <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {validator.unescape(row.original.name.trim())}
                </div>
              </div>
            </ContentFlow>
          </div>
        );
      },
    },

    {
      accessorKey: "fixedYield",
      enableResizing: true,
      enableSorting: true,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },

      meta: "min-w-40 w-52",
      cell: ({ row }) => {
        const incentives = row.original.activeIncentives || [];

        const totalYieldRate = incentives.reduce(
          (acc, curr) => acc + curr.yieldRate,
          0
        );

        return (
          <div
            key={`market:incentiveTokens`}
            className={cn("flex flex-row items-center gap-2 tabular-nums")}
          >
            <ContentFade
              customKey={row.original.id}
              motionProps={{
                transition: {
                  delay: 0.04 * row.index,
                },
              }}
            >
              <HoverCard openDelay={200} closeDelay={200}>
                <HoverCardTrigger
                  className={cn("flex cursor-pointer items-end")}
                >
                  {incentives.length > 0 ? (
                    <div className="flex flex-row items-center gap-1">
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
                        bounce
                        className="gap-0"
                        symbolClassName="gap-0"
                        tokens={incentives}
                        symbols={false}
                        size={4}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-row items-center gap-1">
                      <span className="font-gt text-base font-300">-</span>
                    </div>
                  )}
                </HoverCardTrigger>

                {typeof window !== "undefined" &&
                  incentives.length > 0 &&
                  createPortal(
                    <HoverCardContent
                      className={cn(
                        "min-w-[320px] rounded-sm border border-_divider_ bg-_surface_"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className={cn(
                          "break-normal text-sm font-normal text-_secondary_"
                        )}
                      >
                        <AnnualYieldAssumption incentives={incentives} />
                      </div>
                    </HoverCardContent>,
                    document.body
                  )}
              </HoverCard>
            </ContentFade>
          </div>
        );
      },
    },
    {
      accessorKey: "variableYield",
      enableResizing: true,
      enableSorting: true,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },

      meta: "min-w-52 w-60",
      cell: ({ row }) => {
        const incentives = [
          ...(row.original.underlyingIncentives || []),
          ...(row.original.nativeIncentives || []),
        ];

        const totalYieldRate = incentives.reduce(
          (acc, curr) => acc + curr.yieldRate,
          0
        );

        return (
          <div
            key={`market:yieldRate`}
            className={cn(
              "flex h-5 flex-row items-center tabular-nums",
              "group"
            )}
          >
            {(() => {
              if (
                process.env.NEXT_PUBLIC_FRONTEND_TAG === "sonic" &&
                row.original.incentiveTokens.length > 0
              ) {
                return (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    className="shrink-0"
                  >
                    <TokenEstimator marketCategory="sonic">
                      <Button
                        variant="link"
                        className="flex w-full items-center gap-1 py-0 outline-none"
                      >
                        <span className="text-sm font-medium underline">
                          Estimate S1 Airdrop
                        </span>
                      </Button>
                    </TokenEstimator>
                  </div>
                );
              } else {
                return (
                  <ContentFade
                    customKey={row.original.id}
                    motionProps={{
                      transition: {
                        delay: 0.04 * row.index,
                      },
                    }}
                  >
                    <HoverCard openDelay={200} closeDelay={200}>
                      <HoverCardTrigger
                        className={cn("flex cursor-pointer items-end")}
                      >
                        {incentives.length > 0 ? (
                          <div className="flex flex-row items-center gap-1">
                            <PrimaryLabel className="text-base font-normal text-_primary_">
                              +
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
                              bounce
                              className="gap-0"
                              symbolClassName="gap-0"
                              tokens={incentives}
                              symbols={false}
                              size={4}
                            />
                          </div>
                        ) : (
                          <div className="flex flex-row items-center gap-1">
                            <span className="font-gt text-base font-300">
                              -
                            </span>
                          </div>
                        )}
                      </HoverCardTrigger>

                      {typeof window !== "undefined" &&
                        incentives.length > 0 &&
                        createPortal(
                          <HoverCardContent
                            className={cn(
                              "w-fit min-w-[320px] rounded-sm border border-_divider_ bg-_surface_"
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              className={cn(
                                "break-normal text-sm font-normal text-_secondary_"
                              )}
                            >
                              <AnnualYieldAssumption incentives={incentives} />
                            </div>
                          </HoverCardContent>,
                          document.body
                        )}
                    </HoverCard>
                  </ContentFade>
                );
              }
            })()}
          </div>
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
          <div key={`market:fillableUsd`} className={cn("tabular-nums")}>
            {row.original.marketType === 0 ? (
              <div className={cn("flex cursor-pointer gap-2 font-light")}>
                <div className="w-7">
                  <CustomProgress
                    value={(1 - row.original.capacityRatio) * 100}
                  />
                </div>

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
              </div>
            ) : (
              <div className="font-light">No Limit</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "lockup",
      enableResizing: true,
      enableSorting: true,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} />;
      },
      meta: "min-w-40 w-40",
      cell: ({ row }) => {
        const lockupType =
          row.original.marketType === MarketType.vault.value
            ? "-"
            : row.original.rewardStyle !== 2
              ? "Hard Lock"
              : "Soft Lock";

        const value = row.original.lockupTime;
        let formattedValue = "-";

        if (value && row.original.marketType !== MarketType.vault.value) {
          const seconds = parseInt(value);
          const hours = seconds / 3600;
          if (hours < 24) {
            formattedValue = `${Math.round(hours)}H`;
          } else {
            formattedValue = `${Math.round(hours / 24)}D`;
          }
        }

        return (
          <div key={`market:rewardStyle`} className={cn("flex h-fit w-fit")}>
            <ContentFlow
              customKey={`${formattedValue}`}
              motionProps={{
                transition: {
                  delay: 0.04 * row.index,
                },
              }}
              className="w-44 text-start"
            >
              <Tooltip>
                <TooltipTrigger
                  className={cn("flex cursor-pointer items-center")}
                >
                  <div className={cn("body-2 text-black")}>
                    <span className="leading-5">
                      {formattedValue + " " + lockupType}
                    </span>
                  </div>
                </TooltipTrigger>

                {row.original.marketType !== MarketType.vault.value &&
                  createPortal(
                    <TooltipContent
                      side="bottom"
                      align="start"
                      className={cn(
                        "max-w-[320px] rounded-sm border border-_divider_ bg-_surface_"
                      )}
                    >
                      <div
                        className={cn(
                          "break-normal text-sm font-normal text-_secondary_"
                        )}
                      >
                        {lockupType === "Hard Lock"
                          ? `You may not withdraw your funds for ${formattedValue} after depositing.`
                          : `If you withdraw before ${formattedValue}, you'll forfeit the rewards you earned during that period.`}
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

export const boycoColumns: ColumnDef<ExploreMarketColumnDataElement>[] = [
  ...(exploreMarketColumns as any).filter(
    (column: any) => column.accessorKey !== "market_type"
  ),
  {
    accessorKey: "poolType",
    enableResizing: true,
    // header: exploreColumnNames.action,
    enableSorting: true,
    header: ({ column }: { column: any }) => {
      return <HeaderWrapper column={column} />;
    },
    meta: "min-w-44 w-44",
    cell: ({ row }) => {
      const poolType = row.original.marketMetadata?.boyco?.assetType;
      const marketMultiplier = row.original.marketMetadata?.boyco?.multiplier;

      return (
        <div key={`market:pool-type`} className={cn("flex h-fit w-fit")}>
          <ContentFlow
            className="flex w-44 flex-row items-center justify-center text-center"
            customKey={`pool-type:${poolType}`}
            motionProps={{
              transition: {
                delay: 0.04 * row.index,
              },
            }}
          >
            <div
              className={cn(
                "body-2 flex flex-row items-center gap-2 text-black"
              )}
            >
              <span className="leading-5">
                {(() => {
                  if (poolType === MULTIPLIER_ASSET_TYPE.MAJOR_ONLY) {
                    return "Major";
                  } else if (
                    poolType === MULTIPLIER_ASSET_TYPE.THIRD_PARTY_ONLY
                  ) {
                    return "Third-Party";
                  } else if (poolType === MULTIPLIER_ASSET_TYPE.HYBRID) {
                    return "Hybrid";
                  } else {
                    return "Unknown";
                  }
                })()}
              </span>
              {marketMultiplier && (
                <SecondaryLabel className="h-full rounded-full border border-success px-2 py-1 text-xs font-semibold text-success">
                  {marketMultiplier}x
                </SecondaryLabel>
              )}
            </div>
          </ContentFlow>
        </div>
      );
    },
  },
];

export const sonicColumns: ColumnDef<ExploreMarketColumnDataElement>[] = [
  ...(exploreMarketColumns as any).filter(
    (column: any) => column.accessorKey !== "market_type"
  ),
  {
    accessorKey: "appType",
    enableResizing: true,
    // header: exploreColumnNames.action,
    enableSorting: true,
    header: ({ column }: { column: any }) => {
      return <HeaderWrapper column={column} />;
    },
    meta: "min-w-44 w-44",
    cell: ({ row }) => {
      const appType = row.original.marketMetadata?.sonic?.appType ?? "unknown";

      return (
        <div key={`market:app-type`} className={cn("flex h-fit w-fit")}>
          <ContentFlow
            customKey={`app-type:${appType}`}
            motionProps={{
              transition: {
                delay: 0.04 * row.index,
              },
            }}
            className="w-44 text-center"
          >
            <Tooltip>
              <TooltipTrigger>
                <SecondaryLabel className="h-full rounded-full border border-success px-2 py-1 text-xs font-semibold text-success">
                  <div
                    className={cn("body-2 flex flex-row items-center gap-2")}
                  >
                    <span className="leading-5">
                      {(() => {
                        if (appType === SONIC_APP_TYPE.EMERALD) {
                          return "Emerald";
                        } else if (appType === SONIC_APP_TYPE.SAPPHIRE) {
                          return "Sapphire";
                        } else if (appType === SONIC_APP_TYPE.RUBY) {
                          return "Ruby";
                        } else {
                          return "Unknown";
                        }
                      })()}
                    </span>
                  </div>
                </SecondaryLabel>
              </TooltipTrigger>
              {typeof window !== "undefined" &&
                createPortal(
                  <TooltipContent>
                    <span className="leading-5">
                      {(() => {
                        if (appType === SONIC_APP_TYPE.EMERALD) {
                          return "13,125 Gems allocated to App";
                        } else if (appType === SONIC_APP_TYPE.SAPPHIRE) {
                          return "8,750 Gems allocated to App";
                        } else if (appType === SONIC_APP_TYPE.RUBY) {
                          return "4,375 Gems allocated to App";
                        }
                      })()}
                    </span>
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
