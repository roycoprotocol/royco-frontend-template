"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { BlogLogo, TelegramLogo, XLogo } from "../assets";
import { SectionSubtitle, SectionTitle } from "./composables";

const animate = cn(
  "transition-all duration-200 ease-in-out group-hover:scale-110"
);

export const Community = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col place-content-center items-center bg-white font-gt text-black",
        "px-5 py-16 md:px-12 md:py-24 lg:py-[12.5rem]",
        className
      )}
    >
      <SectionTitle className="text-center">Join the Community</SectionTitle>

      <SectionSubtitle className="text-center lg:mt-[1.56rem]">
        Stay up-to-date on the latest developments from the Royco Community.
      </SectionSubtitle>

      <div
        className={cn(
          "flex flex-row items-center",
          "gap-5 sm:gap-8 lg:gap-[4rem]",
          "mt-8 md:mt-12 lg:mt-[4.62rem] "
        )}
      >
        {[
          {
            id: "telegram",
            label: "Telegram",
            logo: (
              <TelegramLogo
                className={cn(
                  "h-[2rem] w-auto group-hover:rotate-12 lg:h-[4rem]",
                  animate
                )}
              />
            ),
            link: "https://t.me/roycopub",
          },
          {
            id: "blog",
            label: "Blog",
            logo: (
              <BlogLogo
                className={cn(
                  "h-[3rem] w-auto group-hover:-rotate-6 lg:h-[5rem]",
                  animate
                )}
              />
            ),
            link: "https://paragraph.xyz/@royco",
          },
          {
            id: "twitter",
            label: "X",
            logo: (
              <XLogo
                className={cn(
                  "h-[2rem] w-auto group-hover:rotate-6 lg:h-[3.375rem]",
                  animate
                )}
              />
            ),
            link: "https://x.com/roycoprotocol",
          },
        ].map(({ id, label, logo: Logo, link }, partnerIndex) => {
          const BASE_KEY = `home:community-${id}`;

          return (
            <div key={BASE_KEY} className="flex flex-col items-center">
              <a
                href={link ? link : "#"}
                className="contents"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div
                  className={cn(
                    "flex cursor-pointer flex-col place-content-center items-center border border-divider bg-[#f3f3f3] transition-all duration-200 ease-in-out hover:bg-focus hover:shadow-sm",
                    "group",
                    "rounded-2xl lg:rounded-[2rem]",
                    "h-16 w-16 lg:h-[8rem] lg:w-[8rem]",
                    "p-1 lg:p-2"
                  )}
                >
                  {Logo}
                </div>
              </a>
              <div
                className={cn(
                  "mt-[0.5rem] text-center text-secondary",
                  "subtitle-1 text-sm md:text-base lg:text-xl"
                )}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
