"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
type IconPosition = "left" | "right";

interface CopyWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  iconPosition?: IconPosition;
  iconSize?: IconSize;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  showTooltip?: boolean;
  showIcon?: boolean;
}

const iconSizes: Record<IconSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-7 w-7",
};

export const CopyWrapper = React.forwardRef<HTMLDivElement, CopyWrapperProps>(
  (
    {
      className,
      text,
      iconPosition = "right",
      iconSize = "sm",
      tooltipPosition = "top",
      showTooltip = true,
      showIcon = true,
      children,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopyToClipboard = () => {
      setCopied(true);
      navigator.clipboard.writeText(text);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    };

    const iconElement = (
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            <CheckIcon className={cn(iconSizes[iconSize], "text-success")} />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            whileHover={{ scale: 1.05 }}
          >
            <CopyIcon
              className={cn(
                iconSizes[iconSize],
                "text-tertiary hover:text-secondary"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );

    const content = (
      <div
        ref={ref}
        onClick={handleCopyToClipboard}
        className={cn(
          "flex cursor-pointer items-center gap-2",
          iconPosition === "right" ? "flex-row" : "flex-row-reverse",
          className
        )}
        {...props}
      >
        {children}
        {showIcon && iconElement}
      </div>
    );

    if (!showTooltip) {
      return content;
    }

    return (
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side={tooltipPosition} sideOffset={5}>
            <p>Click to copy</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

CopyWrapper.displayName = "CopyWrapper";
