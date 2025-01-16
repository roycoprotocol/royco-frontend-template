import React from "react";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";

export const DeleteTokenButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      onClick={props.onClick}
      ref={ref}
      className={cn(
        "flex h-8 w-8 shrink-0 cursor-pointer flex-col place-content-center items-center rounded-lg bg-error text-white transition-all duration-200 ease-in-out hover:opacity-80",
        className
      )}
      {...props}
    >
      <Trash2Icon strokeWidth={2} className="h-4 w-4" />
    </div>
  );
});
