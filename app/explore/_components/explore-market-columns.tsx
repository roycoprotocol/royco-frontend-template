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
  ArrowDownIcon,
  ArrowUpIcon,
  BadgeAlertIcon,
  BadgeCheckIcon,
  SparklesIcon,
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownUpIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MarketType } from "@/store";
import validator from "validator";
import { MULTIPLIER_ASSET_TYPE } from "royco/boyco";
import { SecondaryLabel } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/composables";
import { SONIC_APP_TYPE } from "royco/sonic";
import { TokenEstimator } from "@/app/_components/token-estimator/token-estimator";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { marketSortAtom } from "@/store/explore/explore-market";
import { EnrichedMarket } from "royco/api";
import { SupportedChainMap } from "royco/constants";
import NumberFlow from "@number-flow/react";
import { ContentFlow } from "@/components/animations/content-flow";
import { ContentFade } from "@/components/animations/content-fade";

export const exploreColumnNames = {
  name: "Market",
  chainId: "Chain",
  fillableUsd: "Fillable",
  incentiveTokens: "Incentives",
  yieldRate: "Net APY",
  input_token_id: "Asset",
  chain_id: "Chain",
  rewardStyle: "Lockup",
  chain: "Chain",
  appType: "Gem Allocation",
  poolType: "Pool Type",
  inputTokenTag: "Asset Type",
};

export const HeaderWrapper = React.forwardRef<HTMLDivElement, any>(
  ({ className, column, ...props }, ref) => {
    const [exploreSort, setExploreSort] = useAtom(marketSortAtom);

    const name = (exploreColumnNames as any)[column.id];
    const enableSort = name === "TVL" && column.getCanSort();

    return (
      <div
        onClick={() => {
          if (!enableSort) {
            return;
          }

          setExploreSort([
            {
              id: column.id,
              desc:
                exploreSort[0].id === column.id ? !exploreSort[0].desc : true,
            },
          ]);
        }}
        className={cn(
          "flex flex-row items-center text-primary",
          enableSort &&
            "cursor-pointer transition-all duration-200 ease-in-out hover:text-black",
          className
        )}
        {...props}
      >
        <div className="body-2 item-center flex justify-center gap-1">
          <span>{name}</span>
        </div>
        {enableSort && (
          <div className="body-2 ml-[6px] h-4 w-4 opacity-90">
            {exploreSort[0].id === column.id ? (
              exploreSort[0].desc ? (
                <ArrowUpIcon strokeWidth={1.5} className="h-full w-full" />
              ) : (
                <ArrowDownIcon strokeWidth={1.5} className="h-full w-full" />
              )
            ) : (
              <ArrowDownUpIcon strokeWidth={1.5} className="h-full w-full" />
            )}
          </div>
        )}
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
      meta: "min-w-60",
      cell: ({ row }) => {
        return (
          <div
            key={`market:name`}
            className={cn(
              "body-2 text-black",
              "flex w-full flex-row items-center justify-between"
            )}
          >
            <ContentFlow
              customKey={row.original.id}
              className="w-60"
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

            <div className="ml-2">
              <ContentFlow customKey={`isVerified:${row.original.isVerified}`}>
                <Tooltip>
                  <TooltipTrigger className="flex flex-col place-content-center items-center">
                    {row.original.isVerified ? (
                      <BadgeCheckIcon className="-mt-[0.15rem] h-7 w-7 fill-success text-white" />
                    ) : (
                      <BadgeAlertIcon className="-mt-[0.15rem] h-7 w-7 fill-error text-white" />
                    )}
                  </TooltipTrigger>
                  {typeof window !== "undefined" &&
                    createPortal(
                      <TooltipContent className="z-9999">
                        {row.original.isVerified ? (
                          <div className="flex flex-col gap-1">
                            <div className="text-xs font-medium text-black">
                              This market is verified.
                            </div>
                            <a
                              className="text-xs underline"
                              href="https://docs.royco.org/for-incentive-providers/verify-a-market"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Learn more.
                            </a>
                          </div>
                        ) : (
                          "WARNING: UNVERIFIED MARKET"
                        )}
                      </TooltipContent>,
                      document.body
                    )}
                </Tooltip>
              </ContentFlow>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "chainId",
      enableResizing: true,
      // header: exploreColumnNames.chain,
      enableSorting: false,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} className="justify-center" />;
      },

      meta: "min-w-28",
      cell: ({ row }) => {
        return (
          <div
            key={`market:chainId`}
            className={cn("flex h-fit flex-col capitalize")}
          >
            <ContentFade
              customKey={row.original.chainId.toString()}
              motionProps={{
                transition: {
                  delay: 0.04 * row.index,
                },
              }}
            >
              <TokenDisplayer
                hover
                bounce
                tokens={[SupportedChainMap[row.original.chainId]]}
                symbols={false}
                className={cn(
                  "flex flex-row place-content-start items-center gap-2 text-left",
                  "pl-[0.75rem]"
                )}
              />
            </ContentFade>
          </div>
        );
      },
    },
    {
      accessorKey: "fillableUsd",
      enableResizing: true,
      enableSorting: true,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} className="justify-center" />;
      },
      meta: "min-w-32 w-32",
      cell: ({ row }) => {
        return (
          <div key={`market:fillableUsd`} className={cn("tabular-nums")}>
            {row.original.marketType === 0 ? (
              <div className={cn("flex cursor-pointer font-light")}>
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
      accessorKey: "incentiveTokens",
      enableResizing: true,
      // header: exploreColumnNames.rewards,
      enableSorting: true,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} className="justify-center" />;
      },

      meta: "min-w-60 w-60",
      cell: ({ row }) => {
        const breakdowns = row.original.incentiveTokens;
        const points = breakdowns.filter(
          (token: any) => token.type === "point"
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
                  {row.original.incentiveTokens.length > 0 ? (
                    <TokenDisplayer
                      bounce
                      className="gap-0"
                      symbolClassName="gap-0"
                      tokens={row.original.incentiveTokens}
                      symbols={false}
                      size={5}
                    />
                  ) : (
                    <div className="flex flex-row items-center gap-1">
                      <span className="font-gt text-base font-300">N/A</span>
                    </div>
                  )}
                </HoverCardTrigger>

                {typeof window !== "undefined" &&
                  breakdowns.length > 0 &&
                  createPortal(
                    <HoverCardContent
                      className="w-fit max-w-96"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IncentiveBreakdown
                        baseKey={row.original.id}
                        activeIncentives={row.original.activeIncentives}
                        nativeIncentives={row.original.nativeIncentives}
                        underlyingIncentives={row.original.underlyingIncentives}
                        externalIncentives={row.original.externalIncentives}
                      />
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
      accessorKey: "yieldRate",
      enableResizing: true,
      // header: exploreColumnNames.aip,
      enableSorting: true,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} className="justify-center" />;
      },

      meta: "min-w-36",
      cell: ({ row }) => {
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
                  <YieldBreakdown
                    onClick={(e) => e.stopPropagation()}
                    activeIncentives={row.original.activeIncentives}
                    nativeIncentives={row.original.nativeIncentives}
                    underlyingIncentives={row.original.underlyingIncentives}
                    externalIncentives={row.original.externalIncentives}
                    baseKey={row.original.id}
                    marketType={row.original.marketType}
                  >
                    <div className="flex flex-row items-center gap-2">
                      <>
                        <NumberFlow
                          isolate
                          value={row.original.yieldRate}
                          format={{
                            style: "percent",
                            notation: "compact",
                            useGrouping: true,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }}
                        />

                        <SparklesIcon
                          className={cn("h-4 w-4")}
                          color="#3CC27A"
                          strokeWidth={2}
                        />
                      </>
                    </div>
                  </YieldBreakdown>
                );
              }
            })()}
          </div>
        );
      },
    },
    {
      accessorKey: "rewardStyle",
      enableResizing: true,
      // header: exploreColumnNames.action,
      enableSorting: true,
      header: ({ column }: { column: any }) => {
        return <HeaderWrapper column={column} className="justify-center" />;
      },
      meta: "min-w-44 w-44",
      cell: ({ row }) => {
        const value =
          row.original.marketType === MarketType.vault.value
            ? "No"
            : row.original.rewardStyle !== 2
              ? "Yes"
              : "No, but forfeit";

        return (
          <div key={`market:rewardStyle`} className={cn("flex h-fit w-fit")}>
            <ContentFlow
              customKey={`${value}`}
              motionProps={{
                transition: {
                  delay: 0.04 * row.index,
                },
              }}
              className="w-44 text-center"
            >
              <div className={cn("body-2 text-black")}>
                <span className="leading-5">{value}</span>
              </div>
            </ContentFlow>
          </div>
        );
      },
    },
  ];

