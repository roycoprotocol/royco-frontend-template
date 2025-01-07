import { cn } from "@/lib/utils";
import {
  SpringNumber,
  IncentiveBreakdown,
  YieldBreakdown,
  TokenEditor,
} from "@/components/composables";
import { EnrichedMarketDataType } from "royco/queries";
import {
  AipBreakdown,
  AssetBreakdown,
  InfoGrid,
  InfoTip,
  TokenDisplayer,
} from "@/components/common";

import {
  exploreColumnNames,
  exploreColumnTooltips,
  useExplore,
} from "@/store/use-explore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createPortal } from "react-dom";
import React, { Fragment } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BadgeAlertIcon,
  BadgeCheckIcon,
  SparklesIcon,
} from "lucide-react";
import { PoolEditor } from "./ui";
import { ColumnDef, ColumnDefBase } from "@tanstack/react-table";
import { ArrowDownUpIcon } from "lucide-react";
import { capitalize } from "lodash";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MarketType } from "@/store";

export const HeaderWrapper = React.forwardRef<HTMLDivElement, any>(
  ({ className, column, ...props }, ref) => {
    const { exploreSort, setExploreSort } = useExplore();

    const name = (exploreColumnNames as any)[column.id];
    const tooltip = (exploreColumnTooltips as any)[column.id];

    return (
      <div
        onClick={() => {
          if (column.id === "market_type") {
            return;
          }

          if (column.getCanSort()) {
            setExploreSort([
              {
                id: column.id,
                desc:
                  exploreSort[0].id === column.id ? !exploreSort[0].desc : true,
              },
            ]);
          }
        }}
        className={cn(
          "flex flex-row items-center",
          column.getCanSort() &&
            column.id !== "market_type" &&
            "cursor-pointer text-primary transition-all duration-200 ease-in-out hover:text-black",
          className
        )}
        {...props}
      >
        <div className="body-2 item-center flex justify-center gap-1">
          <span>{name}</span>
          {tooltip && <InfoTip>{tooltip}</InfoTip>}
        </div>
        {column.getCanSort() && column.id !== "market_type" && (
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

/**
 * @description Column definitions for the table
 * @note For cell formatting @see {@link https://tanstack.com/table/v8/docs/guide/column-defs}
 */
/**
 * @TODO Strictly type this
 */
// @ts-ignore
export const columns: ColumnDef<EnrichedMarketDataType> = [
  {
    accessorKey: "name",
    enableResizing: false,

    enableSorting: true,
    header: ({ column }: { column: any }) => {
      return <HeaderWrapper column={column} />;
    },
    meta: {
      className: "min-w-60 shrink-0 w-full",
    },
    cell: (props: any) => {
      return (
        <div
          key={`${props.view}:market:${props.row.original.id}:name`}
          className={cn(
            props.column.columnDef.meta.className,
            props.view === "list" && "body-2 pr-7 text-black",
            props.view === "grid" && "body-1 pr-0 text-black",
            "min-w flex w-full flex-row items-center"
          )}
        >
          <div className="flex min-w-0 flex-row items-center">
            <TokenDisplayer
              tokens={[props.row.original.input_token_data]}
              symbols={false}
              className={cn("mr-1 flex items-center")}
            />

            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              {props.row.original.name.trim()}
            </div>

            <div className="ml-2">
              <Tooltip>
                <TooltipTrigger className="flex flex-col place-content-center items-center">
                  {props.row.original.is_verified ? (
                    <BadgeCheckIcon className="-mt-[0.15rem] h-7 w-7 fill-success text-white" />
                  ) : (
                    <BadgeAlertIcon className="-mt-[0.15rem] h-7 w-7 fill-error text-white" />
                  )}
                </TooltipTrigger>
                {typeof window !== "undefined" &&
                  createPortal(
                    <TooltipContent className="z-9999">
                      {props.row.original.is_verified ? (
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
            </div>
          </div>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "input_token_id",
  //   enableResizing: false,
  //   // header: exploreColumnNames.assets_info,

  //   enableSorting: false,
  //   header: ({ column }: { column: any }) => {
  //     return <HeaderWrapper column={column} />;
  //   },

  //   meta: {
  //     className: "min-w-24",
  //   },
  //   cell: (props: any) => {
  //     return (
  //       <TokenDisplayer
  //         hover
  //         bounce
  //         tokens={[props.row.original.input_token_data]}
  //         symbols={true}
  //         // key={`${props.view}:market:${props.row.original.id}:assets`}
  //         className={cn(
  //           props.view === "list" && props.column.columnDef.meta.className,
  //           "flex flex-row place-content-start items-center text-left",
  //           props.view === "grid" &&
  //             "body-2 w-fit shrink-0 rounded-full border border-divider px-[0.438rem] py-1 text-secondary"
  //         )}
  //       />
  //     );
  //   },
  // },
  {
    accessorKey: "chain_id",
    enableResizing: false,
    // header: exploreColumnNames.chain,
    enableSorting: false,
    header: ({ column }: { column: any }) => {
      return <HeaderWrapper column={column} />;
    },

    meta: {
      className: "min-w-28",
    },
    cell: (props: any) => {
      return (
        <div
          key={`${props.view}:market:${props.row.original.id}:chain-id`}
          className={cn(
            props.view === "list" && props.column.columnDef.meta.className,
            "flex h-fit capitalize",
            props.view === "grid" &&
              "body-2 min-w-fit shrink-0 rounded-full border border-divider px-[0.438rem] py-1 text-secondary"
          )}
        >
          <TokenDisplayer
            hover
            bounce
            tokens={[props.row.original.chain_data]}
            symbols={props.view === "list" ? false : true}
            className={cn(
              props.column.columnDef.meta.className,
              "flex flex-row place-content-start items-center gap-2 text-left",
              props.view === "grid" ? "mr-2 min-w-fit" : "pl-[0.75rem]"
            )}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "locked_quantity_usd",
    enableResizing: false,
    // header: exploreColumnNames.tvl,
    enableSorting: true,
    header: ({ column }: { column: any }) => {
      return <HeaderWrapper column={column} />;
    },

    meta: {
      className: "min-w-32",
    },
    cell: (props: any) => {
      const rowIndex = props.row.index;

      let previousValue = 0;

      if (
        props.placeholderDatas[0] !== null &&
        rowIndex < props.placeholderDatas[0].length
      ) {
        previousValue =
          props.placeholderDatas[0][rowIndex].locked_quantity_usd || 0;
      }

      const currentValue = props.row.original.locked_quantity_usd;

      return (
        <div
          key={`${props.view}:market:${props.row.original.id}:locked_quantity_usd`}
          className={cn(
            props.view === "list" && props.column.columnDef.meta.className,
            "tabular-nums",
            props.view === "grid" &&
              "body-2 flex w-fit shrink-0 flex-row space-x-1 rounded-full border border-divider px-[0.438rem] py-1 text-black"
          )}
        >
          <Tooltip>
            <TooltipTrigger
              className={cn(
                "flex cursor-pointer",
                props.view === "grid" &&
                  "flex-row flex-nowrap items-center space-x-1"
              )}
            >
              <SpringNumber
                defaultColor={
                  props.view === "grid" ? "text-secondary" : "text-black"
                }
                previousValue={previousValue}
                currentValue={currentValue}
                numberFormatOptions={{
                  style: "currency",
                  currency: "USD",
                  notation: "compact",
                  useGrouping: true,
                  // notation: props.view === "grid" ? "compact" : "standard",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }}
                className={cn("h-5")}
                spanClassName={cn("leading-5")}
              />

              {props.view === "grid" && (
                <div className="text-secondary">
                  <span className="leading-5">TVL</span>
                </div>
              )}
            </TooltipTrigger>
          </Tooltip>
        </div>
      );
    },
  },
  {
    accessorKey: "total_incentive_amounts_usd",
    enableResizing: false,
    // header: exploreColumnNames.rewards,
    enableSorting: true,
    header: ({ column }: { column: any }) => {
      return <HeaderWrapper column={column} />;
    },

    meta: {
      className: "min-w-48",
    },
    cell: (props: any) => {
      const rowIndex = props.row.index;
      const tokens = props.row.original.incentive_tokens_data;
      const points = tokens.filter((token: any) => token.type === "point");

      const previousPointsValue = 0;
      const currentPointsValue = points[0]?.token_amount || 0;

      if (!props) return null;

      return (
        <div
          key={`${props.view}:market:${props.row.original.id}:total_incentive_amounts_usd`}
          className={cn(
            props.view === "list" && props.column.columnDef.meta.className,
            "flex flex-row items-center gap-2 tabular-nums",
            props.view === "grid" &&
              "money-3 flex-row-reverse place-content-start text-primary"
          )}
        >
          <HoverCard openDelay={200} closeDelay={200}>
            <HoverCardTrigger className={cn("flex cursor-pointer items-end")}>
              {points.length > 0 ? (
                <div className="flex flex-row items-center gap-1">
                  <SpringNumber
                    previousValue={previousPointsValue}
                    currentValue={currentPointsValue}
                    numberFormatOptions={{
                      notation: "compact",
                      useGrouping: true,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }}
                    className={cn(
                      props.view === "grid" && InfoGrid.Content.Primary.Wrapper,
                      props.view === "list" && "h-5"
                    )}
                    spanClassName={cn(
                      props.view === "grid" && InfoGrid.Content.Primary.Span,
                      props.view === "list" && "leading-5"
                    )}
                  />
                  <TokenDisplayer
                    hover
                    bounce
                    className="gap-0"
                    symbolClassName="gap-0"
                    tokens={points}
                    symbols={false}
                    size={props.view === "list" ? 4 : 6}
                  />
                  <span className="font-gt text-base font-300">Points</span>
                </div>
              ) : (
                props.row.original.total_incentive_amounts_usd > 0 && (
                  <TokenDisplayer
                    hover
                    bounce
                    className="gap-0"
                    symbolClassName="gap-0"
                    tokens={tokens}
                    symbols={false}
                    size={props.view === "list" ? 4 : 6}
                  />
                )
              )}
            </HoverCardTrigger>
            {typeof window !== "undefined" &&
              props.row.original.incentive_tokens_data.length > 0 &&
              createPortal(
                <HoverCardContent
                  className="w-64"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IncentiveBreakdown
                    base_key={props.row.original.id}
                    breakdown={tokens}
                  />
                </HoverCardContent>,
                document.body
              )}
          </HoverCard>
        </div>
      );
    },
  },
  {
    accessorKey: "annual_change_ratio",
    enableResizing: false,
    // header: exploreColumnNames.aip,
    enableSorting: true,
    header: ({ column }: { column: any }) => {
      return <HeaderWrapper column={column} />;
    },

    meta: {
      className: "min-w-32",
    },
    cell: (props: any) => {
      const rowIndex = props.row.index;

      const marketType = props.row.original.market_type;

      let previousValue = 0;

      if (
        props.placeholderDatas[0] !== null &&
        rowIndex < props.placeholderDatas[0].length &&
        props.placeholderDatas[0][rowIndex].annual_change_ratio !== undefined &&
        props.placeholderDatas[0][rowIndex].annual_change_ratio !== null &&
        props.placeholderDatas[0][rowIndex].annual_change_ratio !==
          Math.pow(10, 18)
      ) {
        previousValue =
          props.placeholderDatas[0][rowIndex].annual_change_ratio || 0;
      }

      let currentValue = props.row.original.annual_change_ratio;

      const breakdowns = props.row.original.yield_breakdown.filter(
        (item: any) =>
          item.category === "base" &&
          item.type === "point" &&
          item.annual_change_ratio === 0
      );

      return (
        <div
          key={`${props.view}:market:${props.row.original.id}:aip`}
          className={cn(
            props.view === "list" && props.column.columnDef.meta.className,
            "flex h-5 flex-row items-center tabular-nums",
            props.view === "grid" && "money-3 text-primary",
            "group"
          )}
        >
          {breakdowns.length > 0 ? (
            <HoverCard openDelay={200} closeDelay={200}>
              <HoverCardTrigger
                className="cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                Calculate
              </HoverCardTrigger>
              {typeof window !== "undefined" &&
                createPortal(
                  <HoverCardContent
                    onClick={(e) => e.stopPropagation()}
                    className="w-96 overflow-hidden p-0"
                  >
                    <TokenEditor
                      closeHoverCard={() => {}}
                      token_data={{
                        ...breakdowns[0],
                        fdv: breakdowns[0].fdv ?? 0,
                        total_supply: breakdowns[0].total_supply
                          ? breakdowns[0].total_supply === 0
                            ? 1
                            : breakdowns[0].total_supply
                          : 0,
                        price: breakdowns[0].price ?? 0,
                        allocation: breakdowns[0].allocation
                          ? breakdowns[0].allocation * 100
                          : 100,
                        token_amount: breakdowns[0].token_amount ?? 0,
                      }}
                    />
                  </HoverCardContent>,
                  document.body
                )}
            </HoverCard>
          ) : (
            <YieldBreakdown
              onClick={(e) => e.stopPropagation()}
              breakdown={props.row.original.yield_breakdown}
              base_key={props.row.original.id}
              marketType={marketType}
            >
              <div className="flex flex-row items-center gap-2">
                <>
                  <SpringNumber
                    previousValue={previousValue}
                    currentValue={currentValue}
                    numberFormatOptions={{
                      style: "percent",
                      notation: "compact",
                      useGrouping: true,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }}
                    className={cn(
                      props.view === "grid" && InfoGrid.Content.Primary.Wrapper,
                      props.view === "list" && "h-5"
                    )}
                    spanClassName={cn(
                      props.view === "grid" && InfoGrid.Content.Primary.Span,
                      props.view === "list" && "leading-5"
                    )}
                  />

                  <SparklesIcon
                    className={cn(
                      props.view === "list" && "h-4 w-4",
                      props.view === "grid" && "h-5 w-5"
                    )}
                    color="#3CC27A"
                    strokeWidth={3}
                  />
                </>
              </div>
            </YieldBreakdown>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "market_type",
    enableResizing: false,
    // header: exploreColumnNames.action,
    enableSorting: true,
    header: ({ column }: { column: any }) => {
      return <HeaderWrapper column={column} />;
    },

    meta: {
      className: "min-w-44",
    },
    cell: (props: any) => {
      return (
        <div
          key={`${props.view}:market:${props.row.original.id}:${props.row.original.reward_style}:market-type`}
          className={cn(
            props.view === "list" && props.column.columnDef.meta.className,
            "flex h-fit w-fit",
            props.view === "grid" &&
              "body-2 w-fit shrink-0 rounded-full border border-divider px-[0.438rem] py-1 text-secondary"
          )}
        >
          <div
            className={cn(
              "body-2",
              props.view === "grid" && "text-secondary",
              props.view === "list" && "text-black"
            )}
          >
            <span className="leading-5">
              {props.row.original.market_type === MarketType.vault.value
                ? "No"
                : props.row.original.reward_style !== 2
                  ? "Yes"
                  : "No, but forfeit"}
            </span>
          </div>

          {/* {props.row.original.market_type === 0 ? "Recipe" : "Vault"} */}
        </div>
      );
    },
  },
];
