import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

export const InfoTip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: "sm" | "md" | "lg";
    type?: "primary" | "secondary" | "tertiary";
  }
>(({ className, size = "md", type = "secondary", ...props }, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger className={cn("cursor-pointer")}>
        <InfoIcon
          strokeWidth={1.5}
          className={cn(
            "shrink-0",
            size === "md" && "h-5 w-5",
            size === "sm" && "h-4 w-4",
            type === "secondary" && "text-secondary",
            type === "tertiary" && "text-tertiary"
          )}
        />
      </TooltipTrigger>
      {createPortal(
        <TooltipContent
          className={cn(
            "bg-white",
            size === "sm" && "text-sm leading-snug",
            "max-w-80",
            className
          )}
        >
          {props.children}
        </TooltipContent>,
        document.body
      )}
    </Tooltip>
  );
});

// export const InfoTip = ({
//   description,
//   className,
//   contentClassName,
// }: {
//   description: string;
//   className?: string;
//   contentClassName?: string;
// }) => {
//   return (
//     <Tooltip>
//       <TooltipTrigger asChild className={cn("cursor-pointer", className)}>
//         <InfoIcon strokeWidth={1.5} className="h-5 w-5 shrink-0" />
//       </TooltipTrigger>
//       <TooltipContent className={cn("bg-white", contentClassName)}>
//         <div>{description}</div>
//       </TooltipContent>
//     </Tooltip>
//   );
// };
