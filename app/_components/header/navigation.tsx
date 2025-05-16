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
    icon: <CrownIcon className="h-5 w-5" />,
  },
];

interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Navigation = React.forwardRef<HTMLDivElement, NavigationProps>(
  ({ className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          "sticky left-0 right-0 top-0 z-50 flex h-16 flex-col justify-center border-b border-divider bg-_surface_/80",
          className
        )}
        {...props}
      >
        <MaxWidthProvider>
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-10">
              <a target="_self" href="/" className="shrink-0 cursor-pointer">
                <RoycoLogoIcon className="h-[18px] fill-_primary_" />
              </a>

              <div className="hidden shrink-0 items-center gap-10 lg:flex">
                {Links.map((item, index) => {
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
      </div>
    );
  }
);
