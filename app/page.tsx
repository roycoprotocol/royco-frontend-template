"use client";

import { MaxWidthProvider } from "@/app/_containers/providers/max-width-provider";
import { ProtectorProvider } from "@/app/_containers/providers/protector-provider";
import { VaultsTable } from "./explore/components/vaults-table/vaults-table";
import { HeroSection } from "./explore/components/hero-section/hero-section";
import { MarketFilter } from "./explore/components/market-filter/market-filter";
import { MarketTable } from "./explore/components/market-table/market-table";
import { SubscribeModal } from "./explore/_components/subscribe/subscribe-modal";
import { ExploreWrapper } from "./explore/provider/explore-wrapper";
import { VaultsFilter } from "./explore/components/vaults-filter/vaults-filter";

const Page = () => {
  return (
    <ProtectorProvider>
      <div className="hide-scrollbar relative min-h-screen bg-_surface_ pb-10">
        {/**
         * Background
         */}
        <div className="absolute -top-16 left-0 right-0">
          <img
            src="/images/explore/explore-bg.png"
            alt="explore-bg"
            className="opacity-80"
          />

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-_surface_ via-_surface_ to-transparent" />
        </div>

        {/**
         * Hero Section
         */}
        <MaxWidthProvider className="relative z-10">
          <div className="pt-16">
            <HeroSection />
          </div>

          <ExploreWrapper>
            {/* <div className="mt-6">
              <div>
                <VaultsFilter />
              </div>
              <div className="mt-6">
                <VaultsTable />
              </div>
            </div> */}

            <div className="mt-16">
              <div>
                <MarketFilter />
              </div>
              <div className="mt-6">
                <MarketTable />
              </div>
            </div>
          </ExploreWrapper>
        </MaxWidthProvider>

        {process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco" && <SubscribeModal />}
      </div>
    </ProtectorProvider>
  );
};

export default Page;
