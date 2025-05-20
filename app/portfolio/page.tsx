"use client";

import { MaxWidthProvider } from "@/app/_containers/providers/max-width-provider";
import { ProtectorProvider } from "@/app/_containers/providers/protector-provider";
import { HeroSection } from "./components/hero-section/hero-section";
import { Deposits } from "./components/deposits/deposits";
import { PortfolioWrapper } from "./provider/portfolio-wrapper";
import { Rewards } from "./components/rewards/rewards";
import { TransactionModalV2 } from "@/components/composables/transaction-modal-v2/transaction-modal/transaction-modal";

const Page = () => {
  return (
    <ProtectorProvider>
      <div className="hide-scrollbar min-h-screen bg-_surface_">
        <MaxWidthProvider className="relative z-10 mb-5">
          <PortfolioWrapper>
            <div className="pt-14">
              <HeroSection />
            </div>

            <div className="mt-14">
              <Deposits />
            </div>

            <div className="mt-12">
              <Rewards />
            </div>
          </PortfolioWrapper>

          <TransactionModalV2 />
        </MaxWidthProvider>
      </div>
    </ProtectorProvider>
  );
};

export default Page;
