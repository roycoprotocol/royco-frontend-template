"use client";

import React from "react";
import { cn } from "@/lib/utils";
import "./markets.css";
import { SectionSubtitle, SectionTitle } from "./composables";
import { MaxWidthWrapper } from "./composables/max-width-wrapper";

const Modals = [
  {
    id: "lping-on-amms",
    title: "LPing on AMMs",
    description:
      "Create markets to incentivize providing liquidity to AMMs, and discover optimal incentive spend.",
  },
  {
    id: "voting",
    title: "Voting",
    description:
      "Create markets to incentivize voting on governance proposals, discovering the cost of each vote.",
  },
  {
    id: "nft-minting",
    title: "NFT Minting",
    description:
      "Create markets to incentivize minting an NFT. Offer a rebate, measure and monetize demand.",
  },
  {
    id: "lending",
    title: "Lending",
    description:
      "Create markets to incentivize lenders and discover their cost of capital more effectively.",
  },
  {
    id: "lockups",
    title: "Lockups",
    description:
      "Create markets to incentivize lockups, enabling price discovery for users to lock their assets.",
  },
  {
    id: "Vaults",
    title: "Vaults",
    description:
      "Create markets to understand the latent demand in vaults like Hyperliquid.",
  },
  {
    id: "staking",
    title: "Staking",
    description:
      "Create markets to incentivize staking, enabling price discovery for LRTs.",
  },
  {
    id: "carbon-credits",
    title: "Carbon Credits",
    description:
      "Enable non-profits and governments to incentivize the burning of onchain carbon credits.",
  },
];

export const Markets = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-fit w-full flex-col items-center bg-fungardHorizontal",
        "px-5 py-16 text-black md:px-12 md:py-24 lg:px-[10.44rem] lg:py-[8.25rem] xl:px-[12.44rem]",
        className
      )}
    >
      <MaxWidthWrapper className="items-center">
        <SectionTitle className="max-w-[29.0625rem] self-center text-center">
          Countless apps today.
        </SectionTitle>
        <SectionTitle className="mt-1 max-w-[29.0625rem] self-center text-center">
          Endless future possibilities.
        </SectionTitle>

        <SectionSubtitle className="w-full max-w-[56.6875rem] text-center">
          Onchain actions are incentivized today but lack market efficiency.
          <br />
          Royco changes things.
        </SectionSubtitle>

        {/* <GetUpdatesButton className="mt-14" /> */}

        <div
          className={cn(
            "mt-16 grid w-full",
            "gap-5 lg:gap-8 xl:gap-10",
            "grid-cols-2 lg:grid-cols-4"
          )}
        >
          {Modals.map(({ id, title, description }, modalIndex) => {
            const BASE_KEY = `home:markets:${id}`;
            return (
              <div key={BASE_KEY} className="col-span-1 flex flex-col">
                <div className="font-gt text-base font-500 text-black lg:text-base">
                  {title}
                </div>
                <div className="mt-3 font-gt text-base font-light text-secondary lg:text-base xl:max-w-[16.18494rem]">
                  {description}
                </div>
              </div>
            );
          })}
        </div>
      </MaxWidthWrapper>
    </div>
  );
});
