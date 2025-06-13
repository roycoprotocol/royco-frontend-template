import { cn } from "@/lib/utils";
import React from "react";

interface PrimaryLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const PrimaryLabel = React.forwardRef<HTMLDivElement, PrimaryLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-row items-start font-gt text-2xl font-medium text-_primary_",
          className
        )}
        {...props}
      >
        {props.children}
      </div>
    );
  }
);

interface SecondaryLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SecondaryLabel = React.forwardRef<
  HTMLDivElement,
  SecondaryLabelProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-row items-start font-gt text-sm font-normal text-_secondary_",
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  );
});

interface TertiaryLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TertiaryLabel = React.forwardRef<
  HTMLDivElement,
  TertiaryLabelProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-row items-start font-gt text-xs font-medium tracking-wide text-_secondary_",
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  );
});
