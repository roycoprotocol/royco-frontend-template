"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { z } from "zod";
import { ZodAction } from "../../market-builder-form";
import {
  BadgeAlertIcon,
  CircleHelpIcon,
  ExternalLinkIcon,
  FileQuestionIcon,
} from "lucide-react";
import { getExplorerUrl } from "royco/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MotionWrapper } from "../animations";

export const WeirollActionFlow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    actions: z.infer<typeof ZodAction>[];
  }
>(({ className, actions, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex flex-col gap-3", className)}>
      {actions.length <= 1 && (
        <MotionWrapper delay={0.1}>
          <div className="flex flex-row place-content-center items-center rounded-xl border border-divider bg-white p-3 font-ortica text-lg">
            <div className="flex h-6 flex-col place-content-center items-center">
              <BadgeAlertIcon
                strokeWidth={1.2}
                className="h-6 w-6 shrink-0 text-secondary"
              />
            </div>
            <div className="-mt-[0.2rem] ml-2 h-6 text-secondary">
              <span className="leading-6">Action script is empty.</span>
            </div>
          </div>
        </MotionWrapper>
      )}

      {actions.map((action, actionIndex) => {
        const BASE_KEY = `action-flow-step:action:${action.id}`;

        if (actionIndex === 0) return null;

        return (
          <MotionWrapper
            key={BASE_KEY}
            className="flex flex-row rounded-xl border border-divider bg-white p-3"
            delay={0.1 * actionIndex}
          >
            <div className="flex h-6 w-6 shrink-0 flex-col place-content-center items-center rounded-md border border-divider">
              <div
                className={cn(
                  "flex h-5",
                  "font-gt text-base font-light text-black"
                )}
              >
                <span className="leading-5">{actionIndex}</span>
              </div>
            </div>

            {/* <div className="ml-1 h-6 w-6 shrink-0 overflow-hidden rounded-md border border-divider">
              {action.contract_image ? (
                <div>Image</div>
              ) : (
                <div className="flex h-6 w-6 flex-col place-content-center items-center text-secondary">
                  <CircleHelpIcon strokeWidth={1.5} className="h-4 w-4" />
                </div>
              )}
            </div> */}

            <div className="body-2 ml-3 grow text-wrap font-light text-black ">
              Call to
              <Tooltip>
                <TooltipTrigger>
                  <span className="mx-1 text-blue-500">
                    {action.contract_function.name}
                  </span>
                </TooltipTrigger>

                {/* <TooltipContent className="">
                  
                </TooltipContent> */}
              </Tooltip>
              function on:{" "}
              <Tooltip>
                <TooltipTrigger>
                  <a
                    href={getExplorerUrl({
                      chainId: 1,
                      value: action.contract_address,
                      type: "address",
                    })}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-block text-black underline decoration-secondary decoration-dotted underline-offset-[3px] transition-colors duration-200 ease-in-out hover:text-secondary hover:decoration-tertiary"
                  >
                    {action.contract_name ? action.contract_name : "Unknown"}
                  </a>
                </TooltipTrigger>

                <TooltipContent className="text-sm">
                  <div className="flex flex-row items-center">
                    <div className="h-4 lowercase">
                      {action.contract_address.slice(0, 6) +
                        "..." +
                        action.contract_address.slice(-4)}
                    </div>
                    {/* <a className="ml-1">
                      <ExternalLinkIcon strokeWidth={1.5} className="h-4 w-4" />
                    </a> */}
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </MotionWrapper>
        );
      })}
    </div>
  );
});
