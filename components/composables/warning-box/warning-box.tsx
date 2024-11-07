import { TriangleAlertIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export const WarningBox = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    text: string;
  }
>(({ className, text, title = "WARNING", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col rounded-xl bg-error p-5 font-gt text-sm font-300 text-white",
        className
      )}
    >
      <div className="flex flex-row items-center justify-center">
        <div className="h-6 w-6 shrink-0">
          <TriangleAlertIcon strokeWidth={1.5} className="h-6 w-6 text-white" />
        </div>

        <div className="ml-1 h-6 text-wrap text-center text-lg font-normal text-white">
          <span className="leading-2">{title}</span>
        </div>
      </div>

      <div className="mt-2 flex w-full text-base leading-tight">{text}</div>
    </div>
  );
});
