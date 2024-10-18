"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col w-full space-y-4 sm:space-y-0 items-center",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1 justify-center hover:bg-focus",
        nav_button_next: "absolute right-1 justify-center hover:bg-focus",
        table: "w-full border-collapse space-y-1",
        head_row: "flex gap-1",
        head_cell: "text-tertiary rounded-md w-8 font-normal text-sm font-gt", // head cell
        row: "flex w-full mt-1 gap-1", // row
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 [&:has([aria-selected].day-outside)]:bg-slate-100/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
          "font-gt rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 justify-center w-8 p-0 font-normal aria-selected:opacity-100 aria-selected:text-white aria-selected:bg-black"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-black text-white hover:bg-slate-900 hover:text-slate-50 focus:bg-black focus:text-white",
        day_today:
          "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
        day_outside: "day-outside text-slate-500 opacity-50",
        day_disabled: "text-slate-500 opacity-50 dark:text-slate-400",
        day_range_middle:
          "aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
