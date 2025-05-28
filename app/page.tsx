"use client";

import { MaxWidthProvider } from "@/app/_containers/providers/max-width-provider";
import { ProtectorProvider } from "@/app/_containers/providers/protector-provider";
import { VaultsTable } from "./explore/components/vaults-table/vaults-table";
import { HeroSection } from "./explore/components/hero-section/hero-section";
import { MarketFilter } from "./explore/components/market-filter/market-filter";
import { MarketTable } from "./explore/components/market-table/market-table";
import { SubscribeModal } from "./explore/_components/subscribe/subscribe-modal";
import { ExploreWrapper } from "./explore/provider/explore-wrapper";
import { PrimaryLabel } from "./market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";
import { SecondaryLabel } from "./market/[chain_id]/[market_type]/[market_id]/_components/composables/common-labels";

const Page = () => {
  /**
   * @todo PLUME -- Remove this on Plume launch
   * @note Hides Vaults from everywhere except testnet.royco.org and plume.royco.org
   */
  const frontendTag = process.env.NEXT_PUBLIC_FRONTEND_TAG;
  const showVaults = ["testnet", "dev", "internal", "plume"];

  return (
    <ProtectorProvider>
      <div className="hide-scrollbar relative min-h-screen bg-_surface_ pb-24">
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
        <MaxWidthProvider className="relative z-10 mb-5">
          <div className="pt-16">
            <HeroSection />
          </div>

          <ExploreWrapper>
            {frontendTag && showVaults.includes(frontendTag) && (
              <div className="mt-6">
                <div>
                  <SecondaryLabel className="text-xs font-medium tracking-wide text-_secondary_">
                    NEW
                  </SecondaryLabel>

                  <PrimaryLabel className="mt-2 text-2xl font-medium text-_primary_">
                    Vaults
                  </PrimaryLabel>

                  <SecondaryLabel className="mt-2 text-base font-normal text-_secondary_">
                    Eliminate the guesswork. Vaults rebalance your capital and
                    negotiate incentives across Royco Markets — optimizing for
                    risk-adjusted returns.
                  </SecondaryLabel>
                </div>

                <div className="mt-6">
                  <VaultsTable />
                </div>
              </div>
            )}

            <div className="mt-16">
              <MarketFilter />
            </div>

            <div className="mt-6">
              <MarketTable />
            </div>
          </ExploreWrapper>
        </MaxWidthProvider>

        {process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco" && <SubscribeModal />}
      </div>
    </ProtectorProvider>
  );
};

export default Page;
