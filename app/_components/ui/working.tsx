"use client";

import React from "react";
import { cn } from "@/lib/utils";
import "./working.css";
import { SectionSubtitle, SectionTitle } from "./composables";
import { MaxWidthWrapper } from "./composables/max-width-wrapper";
import { AnimatePresence, motion } from "framer-motion";

const Modals = [
  {
    id: "working-1",
    title: "Create Market",
    description:
      "Turn any transaction or series of transactions into a market.",
  },
  {
    id: "working-2",
    title: "Offer Incentives",
    description:
      "Anyone may offer incentives to users to complete the transaction(s).",
  },
  {
    id: "working-3",
    title: "Negotiate Incentives",
    description: "Users may negotiate and express they want more incentives.",
  },
  {
    id: "working-4",
    title: "Complete Actions",
    description: "Users complete actions and receive negotiated incentives.",
  },
];

export const Working = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col place-content-center items-center",
        "h-fit w-full bg-[#F9F9F9]",
        "px-5 py-16 text-black md:px-12 md:py-24 lg:px-[10.44rem] lg:py-[8.25rem] xl:px-[12.44rem]",
        className
      )}
    >
      <MaxWidthWrapper>
        <SectionTitle className="self-center text-left">
          How it works.
        </SectionTitle>

        <SectionSubtitle className="w-full items-center md:flex md:flex-row md:justify-between">
          <div className="">Create a market around any transaction.</div>
          <a
            href="https://royco.gitbook.io/royco"
            target="_blank"
            rel="noreferrer noopener"
            className="contents"
          >
            <div
              className={cn(
                "font-300",
                "underline decoration-tertiary decoration-dotted underline-offset-[6px]",
                "mt-1 md:mt-0"
              )}
            >
              Read more
            </div>
          </a>
        </SectionSubtitle>

        <div className="mt-8 grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {Modals.map(({ id, title, description }, modalIndex) => {
              const BASE_KEY = `home:working:${id}`;

              return (
                <div
                  key={BASE_KEY}
                  className={cn(
                    "col-span-1 flex w-full items-center justify-between gap-5 bg-white font-gt text-base xl:h-[15rem] xl:gap-8",
                    "transition-all duration-200 ease-in-out",
                    "flex-col xl:flex-row",
                    "p-5 sm:px-12 sm:py-9 xl:px-[2.62rem] xl:py-0",
                    "rounded-xl border border-divider",
                    "transition-all duration-200 ease-in-out hover:border-tertiary/50 hover:drop-shadow-sm"
                  )}
                >
                  <div
                    className={cn(
                      "flex w-fit flex-col items-start sm:max-w-80 md:max-w-[15.9375rem]",
                      "xl:w-1/2"
                    )}
                  >
                    <div className="text-base font-500 text-secondary">
                      {modalIndex + 1}
                    </div>
                    <div className="mt-[0.4rem] text-lg font-500 text-black lg:text-[1.1rem]">
                      {title}
                    </div>
                    <div className="mt-[0.3rem] text-base font-400 leading-tight text-black/60 lg:text-[1.1rem]">
                      {description}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "flex h-fit w-fit shrink-0 flex-col place-content-center items-center",
                      "md:min-h-[8.5rem] xl:min-h-0",
                      "xl:max-w-[9rem] 2xl:max-w-none",
                      "xl:items-center 2xl:w-1/2"
                    )}
                  >
                    <div
                      className={cn(
                        "w-fit lg:w-full xl:w-full",
                        id === "working-1" && "h-40 md:h-[9rem] xl:h-[12.5rem]",
                        id === "working-2" &&
                          "h-20 md:h-[4.8rem] xl:h-[5.73556rem]",
                        id === "working-3" &&
                          "h-28 lg:h-[7rem] xl:-mr-5 xl:h-[9rem]",
                        id === "working-4" &&
                          "h-36 lg:h-[9rem] xl:h-[11.36219rem]"
                      )}
                    >
                      <img
                        src={`/home/${id}.png`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </MaxWidthWrapper>
    </div>
  );
});
