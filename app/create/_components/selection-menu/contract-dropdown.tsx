"use client";

import React from "react";

import {
  CheckIcon,
  CopyIcon,
  EllipsisIcon,
  ExternalLinkIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";
import { getExplorerUrl } from "@/sdk/utils";

const waveAnimation = {
  hover: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

const circleAnimation = {
  initial: { y: 0 },
  hover: { y: [-6, 0], transition: { duration: 0.2, ease: "easeInOut" } },
};

export const ContractDropdown = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    address: string;
    chainId: number;
  }
>(({ className, chainId, address, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);

  const [copied, setCopied] = React.useState(false);

  const explorerUrl = getExplorerUrl({
    chainId,
    value: address,
    type: "address",
  });

  return (
    <div ref={ref} className={cn("", className)} {...props}>
      <div className="relative -mt-2 mb-1 flex h-5 w-6 flex-col place-content-center items-start">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-ellipsis absolute left-0 top-0 h-5 w-5 cursor-pointer fill-tertiary text-tertiary transition-all duration-200 ease-in-out hover:fill-secondary hover:text-secondary group-focus:text-secondary"
              initial="initial"
              whileHover="hover"
              // variants={waveAnimation}
            >
              <motion.circle
                cx="12"
                cy="12"
                r="1"
                // variants={circleAnimation}
              />
              <motion.circle
                cx="19"
                cy="12"
                r="1"
                // variants={circleAnimation}
              />
              <motion.circle
                cx="5"
                cy="12"
                r="1"
                // variants={circleAnimation}
              />
            </motion.svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 rounded-lg">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClickCapture={(e) => {
                  e.stopPropagation();

                  navigator.clipboard.writeText(address.toLowerCase());

                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                    setOpen(false);

                    // Create and dispatch a new event
                    const newClickEvent = new MouseEvent("click", {
                      bubbles: true,
                      cancelable: true,
                      view: window,
                    });
                    e.target.dispatchEvent(newClickEvent);
                  }, 300);
                }}
                className="h-8 justify-between rounded-md"
              >
                <div className="body-2 flex h-5">
                  <span className="leading-5">Copy Address</span>
                </div>
                {copied === false ? (
                  <CopyIcon
                    strokeWidth={1.5}
                    className="h-5 w-5 text-current"
                  />
                ) : (
                  <CheckIcon
                    strokeWidth={1.5}
                    className="h-5 w-5 text-current"
                  />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClickCapture={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  window.open(explorerUrl, "_blank");
                }}
                className="h-8 justify-between rounded-md"
              >
                <div className="body-2 flex h-5">
                  <span className="leading-5">View on Explorer</span>
                </div>
                <ExternalLinkIcon
                  strokeWidth={1.5}
                  className="h-5 w-5 text-current"
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
});
