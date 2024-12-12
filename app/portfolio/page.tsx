import "./local.css";

import { cn } from "@/lib/utils";
import { Protector } from "../protector";
import { MAX_SCREEN_WIDTH } from "@/components/constants";
import { PositionsTable } from "./_components/positions-table";
import { MarketManagerStoreProvider } from "@/store";

const Page = () => {
  const Content = () => {
    return (
      <MarketManagerStoreProvider>
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
              <h2 className="heading-2 text-black">Portfolio</h2>

              <div className="body-1 mt-2 text-secondary">
                View your active positions and track your earnings across all
                markets.
              </div>
            </div>

            {/* Portfolio Stats */}
          </div>

          <div
            className={cn(
              "hide-scrollbar flex w-full flex-row items-start space-x-0 p-3 pb-12 md:p-12 lg:space-x-3",
              "mt-7 md:mt-0",
              MAX_SCREEN_WIDTH,
              "px-0 md:px-0"
            )}
          >
            <PositionsTable />
          </div>
        </div>
      </MarketManagerStoreProvider>
    );
  };

  if (
    process.env.NEXT_PUBLIC_IS_LOCAL === "TRUE" ||
    process.env.NEXT_PUBLIC_IS_LOCKED !== "TRUE"
  ) {
    return <Content />;
  } else {
    return <Protector children={<Content />} />;
  }
};

export default Page;
