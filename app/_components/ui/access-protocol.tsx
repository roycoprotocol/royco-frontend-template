"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SectionSubtitle, SectionTitle } from "./composables";
import { MaxWidthWrapper } from "./composables/max-width-wrapper";
import { Block } from "./partners";
import { RoycoTerminalLogo } from "../assets";

export const AccessProtocol = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      id="access-protocol"
      ref={ref}
      className={cn(
        "flex w-full flex-col place-content-center items-center justify-center bg-[#FDFDFA] font-gt",
        "px-5 py-16 text-black md:px-12 md:py-24 lg:px-[10.44rem] lg:py-[8.25rem] xl:px-[12.44rem]",
        className
      )}
    >
      <MaxWidthWrapper>
        <SectionTitle>Access Royco Protocol</SectionTitle>

        <SectionSubtitle className="pb-[1rem] font-normal">
          Via ecosystem projects.
        </SectionSubtitle>

        <div
          className={cn(
            "w-full items-start overflow-x-hidden",
            "grid grid-cols-1 md:grid-cols-2",
            "gap-2 lg:gap-8 xl:gap-[1.25rem]",
            "mt-4"
          )}
        >
          {[
            {
              label: "WACCO LOCO",
              url: "/explore",
              image: "/home/royco-terminal.svg",
            },
            { label: "Coming soon", url: null },
          ].map((item) => {
            if (!item.url) {
              return (
                <div
                  className={cn(
                    "flex h-28 items-center justify-center bg-[#f7f7f6] text-lg text-tertiary md:h-32 lg:h-[10rem]",
                    !item.url ? "cursor-not-allowed" : "cursor-pointer"
                  )}
                >
                  {item.label}
                </div>
              );
            }

            return (
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <div
                  className={cn(
                    "col-span-1 w-full rounded-md lg:rounded-[0.3125rem]",
                    "h-28 md:h-32 lg:h-[10rem]",
                    "cursor-pointer overflow-hidden border border-transparent transition-all duration-200 ease-in-out hover:border-divider hover:opacity-80 hover:drop-shadow-sm"
                  )}
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    className="object-top"
                  />
                </div>
              </a>
            );
          })}
        </div>
      </MaxWidthWrapper>
    </div>
  );
});
