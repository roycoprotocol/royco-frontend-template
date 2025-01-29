"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { RoycoLogo } from "../assets";
import "./navbar.css";
import {
  AlignJustifyIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  XIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ConnectWalletButton } from "./connect-wallet-button";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { GetUpdatesButton } from "./composables";
import { MaxWidthWrapper } from "./composables/max-width-wrapper";
import { MAX_SCREEN_WIDTH } from "@/components/constants";
import { DropdownMenu } from "../../../components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { BeraToken } from "../assets/bera-token";

const NavbarLinks = [
  // {
  //   id: "create",
  //   label: "Create",
  //   link: "/create",
  //   target: "_self",
  // },
  {
    id: "explore",
    label: "Explore",
    link: "/",
    target: "_self",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    link: "/portfolio",
    target: "_self",
  },
  {
    id: "more",
    label: "More",
    link: null,
    items: [
      {
        id: "docs",
        label: "Docs",
        link: "https://docs.royco.org/",
        target: "_blank",
      },
      {
        id: "blog",
        label: "Blog",
        link: "https://paragraph.xyz/@royco",
        target: "_blank",
      },
      {
        id: "twitter",
        label: "Twitter",
        link: "https://x.com/roycoprotocol",
        target: "_blank",
      },
      {
        id: "telegram",
        label: "Telegram",
        link: "https://t.me/roycopub",
        target: "_blank",
      },
    ],
  },
];

