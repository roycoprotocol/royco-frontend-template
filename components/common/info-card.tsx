"use client";

import React, { Fragment } from "react";

/**
 * @description Imports for styling
 */
import { cn } from "@/lib/utils";

/**
 * @description Info Card Container
 */
const InfoCardContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-fit w-full flex-col gap-3 rounded-xl border border-divider bg-white p-5",
        className
      )}
    >
      {props.children}
    </div>
  );
});
InfoCardContainer.displayName = "InfoCardContainer";

const InfoCardRowKey = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-secondary", className)} {...props} />
));

const InfoCardRowValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-row items-center gap-[0.375rem] text-black",
      className
    )}
    {...props}
  />
));

type InfoCardRowComponent = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
> & {
  Key: typeof InfoCardRowKey;
  Value: typeof InfoCardRowValue;
};

/**
 * @description Info Card Row
 */
const InfoCardRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-row items-center justify-between font-gt text-base font-light",
      className
    )}
    {...props}
  />
)) as InfoCardRowComponent;
InfoCardRow.displayName = "InfoCardRow";

/**
 * @description Info Card Row Component API
 */
InfoCardRow.Key = InfoCardRowKey;
InfoCardRow.Value = InfoCardRowValue;

/**
 * @description Info Card Type
 */
type InfoCardComponent = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
> & {
  Container: typeof InfoCardContainer;
  Row: typeof InfoCardRow;
};

/**
 * @description Info Card
 */
const InfoCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
)) as InfoCardComponent;
InfoCard.displayName = "InfoCard";

/**
 * @description Info Card Component API
 */
InfoCard.Container = InfoCardContainer;
InfoCard.Row = InfoCardRow;

export { InfoCard };
export type { InfoCardComponent };
