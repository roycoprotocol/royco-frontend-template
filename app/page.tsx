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
import { ColumnToggler, Sorter } from "./explore/_components/ui";
import { Protector } from "./protector";
import { TokenEstimator } from "./_components/ui/token-estimator";
import { Button } from "@/components/ui/button";
import LightningIcon from "./market/[chain_id]/[market_type]/[market_id]/_components/icons/lightning";

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
            "mt-9 flex w-full shrink-0 flex-col items-center justify-between  px-3 pt-3 md:mt-12 md:px-12 lg:flex-row",
            "gap-7 md:gap-3 xl:gap-12",
            MAX_SCREEN_WIDTH,
            "px-0 md:px-0"
          )}
        >
          <div className="flex w-full shrink flex-col items-start lg:w-1/2">
            {process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco" ? (
              <>
                <h2 className="heading-2 text-black">Explore Boyco</h2>
                <div className="body-1 mt-2 text-secondary">
                  Pre-deposit to Berachain to earn incentives.
                </div>
              </>
            ) : (
              <>
                <h2 className="heading-2 text-black">Explore</h2>
                <div className="body-1 mt-2 text-secondary">
                  Explore Royco Markets & bid for more incentives today.
                </div>
              </>
            )}
          </div>

          <RoycoStats className="w-full" />
        </div>

        <div
          className={cn(
            "hide-scrollbar flex w-full flex-row items-start space-x-0 p-3 pb-12 md:p-12 lg:space-x-3",
            "mt-7 md:mt-0",
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

          <div className="flex h-full w-full shrink-0 flex-col gap-3 md:h-[80vh] lg:w-9/12">
            <div className="flex w-full flex-col items-center justify-between md:flex-row">
              <div className="mr-3 hidden md:flex lg:hidden">
                <MobileMenu />
              </div>

              <SearchBar />

              <div className="hidden h-[2.875rem] w-fit flex-row items-center space-x-3 md:flex">
                {/* <Sorter /> */}

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

        {/* <RoycoRoyalty /> */}
      </div>
    );
  };

  const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG;

  if (
    frontendTag === "internal" ||
    frontendTag === "testnet"
    // || frontendTag === "boyco"
  ) {
    return <Protector children={<Content />} />;
  } else {
    return <Content />;
  }
};

export default Page;