export const plumeColumns: ColumnDef<ExploreMarketColumnDataElement>[] = [
  // ...exploreMarketColumns,
  {
    accessorKey: "inputTokenTag",
    enableResizing: true,
    // header: exploreColumnNames.action,
    enableSorting: true,
    header: ({ column }: { column: any }) => {
      return <HeaderWrapper column={column} className="justify-center" />;
    },
    meta: "min-w-44 w-44",
    cell: ({ row }) => {
      let value = "Unknown";

      if (row.original.inputToken.tag === "stable") {
        value = "Stable";
      } else if (row.original.inputToken.tag === "volatile") {
        value = "Volatile";
      }

      return (
        <div key={`market:rewardStyle`} className={cn("flex h-fit w-fit")}>
          <ContentFlow
            customKey={`${value}`}
            motionProps={{
              transition: {
                delay: 0.04 * row.index,
              },
            }}
            className="w-44 text-center"
          >
            <div className={cn("body-2 text-black")}>
              <span className="leading-5">{value}</span>
            </div>
          </ContentFlow>
        </div>
      );
    },
  },
];

export const boycoColumns: ColumnDef<ExploreMarketColumnDataElement>[] = [
  ...exploreMarketColumns.filter(
    (column: any) => column.accessorKey !== "market_type"
  ),
  {
    accessorKey: "poolType",
    enableResizing: true,
    // header: exploreColumnNames.action,
    enableSorting: true,
    header: ({ column }: { column: any }) => {
      return <HeaderWrapper column={column} className="justify-center" />;
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
      return <HeaderWrapper column={column} className="justify-center" />;
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
