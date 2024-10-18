import React from "react";
import { cn } from "@/lib/utils";

/**
 * @description Info Grid Container
 */
const InfoGridContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "grid divide-x divide-divider rounded-xl border border-divider bg-white",
        className
      )}
    >
      {props.children}
    </div>
  );
});
InfoGridContainer.displayName = "InfoGridContainer";

/**
 * @description Info Grid Item
 */
const InfoGridItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1 p-4", className)}
    {...props}
  />
));
InfoGridItem.displayName = "InfoGridItem";

/**
 * @description Info Grid Content Primary Type
 */
type InfoGridContentPrimaryComponent = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
> & {
  Wrapper: string;
  Span: string;
};

/**
 * @description Info Grid Content Primary
 */
const InfoGridContentPrimary = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "money-3 hide-scrollbar flex flex-row items-center space-x-[0.375rem] overflow-y-hidden overflow-x-scroll text-primary ",
      className
    )}
    {...props}
  />
)) as InfoGridContentPrimaryComponent;
InfoGridContentPrimary.displayName = "InfoGridContentPrimary";
InfoGridContentPrimary.Wrapper = "h-9";
InfoGridContentPrimary.Span = "leading-9";

/**
 * @description Info Grid Content Secondary Type
 */
type InfoGridContentSecondaryComponent = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
> & {
  Wrapper: string;
  Span: string;
};

/**
 * @description Info Grid Content Secondary
 */
const InfoGridContentSecondary = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "body-2 hide-scrollbar flex flex-row items-center space-x-[0.375rem] overflow-y-hidden overflow-x-scroll text-secondary",
      className
    )}
    {...props}
  />
)) as InfoGridContentSecondaryComponent;
InfoGridContentSecondary.displayName = "InfoGridContentSecondary";
InfoGridContentSecondary.Wrapper = "h-5";
InfoGridContentSecondary.Span = "leading-5";

/**
 * @description Info Grid Content Type
 */
type InfoGridContentComponent = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
> & {
  Primary: typeof InfoGridContentPrimary;
  Secondary: typeof InfoGridContentSecondary;
};

/**
 * @description Info Grid Content
 */
const InfoGridContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
)) as InfoGridContentComponent;
InfoGridContent.displayName = "InfoGridContent";

/**
 * @description Info Grid Content API
 */
InfoGridContent.Primary = InfoGridContentPrimary;
InfoGridContent.Secondary = InfoGridContentSecondary;

/**
 * @description Info Grid Type
 */
type InfoGridComponent = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
> & {
  Container: typeof InfoGridContainer;
  Item: typeof InfoGridItem;
  Content: typeof InfoGridContent;
};

/**
 * @description Info Grid
 */
const InfoGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
)) as InfoGridComponent;
InfoGrid.displayName = "InfoGrid";

/**
 * @description Info Grid Component API
 */
InfoGrid.Container = InfoGridContainer;
InfoGrid.Item = InfoGridItem;
InfoGrid.Content = InfoGridContent;

export { InfoGrid };
