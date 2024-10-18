"use client";

import React, { Fragment } from "react";
import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SpringNumber } from "@/components/composables";
import { Progress } from "@/components/ui/progress";

const StatsCardContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "h-fit w-full divide-y divide-divider overflow-hidden rounded-xl border border-divider bg-white",
        className
      )}
    >
      {props.children}
    </div>
  );
});
StatsCardContainer.displayName = "StatsCardContainer";

const StatsCardGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("grid w-full divide-x divide-divider", className)}
    {...props}
  />
));
StatsCardGrid.displayName = "StatsCardGrid";

type StatsCardGridItemProps = {
  title: string;
  info: string;
  previous_value: number;
  current_value: number;
  number_format_options: Intl.NumberFormatOptions;
  tokens?: Array<{
    symbol: string;
    image: string;
  }>;
};

const StatsCardGridItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & StatsCardGridItemProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4", className)} {...props}>
    <div className="body-2 flex h-5 w-full grow flex-row items-center space-x-2 overflow-hidden text-secondary">
      <div className="flex h-5 max-w-full flex-col items-center overflow-hidden text-ellipsis whitespace-nowrap">
        {props.title === "Earnings" ? (
          <span className="leading-5">{props.title}</span>
        ) : (
          props.title
        )}

        {/* <span className="leading-5">{props.title}</span> */}
      </div>

      <Tooltip>
        <TooltipTrigger asChild className="cursor-pointer">
          <InfoIcon strokeWidth={1.5} className="h-5 w-5 shrink-0" />
        </TooltipTrigger>
        <TooltipContent className="bg-opacity-50 backdrop-blur-sm">
          <div>{props.info}</div>
        </TooltipContent>
      </Tooltip>
    </div>

    <div className="money-3 mt-2 flex flex-row items-center space-x-1 text-primary">
      <SpringNumber
        previousValue={props.previous_value}
        currentValue={props.current_value}
        numberFormatOptions={props.number_format_options}
      />

      <div className="-mt-1 flex flex-row items-center">
        {props.tokens?.map((token, index) => {
          if (index < 4) {
            return (
              <div className={cn("relative h-5 w-5", index !== 0 && "-ml-1")}>
                <img
                  key={`token:${token.symbol}`}
                  src={token.image}
                  alt={token.symbol}
                  className={cn(
                    "absolute h-5 w-5 rounded-full border border-z2 bg-focus"
                  )}
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  </div>
));
StatsCardGridItem.displayName = "StatsCardGridItem";

type StatsCardBarProps = {
  previousProgress?: number;
  currentProgress?: number;
  progress?: number;
  active?: "true" | "false";
  progressType?: "percent" | "time";
};

const StatsCardBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & StatsCardBarProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex w-full flex-row items-center divide-x divide-divider",
      className
    )}
    {...props}
  >
    {props.progress && (
      <div className="flex w-full flex-row items-center space-x-4 px-4 py-2">
        <Progress value={props.progress} className="w-full" />
        <div className="caption flex flex-row items-center space-x-1 whitespace-nowrap text-tertiary">
          {props.progressType === "percent" ? (
            <Fragment>
              <SpringNumber
                previousValue={props.previousProgress / 100}
                currentValue={props.currentProgress / 100}
                numberFormatOptions={{
                  style: "percent",
                  maximumFractionDigits: 0,
                }}
                defaultColor="text-tertiary"
              />
              <div>Full</div>
            </Fragment>
          ) : (
            <div>Available in {Math.floor(Math.random() * 20) + 1} days</div>
          )}
        </div>
      </div>
    )}

    {props.active && (
      <div className="flex flex-row items-center space-x-2 px-4 py-2">
        <div className="relative flex h-2 w-2">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ease-in-out",
              props.active === "true" ? "bg-success" : "hidden"
            )}
          ></span>
          <span
            className={cn(
              "relative inline-flex h-2 w-2 rounded-full",
              props.active === "true" ? "bg-success" : "bg-warning"
            )}
          ></span>
        </div>
        <div className="caption relative text-tertiary">
          <div className="">
            {props.active === "true" ? "Active" : "Inactive"}
          </div>
        </div>
      </div>
    )}
  </div>
));
StatsCardBar.displayName = "StatsCardBar";

type StatsCardComponent = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
> & {
  Container: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;
  Grid: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;
  GridItem: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> &
      React.RefAttributes<HTMLDivElement> &
      StatsCardGridItemProps
  >;
  Bar: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> &
      React.RefAttributes<HTMLDivElement> &
      StatsCardBarProps
  >;
};

const StatsCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
)) as StatsCardComponent;
StatsCard.displayName = "StatsCard";

StatsCard.Container = StatsCardContainer;
StatsCard.Grid = StatsCardGrid;
StatsCard.GridItem = StatsCardGridItem;
StatsCard.Bar = StatsCardBar;

export { StatsCard };
