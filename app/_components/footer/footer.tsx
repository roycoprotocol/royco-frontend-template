"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { MaxWidthProvider } from "@/app/_containers/providers/max-width-provider";
import { TwitterIcon } from "@/assets/icons/twitter";
import { TelegramIcon } from "@/assets/icons/telegram";
import { GLOBAL_LINKS } from "@/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LifeBuoyIcon, MailIcon } from "lucide-react";

const Links = [
  {
    id: "terms",
    link: GLOBAL_LINKS.TERMS_OF_SERVICE,
    label: "Terms",
    target: "_blank",
  },
  {
    id: "privacy",
    link: GLOBAL_LINKS.PRIVACY_POLICY,
    label: "Privacy Policy",
    target: "_blank",
  },
  {
    id: "documentation",
    link: GLOBAL_LINKS.DOCS,
    label: "Docs",
    target: "_blank",
  },
];

const Socials = [
  {
    id: "twitter",
    link: GLOBAL_LINKS.TWITTER,
    label: "Twitter",
    target: "_blank",
    icon: <TwitterIcon className="hover:fill-_primary_" />,
  },
  {
    id: "telegram",
    link: GLOBAL_LINKS.TELEGRAM,
    label: "Telegram",
    target: "_blank",
    icon: <TelegramIcon className="hover:fill-_primary_" />,
  },
];

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
  ({ className, ...props }, ref) => {
    const [isSupportTooltipOpen, setIsSupportTooltipOpen] = useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          "sticky left-0 right-0 top-0 z-50  border-t border-divider bg-_surface_",
          className
        )}
        {...props}
      >
        <MaxWidthProvider className="flex min-h-16 items-center py-3">
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

            <div className="flex shrink-0 items-center gap-6">
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

              <Tooltip
                delayDuration={0}
                open={isSupportTooltipOpen}
                onOpenChange={setIsSupportTooltipOpen}
              >
                <TooltipTrigger asChild>
                  <span>
                    <LifeBuoyIcon
                      onClick={() =>
                        setIsSupportTooltipOpen(!isSupportTooltipOpen)
                      }
                      className={cn(
                        "h-5 w-5 cursor-pointer text-_tertiary_ hover:text-_primary_",
                        "transition-all duration-200 ease-in-out"
                      )}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="end"
                  className="flex min-w-[220px] flex-col gap-1 rounded-sm border border-divider bg-_surface_ p-2 shadow-lg"
                >
                  <a
                    href="mailto:support@royco.org"
                    className={cn(
                      "group flex items-center gap-3 rounded p-2 hover:bg-gray-100",
                      "transition-all duration-200 ease-in-out"
                    )}
                  >
                    <MailIcon className="h-4 w-6 text-_tertiary_" />
                    <span
                      className={cn(
                        "text-sm font-normal text-_tertiary_ group-hover:text-_primary_",
                        "transition-all duration-200 ease-in-out"
                      )}
                    >
                      support@royco.org
                    </span>
                  </a>
                  <a
                    href="https://t.me/royco_support_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "group flex items-center gap-3 rounded p-2 hover:bg-gray-100",
                      "transition-all duration-200 ease-in-out"
                    )}
                  >
                    <TelegramIcon className="h-6 w-6 text-_tertiary_" />
                    <span
                      className={cn(
                        "text-sm font-normal text-_tertiary_ group-hover:text-_primary_",
                        "transition-all duration-200 ease-in-out"
                      )}
                    >
                      Support Bot
                    </span>
                  </a>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </MaxWidthProvider>
      </div>
    );
  }
);
