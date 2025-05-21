"use client";

import { MaxWidthProvider } from "@/app/_containers/providers/max-width-provider";
import { ProtectorProvider } from "@/app/_containers/providers/protector-provider";
import { MarketTable } from "../components/market-table/market-table";
import { MarketFilter } from "../components/market-filter/market-filter";
import { VaultsTable } from "../components/vaults-table/vaults-table";
import { HeroSection } from "../components/hero-section/hero-section";

const Page = () => {
  return (
    <ProtectorProvider>
      <div className="hide-scrollbar relative min-h-screen bg-_surface_">
        {/**
         * Background
         */}
        <div className="fixed left-0 right-0 top-0">
          <img
            src="/images/explore/explore-bg.png"
            alt="explore-bg"
            className="opacity-80"
          />

          <div className="absolute inset-0 z-10 bg-gradient-to-t from-_surface_ via-_surface_ to-transparent"></div>
        </div>

        {/**
         * Hero Section
         */}
        <MaxWidthProvider className="relative z-10 mb-5">
          <div className="pt-16">
            <HeroSection />
          </div>

          <div className="mt-12">
            <VaultsTable />
          </div>

          <div className="mt-12">
            <MarketFilter />
          </div>

          <div className="mt-6">
            <MarketTable />
          </div>
        </MaxWidthProvider>
      </div>
    </ProtectorProvider>
  );
};

export default Page;
