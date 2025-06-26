"use client";

import "./local.css";
import { cn } from "@/lib/utils";
import { MarketManager } from "./_components/market-manager";
import { MarketManagerStoreProvider } from "@/store";
import { TransactionModal } from "@/components/composables";
import { useParams } from "next/navigation";
import { CampaignManager } from "@/app/market/components/campaign/campaign-manager";
import { MaxWidthProvider } from "@/app/_containers/providers/max-width-provider";

const Page = () => {
  const { market_type } = useParams();

  return (
    <div className="hide-scrollbar min-h-screen bg-_surface_">
      <MaxWidthProvider className="relative z-10 pb-5">
        {Number(market_type) === 2 ? (
          <CampaignManager />
        ) : (
          <MarketManagerStoreProvider>
            <div
              className={cn(
                "flex min-h-screen w-full flex-col items-center p-12",
                "px-3 py-3 md:px-12"
              )}
            >
              <MarketManager />
            </div>

            <TransactionModal />
          </MarketManagerStoreProvider>
        )}
      </MaxWidthProvider>
    </div>
  );
};

export default Page;
