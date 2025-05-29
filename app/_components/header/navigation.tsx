"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { AlignJustifyIcon, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RoycoLogoIcon } from "@/assets/logo/royco-logo";
import { CrownIcon } from "@/assets/icons/crown";
import { MaxWidthProvider } from "@/app/_containers/providers/max-width-provider";
import { ConnectWalletButton } from "./connect-wallet-button/connect-wallet-button";
import { tagAtom } from "@/store/protector/protector";
import { useAtomValue } from "jotai";
import { PlumeLogo } from "@/assets/logo/plume/plume";
import Link from "next/link";

const Links = [
  {
    id: "earn",
    link: "/",
    label: "Earn",
    target: "_self",
  },
  {
    id: "portfolio",
    link: "/portfolio",
    label: "Portfolio",
    target: "_self",
  },
  {
    id: "join-royalty",
    link: "/royalty",
    label: "Join Royalty",
    target: "_self",
    icon: <CrownIcon className="h-7 w-7 lg:h-5 lg:w-5" />,
  },
];

interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Navigation = React.forwardRef<HTMLDivElement, NavigationProps>(
  ({ className, ...props }, ref) => {
    const tag = useAtomValue(tagAtom);

    const [open, setOpen] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          "sticky left-0 right-0 top-0 z-50  border-b border-divider bg-_surface_",
          className
        )}
        {...props}
      >
        <MaxWidthProvider className="flex h-16 items-center">
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-10">
              <Link target="_self" href="/" className="shrink-0 cursor-pointer">
                <RoycoLogoIcon className="h-[18px] fill-_primary_" />
              </Link>

              <div className="hidden shrink-0 items-center gap-10 lg:flex">
                {Links.map((item, index) => {
                  // If the link starts with "/" it is a relative link and should be rendered as a Link
                  if (item.link.startsWith("/")) {
                    return (
                      <Link
                        key={index}
                        href={item.link}
                        rel="noopener noreferrer"
                        className={cn(
                          "flex cursor-pointer items-center gap-2 text-sm font-normal hover:text-secondary",
                          "transition-all duration-200 ease-in-out"
                        )}
                      >
                        {item.icon}

                        {item.label}
                      </Link>
                    );
                  }

                  return (
                    <a
                      key={index}
                      href={item.link}
                      target={item.target}
                      rel="noopener noreferrer"
                      className={cn(
                        "flex cursor-pointer items-center gap-2 text-sm font-normal hover:text-secondary",
                        "transition-all duration-200 ease-in-out"
                      )}
                    >
                      {item.icon}

                      {item.label}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ConnectWalletButton />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(!open)}
                className="h-10 w-10 shrink-0 place-content-center rounded-sm p-0 lg:hidden"
              >
                <AlignJustifyIcon className="h-5 w-5 text-primary" />
              </Button>
            </div>
          </div>
        </MaxWidthProvider>

        <AnimatePresence mode="sync">
          {open && (
            <motion.div
              layout="size"
              layoutId="header-menu"
              className={cn(
                "absolute left-0 right-0 top-0 z-10 overflow-hidden bg-_surface_ lg:hidden"
              )}
              initial={{ height: 0 }}
              animate={{ height: "100vh" }}
              exit={{ height: 0 }}
              transition={{
                staggerChildren: 0.1,
              }}
            >
              <div className="absolute inset-0 flex h-screen flex-col items-center justify-center gap-4 py-5">
                {Links.map((item, index) => {
                  return (
                    <motion.a
                      key={index}
                      href={item.link}
                      target={item.target}
                      rel="noopener noreferrer"
                      initial={{
                        opacity: 0,
                        y: -10 * index,
                        filter: "blur(4px)",
                      }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: 0, filter: "blur(4px)" }}
                      transition={{
                        delay: index * 0.2,
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      className={cn(
                        "flex cursor-pointer items-center justify-center gap-2 font-shippori text-2xl hover:text-_secondary_"
                      )}
                    >
                      {item.icon}

                      {item.label}
                    </motion.a>
                  );
                })}
              </div>

              <div className="absolute right-5 top-5">
                <Button
                  size="sm"
                  onClick={() => setOpen(!open)}
                  className="h-10 w-10 place-content-center rounded-sm bg-_primary_ p-0 hover:bg-_primary_/80"
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {tag === "boyco" && (
          <div className="flex w-full justify-center bg-_primary_/80 py-2">
            <a
              href="https://boyco.berachain.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="text-center text-xs text-_surface_">
                <span>
                  <span>Withdraw from Boyco </span>
                  <span className="font-semibold underline underline-offset-2">
                    here.
                  </span>
                </span>
              </div>
            </a>
          </div>
        )}

        {tag === "plume" && (
          <div className="flex w-full justify-center bg-_primary_/80 py-2">
            <div className="text-center text-xs text-_surface_">
              <span>
                <span className="font-semibold">Plume X Royco </span>
                <span>Plume is distributing 150,000,000 PLUME </span>
                <span>
                  <PlumeLogo className="inline-block h-4 w-4" />{" "}
                </span>
                <span>
                  as part of its Season 2 Incentive Campaign. Learn more about
                  the campaign{" "}
                </span>
                <span className="underline-offset-2 hover:underline">
                  <a
                    href="https://plume.org/blog/royco-markets"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    here.
                  </a>
                </span>
              </span>
            </div>
          </div>
        )}

        {tag === "sonic" && (
          <div className="flex w-full justify-center bg-_primary_/80 py-2">
            <a
              href="https://paragraph.xyz/@royco/sonic-is-partnering-with-royco-to-help-distribute-200,000,000-dollars-to-boost-its-thriving-defi-ecosystem-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="text-center text-xs text-_surface_">
                <span>
                  <span className="font-semibold underline underline-offset-2">
                    SONIC GEMS Program{" "}
                  </span>
                  <span>
                    Sonic is partnering with Royco to help distribute
                    ~200,000,000 $S{" "}
                  </span>
                  <span>
                    <img
                      src="/sonic-token.png"
                      alt="Sonic Logo"
                      className="inline-block h-4 w-4"
                    />{" "}
                  </span>
                  <span className="font-semibold underline underline-offset-2">
                    Learn more.
                  </span>
                </span>
              </div>
            </a>
          </div>
        )}

        {tag === "hyperliquid" && (
          <div className="flex w-full justify-center bg-_primary_/80 py-2">
            <div className="text-center text-xs text-_surface_">
              <span>
                <span className="font-semibold underline underline-offset-2">
                  HyperEVM is Live:
                </span>
                <span>
                  {" "}
                  Deposit into the Vaults to collect exclusive Royco rewards
                  from leading asset issuers and Hyperliquid native
                  protocols.{" "}
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);
