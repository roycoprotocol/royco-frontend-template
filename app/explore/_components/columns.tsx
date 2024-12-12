import { cn } from "@/lib/utils";
import { SpringNumber } from "@/components/composables";
import { EnrichedMarketDataType } from "royco/queries";
import {
  AipBreakdown,
  AssetBreakdown,
  IncentiveBreakdown,
  InfoGrid,
  InfoTip,
  TokenDisplayer,
} from "@/components/common";

import { exploreColumnNames, useExplore } from "@/store/use-explore";
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
  CircleCheckIcon,
  EllipsisVerticalIcon,
} from "lucide-react";
import { PoolEditor } from "./ui";
import { ColumnDef, ColumnDefBase } from "@tanstack/react-table";
import { ArrowDownUpIcon } from "lucide-react";
import { capitalize } from "lodash";
import { stkGHO_MARKET_ID } from "@/app/market/[chain_id]/[market_type]/[market_id]/_components/market-info/market-info";

export const HeaderWrapper = React.forwardRef<HTMLDivElement, any>(
  ({ className, column, ...props }, ref) => {
    const { exploreSort, setExploreSort } = useExplore();

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
        <div className="body-2 h-5">
          <span className="leading-5">
            {
              // @ts-ignore
              exploreColumnNames[column.id]
            }
          </span>
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
                      {props.row.original.is_verified
                        ? "Verified Market"
                        : "WARNING: UNVERIFIED MARKET"}
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
  {
    accessorKey: "input_token_id",
    enableResizing: false,
    // header: exploreColumnNames.assets_info,

    enableSorting: false,
    header: ({ column }: { column: any }) => {
      return <HeaderWrapper column={column} />;
    },

    meta: {
      className: "min-w-24",
    },
    cell: (props: any) => {
      return (
        <TokenDisplayer
          hover
          bounce
          tokens={[props.row.original.input_token_data]}
          symbols={true}
          // key={`${props.view}:market:${props.row.original.id}:assets`}
          className={cn(
            props.view === "list" && props.column.columnDef.meta.className,
            "flex flex-row place-content-start items-center text-left",
            props.view === "grid" &&
              "body-2 w-fit shrink-0 rounded-full border border-divider px-[0.438rem] py-1 text-secondary"
          )}
        />
      );
    },
  },
  {
    accessorKey: "chain_id",
    enableResizing: false,
    // header: exploreColumnNames.chain,
    enableSorting: false,
    header: ({ column }: { column: any }) => {
      return <HeaderWrapper column={column} />;
    },

    meta: {
      className: "min-w-20",
    },
    cell: (props: any) => {
      return (
        <div
          key={`${props.view}:market:${props.row.original.id}:chain-id`}
          className={cn(
            props.view === "list" && props.column.columnDef.meta.className,
            "flex h-fit capitalize",
            props.view === "grid" &&
              "body-2 w-fit shrink-0 rounded-full border border-divider px-[0.438rem] py-1 text-secondary"
          )}
        >
          <TokenDisplayer
            hover
            bounce
            tokens={[props.row.original.chain_data]}
            symbols={props.view === "list" ? false : true}
            className={cn(
              props.column.columnDef.meta.className,
              "flex flex-row place-content-start items-center gap-2  text-left",
              props.view === "grid" ? "-mr-2" : "pl-[0.75rem]"
            )}
          />
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
      className: "min-w-28",
    },
    cell: (props: any) => {
      return (
        <div
          key={`${props.view}:market:${props.row.original.id}:${props.row.original.reward_style}:market-type`}
          className={cn(
            props.view === "list" && props.column.columnDef.meta.className,
            "flex h-fit capitalize",
            props.view === "grid" &&
              "body-2 w-fit shrink-0 rounded-full border border-divider px-[0.438rem] py-1 text-secondary"
          )}
        >
          <div
            className={cn(
              "body-2 h-5",
              props.view === "grid" && "text-secondary",
              props.view === "list" && "text-black"
            )}
          >
            <span className="leading-5">
              {props.row.original.market_type === 0
                ? props.row.original.reward_style === 0
                  ? "Immediate"
                  : props.row.original.reward_style === 1
                    ? "Post-Lockup"
                    : "Forfeitable"
                : "Streamed"}
            </span>
          </div>

          {/* {props.row.original.market_type === 0 ? "Recipe" : "Vault"} */}
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
      className: "min-w-32",
    },
    cell: (props: any) => {
      const rowIndex = props.row.index;
      const tokens = props.row.original.incentive_tokens_data;

      let previousValueUsd = 0;
      let previousValueToken = 0;

      if (
        props.placeholderDatas[0] !== null &&
        rowIndex < props.placeholderDatas[0].length
      ) {
        previousValueUsd =
          props.placeholderDatas[0][rowIndex].total_incentive_amounts_usd;
      }

      const previousValue = previousValueUsd || previousValueToken;

      const currentValueUsd = props.row.original.total_incentive_amounts_usd;

      const currentValue = currentValueUsd;

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
          {props.row.original.total_incentive_amounts_usd > 0 && (
            <TokenDisplayer
              hover
              bounce
              className="gap-0"
              symbolClassName="gap-0"
              tokens={tokens}
              symbols={false}
              // key={`market:${props.row.original.id}:rewards:tokens`}
            />
          )}

          <Tooltip>
            <TooltipTrigger>
              <SpringNumber
                previousValue={previousValue}
                currentValue={currentValue}
                numberFormatOptions={{
                  style: "currency",
                  currency: "USD",
                  notation: "compact",
                  useGrouping: true,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  // minimumFractionDigits: props.view === "list" ? 2 : 0,
                  // maximumFractionDigits: props.view === "list" ? 2 : 0,
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
            </TooltipTrigger>

            {tokens.length > 0 && (
              <IncentiveBreakdown
                noEdit
                market={props.row.original}
                breakdown={tokens}
              />
            )}
          </Tooltip>
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
      if (props.row.original.id === stkGHO_MARKET_ID) {
        currentValue = parseInt(String((currentValue + 0.2) * 100)) / 100;
      }

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
          <Tooltip>
            {props.row.original.annual_change_ratio >= Math.pow(10, 18) ? (
              "0"
            ) : (
              <TooltipTrigger className={cn("flex cursor-pointer items-end")}>
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
              </TooltipTrigger>
            )}

            {/* {props.row.original.incentive_tokens_data.filter(
              (token: any) => token.annual_change_ratio !== 0
            ).length > 0 && (
              <AipBreakdown
                noEdit
                breakdown={props.row.original.incentive_tokens_data.filter(
                  (token: any) => token.annual_change_ratio !== 0
                )}
              />
            )} */}
          </Tooltip>

          {/* <PoolEditor market={props.row.original} /> */}

          {/* <button
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <EllipsisVerticalIcon
              className={cn(
                "ml-1 h-4 w-4 text-black opacity-0 transition-all duration-200 ease-in-out hover:text-primary group-hover:opacity-100"
              )}
            />
          </button> */}
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
      className: "min-w-40",
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
                <div className="h-5 text-secondary">
                  <span className="leading-5">TVL</span>
                </div>
              )}
            </TooltipTrigger>
          </Tooltip>
        </div>
      );
    },
  },
];
