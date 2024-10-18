"use client";

import * as React from "react";
import { add, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker12h } from "./time-picker-12h";

export function DateTimePicker({
  date,
  setDate,
  className,
  disabled,
  Suffix,
  customValue,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  disabled?: boolean;
  Suffix?: React.ReactNode;
  customValue?: string;
}) {
  // const [date, setDate] = React.useState<Date>();

  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!date) {
      setDate(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    setDate(newDateFull);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          // type="button"
          // disabled={disabled}
          // variant={"default"}
          className={cn(
            "h-9 w-full shrink-0 justify-start border border-divider bg-white text-left shadow-none drop-shadow-none hover:bg-focus",
            !date && "text-muted-foreground",
            "ring-0 focus:ring-0",
            "focus:outline-none",
            "flex cursor-pointer flex-row items-center rounded-md font-gt",
            className
          )}
        >
          <CalendarIcon
            strokeWidth={1}
            className="ml-3 mr-2 h-5 w-5 text-black"
          />
          <div className="h-5">
            <span className="leading-6 text-black">
              {customValue
                ? customValue
                : date
                  ? format(date, "PPP")
                  : // ? format(date, "PPP HH:mm:ss")
                    "Pick Timestamp"}
            </span>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-auto p-0"
          // "max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width]"
        )}
      >
        <Calendar
          disabled={disabled}
          mode="single"
          selected={date}
          onSelect={(d: any) => handleSelect(d)}
          className="shadow-none drop-shadow-none"
        />
        <div className="border-t border-divider px-5 py-3">
          <TimePicker12h setDate={setDate} date={date} />
        </div>
        {Suffix && (
          <div className="flex flex-row items-center justify-between border-t border-divider px-5 py-3">
            {Suffix}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