export const ActualNavbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "safari-blur-fix",
          "sticky left-0 right-0 top-0 z-40 flex w-full flex-row items-center justify-between",
          "h-fit",
          "bg-opacity-0 py-3 md:py-[1.09rem]",
          "flex flex-col place-content-center items-center",
          "border-b border-t-0 border-divider",
          "px-3 sm:px-12 md:px-12 lg:px-12 xl:px-12",
          className
        )}
      >
        <AnimatePresence mode="popLayout">
          {isMobileOpen && (
            <motion.div
              layout="size"
              layoutId="navbar-mobile"
              className={cn(
                "absolute left-0 right-0 top-0 z-10 flex items-center justify-center overflow-hidden bg-z2 font-ortica text-2xl drop-shadow-sm"
                // "border-t-0 border-b border-divider"
              )}
              initial={{ height: 0 }}
              animate={{ height: "100vh" }}
              exit={{ height: 0 }}
              transition={{
                staggerChildren: 0.1,
              }}
            >
              <div className="flex flex-col gap-3 overflow-hidden py-5 lg:hidden">
                {NavbarLinks.map(
                  ({ id, label, link, target, items }, navIndex) => {
                    const BASE_KEY = `navbar-link:mobile:${id}`;
                    return link ? (
                      <motion.a
                        key={`navbar-link:mobile:${BASE_KEY}-${id}`}
                        href={link}
                        target={target}
                        rel="noopener noreferrer"
                        initial={{
                          opacity: 0,
                          y: -10 * navIndex,
                          filter: "blur(4px)",
                        }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 0, filter: "blur(4px)" }}
                        transition={{
                          delay: navIndex * 0.2,
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                        className="text-center text-primary"
                      >
                        {label}
                      </motion.a>
                    ) : (
                      items?.map((item, index) => (
                        <motion.a
                          key={`navbar-link:mobile:${BASE_KEY}-${item.id}`}
                          href={item.link}
                          target={item.target}
                          rel="noopener noreferrer"
                          initial={{
                            opacity: 0,
                            y: -10 * navIndex,
                            filter: "blur(4px)",
                          }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: 0, filter: "blur(4px)" }}
                          transition={{
                            delay: (navIndex + index) * 0.2,
                            duration: 0.3,
                            ease: "easeInOut",
                          }}
                          className="text-center text-primary"
                        >
                          {item.label}
                        </motion.a>
                      ))
                    );
                  }
                )}

                <div className="absolute right-5 top-5">
                  <div
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="flex h-6 w-6 flex-col place-content-center items-center overflow-hidden rounded-full border border-divider bg-primary"
                  >
                    <XIcon className="h-6 w-6 p-1 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <MaxWidthWrapper
          className={cn(
            "flex flex-row items-center justify-between self-center",
            MAX_SCREEN_WIDTH
          )}
        >
          {/**
           * @description Logo
           */}
          <div className="w-fit shrink-0 cursor-pointer">
            <a target="_self" href="/" className="contents">
              <img
                src="/royco-beta.png"
                alt="Royco Terminal"
                className="h-[1.53125rem]"
              />
              {/* <RoycoLogo className="h-[1.53125rem] w-[3.99219rem]" /> */}
            </a>
          </div>

          {/**
           * @description Links
           */}
          <div className="text-nav-link hidden shrink-0 flex-row items-center space-x-[2.88rem] text-secondary lg:flex">
            {NavbarLinks.map(({ id, label, link, target, items }, navIndex) => {
              const BASE_KEY = `navbar-link:${id}`;
              return link ? (
                <a
                  href={link}
                  target={target}
                  rel="noopener noreferrer"
                  key={`navbar-link:${BASE_KEY}`}
                  {...(pathname === "/" && {
                    initial: {
                      x: -40,
                      opacity: 0,
                      scale: 0.8,
                      filter: "blur(4px)",
                    },
                    whileinview: {
                      x: 0,
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px)",
                    },
                    transition: {
                      delay: navIndex * 0.1,
                      duration: 0.3,
                      ease: "easeInOut",
                    },
                  })}
                  className={cn(
                    "cursor-pointer transition-all duration-200 ease-in-out",
                    "hover:text-primary"
                  )}
                >
                  {label}
                </a>
              ) : (
                <Tooltip key={`navbar-link:learn:${BASE_KEY}`}>
                  <TooltipTrigger>{label}</TooltipTrigger>
                  <TooltipContent className="mt-3 flex w-48 flex-col rounded-lg border bg-white p-1 shadow-sm">
                    {items?.map((item) => (
                      <a
                        key={`navbar-link:learn:${BASE_KEY}-${item.id}`}
                        href={item.link}
                        target={item.target}
                        rel="noopener noreferrer"
                      >
                        <DropdownMenuLabel className="rounded px-4 py-2 transition-all hover:bg-focus">
                          {item.label}
                        </DropdownMenuLabel>
                      </a>
                    ))}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/**
           * @description Launch App
           */}
          <div
            {...(pathname === "/" && {
              initial: {
                opacity: 0,
                scale: 0.8,
                y: 20,
              },
              whileinview: {
                opacity: 1,
                scale: 1,
                y: 0,
              },
              transition: {
                type: "spring",
                ease: "easeInOut",
                duration: 0.4,
              },
            })}
            className="flex flex-row items-center"
          >
            <ConnectWalletButton />

            <div
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="ml-3 h-6 w-6 lg:hidden"
            >
              <AlignJustifyIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      {process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco" && (
        <div className="flex w-full justify-center border-b border-divider bg-black py-2 text-sm text-white">
          <a
            href="https://blog.berachain.com/blog/boyco-markets-overview"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <div className="flex flex-wrap items-center justify-center gap-1">
              <span className="font-semibold underline underline-offset-2">
                BOYCO
              </span>
              <span className="font-semibold">0.9%</span>
              <span>of</span>
              <span>
                <BeraToken className="h-4 w-4" />
              </span>
              <span>BERA Supply allocated to Major Pools +</span>
              <span className="font-semibold">1.1%</span>
              <span>of</span>
              <span>
                <BeraToken className="h-4 w-4" />
              </span>
              <span>BERA Supply allocated to</span>{" "}
              <span className="font-semibold">Third-Party/Hybrid Pools.</span>
              <span className="text-[#F0E397]">Ends Feb 3 12AM UTC.</span>
              <span className="font-semibold underline underline-offset-2">
                Learn more.
              </span>
            </div>

            <ChevronRightIcon className="h-4 w-4 text-black" />
          </a>
        </div>
      )}
    </>
  );
});
