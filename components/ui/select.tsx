"use client";

import * as React from "react";
import { ChevronUpIcon } from "@radix-ui/react-icons";

import { ChevronDownIcon } from "lucide-react";

import * as SelectPrimitive from "@radix-ui/react-select";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    noIcon?: boolean;
  }
>(({ className, noIcon, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between whitespace-nowrap rounded-md border border-divider bg-transparent px-3 py-[0.563rem]  placeholder:text-[#94A3B8] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&[data-state=closed]>svg]:rotate-0 [&[data-state=open]>svg]:-rotate-180",
      className
    )}
    {...props}
  >
    {children}

    {noIcon === true ? null : (
      <SelectPrimitive.Icon
        asChild
        className="transition-transform duration-200 ease-in-out"
      >
        <ChevronDownIcon
          strokeWidth={1.5}
          className={cn("-mt-[0.15rem] !h-5 !w-5 shrink-0 text-secondary")}
        />
      </SelectPrimitive.Icon>
    )}
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUpIcon className="data-[state=open] !h-5 !w-5 shrink-0 rotate-180" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDownIcon className="!h-5 !w-5 shrink-0" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-60 min-w-[8rem] overflow-hidden rounded-md border border-divider bg-white text-primary shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        "",
        className
      )}
      position={position}
      {...props}
    >
      {/* <SelectScrollUpButton /> */}
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      {/* <SelectScrollDownButton /> */}
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("body-2 px-2 py-1.5", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "body-2 relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-2 pr-8 text-primary outline-none transition-all duration-200 ease-in-out focus:bg-focus focus:text-black data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-5 w-5 items-center justify-center">
      <AnimatePresence initial={false} mode="popLayout">
        <SelectPrimitive.ItemIndicator>
          {/* <CheckIcon className="h-5 w-5 text-secondary" /> */}
          <motion.svg
            key="check-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-check h-5 w-5 text-secondary transition-all duration-200 ease-in-out"
          >
            <motion.path
              initial={{ pathLength: 0, pathOffset: 1 }}
              animate={{ pathLength: 1, pathOffset: 0 }}
              exit={{ pathLength: 0, pathOffset: 0 }}
              transition={{
                duration: 0.15,
                type: "spring",
                bounce: 0,
                ease: "easeInOut",
              }}
              d="M20 6 9 17l-5-5"
            />
          </motion.svg>
        </SelectPrimitive.ItemIndicator>
      </AnimatePresence>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-divider dark:bg-slate-800", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
