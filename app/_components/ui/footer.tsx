"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { RoycoLogo } from "../assets";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FooterMap: {
  [key: string]: {
    id: string;
    index: number;
    title: string;
    labels: {
      id: string;
      label: string;
      link?: string;
      tag?: string;
    }[];
  };
} = {
  information: {
    index: 0,
    id: "information",
    title: "Information",
    labels: [
      {
        id: "home",
        label: "Home",
        link: "https://www.royco.org/",
      },
      {
        id: "developers",
        label: "Developers",
        link: "https://docs.royco.org/",
      },
    ],
  },
  app: {
    index: 1,
    id: "app",
    title: "App",
    labels: [
      {
        id: "explore",
        label: "Explore",
        link: "/explore",
        tag: "soon",
      },
      {
        id: "portfolio",
        label: "Portfolio",
        link: "/portfolio",
        tag: "soon",
      },
    ],
  },
  media: {
    index: 2,
    id: "media",
    title: "Media",
    labels: [
      {
        id: "twitter",
        label: "Twitter",
        link: "https://x.com/roycoprotocol",
      },
      {
        id: "blog",
        label: "Blog",
        link: "https://paragraph.xyz/@royco",
      },
    ],
  },
  legal: {
    index: 3,
    id: "legal",
    title: "Legal",
    labels: [
      {
        id: "terms-of-service",
        label: "Terms of Service",
        link: "https://docs.google.com/document/d/14TcJRR-MnJOVBsT_lGOaM0mfElhE_p9tYOwvSXU9kyQ/edit?usp=sharing",
      },
    ],
  },
};

export const Footer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col place-content-center items-center bg-[#FBFBF8] font-gt text-black",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full  items-start justify-between",
          "flex-col xl:flex-row",
          "gap-8",
          "px-5 py-12 md:px-12 md:py-16 lg:px-[10.44rem] xl:px-[12.44rem]",
          "max-w-[108.505rem]",
          "lg:py-[8.25rem]"
        )}
      >
        {/**
         * @description Left Section
         */}
        <div className="flex w-fit shrink-0 flex-col place-content-start items-start">
          <button>
            <RoycoLogo className="md:h-18 h-12 w-auto lg:h-[5.375rem] lg:w-[14rem]" />
          </button>
        </div>

        {/**
         * @description Right Section
         */}
        <div
          className={cn(
            "flex flex-row flex-wrap items-start 2xl:gap-[3.69rem]",
            "w-full justify-between gap-12 md:gap-8 xl:w-fit xl:justify-normal"
          )}
        >
          {Object.keys(FooterMap)
            .sort((a, b) => FooterMap[a].index - FooterMap[b].index)
            .map((key, mainIndex) => {
              const { id, title, labels } = FooterMap[key];
              const BASE_KEY_TITLE = `home:footer-title-${id}`;
              return (
                <div
                  key={BASE_KEY_TITLE}
                  className="flex shrink-0 flex-col items-start"
                >
                  <div
                    className={cn(
                      "body-1",
                      "font-normal",
                      "text-base md:text-base"
                    )}
                  >
                    {title}
                  </div>
                  <div
                    className={cn(
                      "flex flex-col items-start",
                      "gap-2 lg:gap-[0.62rem]",
                      "mt-3 lg:mt-[0.81rem]"
                    )}
                  >
                    {labels.map(({ id, label, link, tag }, subIndex) => {
                      const BASE_KEY_LABEL = `${BASE_KEY_TITLE}:label-${id}`;

                      if (tag === "soon") {
                        return (
                          <Tooltip>
                            <TooltipTrigger
                              className={cn(
                                "body-1 cursor-pointer transition-all duration-200 ease-in-out hover:text-secondary",
                                "text-base underline decoration-transparent decoration-dotted underline-offset-[6px] hover:decoration-tertiary md:text-base"
                              )}
                            >
                              {label}
                            </TooltipTrigger>
                            <TooltipContent>Coming Soon.</TooltipContent>
                          </Tooltip>
                        );
                      } else {
                        return (
                          <a
                            href={link ? link : "#"}
                            key={BASE_KEY_LABEL}
                            className="contents"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div
                              className={cn(
                                "body-1 cursor-pointer transition-all duration-200 ease-in-out hover:text-secondary",
                                "text-base underline decoration-transparent decoration-dotted underline-offset-[6px] hover:decoration-tertiary md:text-base"
                              )}
                            >
                              {label}
                            </div>
                          </a>
                        );
                      }
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
});
