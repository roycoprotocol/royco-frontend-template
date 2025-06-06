"use client";

import { MaxWidthProvider } from "@/app/_containers/providers/max-width-provider";
import { ProtectorProvider } from "@/app/_containers/providers/protector-provider";
import { HeroSection } from "./components/hero-section/hero-section";
import { Deposits } from "./components/deposits/deposits";
import { Rewards } from "./components/rewards/rewards";
import { TransactionModalV2 } from "@/components/composables/transaction-modal-v2/transaction-modal/transaction-modal";
import { Activity } from "./components/activity/activity";
import { UserPanel } from "./components/user-panel/user-panel";
import { queryClientAtom } from "jotai-tanstack-query";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { PortfolioWrapper } from "./provider/portfolio-wrapper";

const Page = () => {
  // const queryClient = useAtomValue(queryClientAtom);

  // useEffect(() => {
  //   queryClient.invalidateQueries({
  //     queryKey: ["userInfo"],
  //   });
  // }, []);

  return (
    <ProtectorProvider>
      <div className="hide-scrollbar min-h-screen bg-_surface_">
        <MaxWidthProvider className="relative z-10 mb-5">
          <PortfolioWrapper>
            <div className="pt-14">
              <HeroSection />
            </div>

            <div className=" flex flex-col items-start lg:flex-row lg:gap-x-16">
              <div className="mt-14 w-full lg:w-2/3">
                <div>
                  <Deposits />
                </div>

                <div className="mt-14">
                  <Rewards />
                </div>

                <div className="mt-14">
                  <Activity />
                </div>
              </div>

              <div className="mt-14 w-full lg:sticky lg:top-20 lg:w-1/3">
                <UserPanel />
              </div>
            </div>
          </PortfolioWrapper>

          <TransactionModalV2 />
        </MaxWidthProvider>
      </div>
    </ProtectorProvider>
  );
};

export default Page;
