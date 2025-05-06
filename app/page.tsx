import "./explore/local.css";

import { cn } from "@/lib/utils";
import { MAX_SCREEN_WIDTH } from "@/components/constants";
import {
  MarketsTable,
  MobileMenu,
  Pagination,
  RoycoStats,
  SearchBar,
  TableMenu,
} from "./explore/_components";
import { ColumnToggler } from "./explore/_components/ui";
import { Protector } from "./protector";
import { BoycoStats } from "./explore/_components/boyco-stats";
import { Button } from "@/components/ui/button";
import { TokenEstimator } from "./_components/ui/token-estimator/token-estimator";
import LightningIcon from "./market/[chain_id]/[market_type]/[market_id]/_components/icons/lightning";
import { PlumeBlackLogo } from "./_components/assets/plume/plume-black";
import { RoycoRoyalty } from "./explore/_components/royco-royalty";
import { SubscribeModal } from "./explore/_components/subscribe/subscribe-modal";

const Page = () => {
  const Content = () => {
    return (
      <div className="hide-scrollbar flex flex-col items-center bg-[#FBFBF8] px-3 md:px-12">
        {/**
         * @title Header Bar
         * @description Header Tilte + Tagline + Stats
         */}
        <div
          className={cn(
            "mt-9 flex w-full shrink-0 flex-col items-start justify-center px-3 pt-3 md:mt-12 md:px-12 lg:flex-row lg:items-center lg:justify-between",
            "gap-7 md:gap-3 xl:gap-12",
            MAX_SCREEN_WIDTH,
            "px-0 md:px-0"
          )}
        >
          <div className="flex flex-col items-start justify-start">
            {(() => {
              if (process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco") {
                return (
                  <>
                    <h2 className="heading-2 text-black">Explore Boyco</h2>
                    <div className="body-1 mt-2 text-secondary">
                      Pre-deposit to Berachain to earn incentives.
                    </div>
                  </>
                );
              } else if (process.env.NEXT_PUBLIC_FRONTEND_TAG === "sonic") {
                return (
                  <>
                    <h2 className="heading-2 text-black">Explore Sonic</h2>
                    <div className="body-1 mt-2 text-secondary">
                      Explore Sonic Gems & Points Programs
                    </div>
                  </>
                );
              } else if (process.env.NEXT_PUBLIC_FRONTEND_TAG === "plume") {
                return (
                  <>
                    <h2 className="heading-2 flex flex-row items-center gap-3 text-black">
                      <div>Explore Plume</div>
                      <PlumeBlackLogo className="h-8 w-8" />
                    </h2>
                    <div className="body-1 mt-2 text-secondary">
                      Earn $PLUME and other incentives in addition to the base
                      APY.
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <h2 className="heading-2 text-black">Explore</h2>
                    <div className="body-1 mt-2 text-secondary">
                      Explore Royco Markets & bid for more incentives today.
                    </div>
                  </>
                );
              }
            })()}
          </div>

          {(() => {
            if (process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco") {
              return <BoycoStats className="flex-1" />;
            }
          })()}
        </div>

        <div
          className={cn(
            "hide-scrollbar flex w-full flex-row items-start space-x-0 p-3 pb-12 md:p-12 lg:space-x-3",
            "mb-14 mt-7 md:mt-0",
            MAX_SCREEN_WIDTH,
            "px-0 md:px-0"
          )}
        >
          <div
            style={{
              height: "fit-content",
              maxHeight: "80vh",
            }}
            className="hidden w-3/12 md:max-h-[80vh] lg:block"
          >
            <TableMenu />
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 lg:w-9/12">
            <div className="flex w-full flex-col items-center justify-between md:flex-row">
              <div className="mr-3 hidden md:flex lg:hidden">
                <MobileMenu />
              </div>

              <SearchBar />

              <div className="hidden h-[2.875rem] w-fit flex-row items-center space-x-3 md:flex">
                {/* <Sorter /> */}

                {process.env.NEXT_PUBLIC_FRONTEND_TAG === "sonic" && (
                  <TokenEstimator className="h-full" marketCategory="sonic">
                    <Button
                      size="sm"
                      className="flex h-full w-full items-center justify-center gap-2 rounded-xl"
                    >
                      <LightningIcon className="h-5 w-5 fill-black" />
                      <span className="text-sm">Estimate Sonic Airdrop</span>
                    </Button>
                  </TokenEstimator>
                )}

                <ColumnToggler />
              </div>

              <div className="mt-3 flex w-full flex-row items-center justify-between space-x-2 md:hidden">
                <div className="flex h-full flex-row space-x-2">
                  <MobileMenu />
                </div>

                <div className="flex w-fit flex-row items-center space-x-3">
                  {/* <Sorter /> */}
                  <ColumnToggler />
                </div>
              </div>
            </div>

            <MarketsTable />

            <Pagination />
          </div>
        </div>

        <RoycoRoyalty
          open={process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco" ? false : true}
        />

        {process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco" && <SubscribeModal />}
      </div>
    );
  };

  const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG;

  if (
    frontendTag === "internal" ||
    frontendTag === "testnet" ||
    frontendTag === "plume"
  ) {
    return <Protector children={<Content />} />;
  } else {
    return <Content />;
  }
};

export default Page;
