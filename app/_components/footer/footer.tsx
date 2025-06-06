"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { MaxWidthProvider } from "@/app/_containers/providers/max-width-provider";
import { TwitterIcon } from "@/assets/icons/twitter";
import { TelegramIcon } from "@/assets/icons/telegram";

const Links = [
  {
    id: "terms",
    link: "https://docs.google.com/document/d/14TcJRR-MnJOVBsT_lGOaM0mfElhE_p9tYOwvSXU9kyQ/edit?tab=t.0",
    label: "Terms",
    target: "_blank",
  },
  {
    id: "documentation",
    link: "https://docs.royco.org/",
    label: "Docs",
    target: "_blank",
  },
];

const Socials = [
  {
    id: "twitter",
    link: "https://x.com/roycoprotocol",
    label: "Twitter",
    target: "_blank",
    icon: <TwitterIcon className="hover:fill-_primary_" />,
  },
  {
    id: "telegram",
    link: "https://t.co/oUDKnVZUp3",
    label: "Telegram",
    target: "_blank",
    icon: <TelegramIcon className="hover:fill-_primary_" />,
  },
];

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "sticky left-0 right-0 top-0 z-50  border-t border-divider bg-_surface_",
          className
        )}
        {...props}
      >
        <MaxWidthProvider className="flex h-16 items-center">
          <div className="flex flex-row flex-wrap items-center justify-between gap-5">
            <div className="flex shrink-0 items-center gap-10">
              {Links.map((item, index) => {
                return (
                  <a
                    key={index}
                    href={item.link}
                    target={item.target}
                    rel="noopener noreferrer"
                    className={cn(
                      "flex cursor-pointer items-center gap-2 text-sm font-normal text-_tertiary_ hover:text-_primary_",
                      "transition-all duration-200 ease-in-out"
                    )}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="flex shrink-0  items-center gap-6">
              {Socials.map((item, index) => {
                return (
                  <a
                    key={index}
                    href={item.link}
                    target={item.target}
                    rel="noopener noreferrer"
                    className={cn(
                      "flex cursor-pointer items-center gap-2 text-sm font-normal text-_tertiary_ hover:text-_primary_",
                      "transition-all duration-200 ease-in-out"
                    )}
                  >
                    {item.icon}
                  </a>
                );
              })}
            </div>
          </div>
        </MaxWidthProvider>
      </div>
    );
  }
);
