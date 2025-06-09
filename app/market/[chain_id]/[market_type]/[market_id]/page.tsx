"use client";

import "./local.css";
import { cn } from "@/lib/utils";
import { MarketManager } from "./_components/market-manager";
import { MarketManagerStoreProvider } from "@/store";
import { TransactionModal } from "@/components/composables";
import { useParams } from "next/navigation";
import { CampaignManager } from "@/app/market/components/campaign/campaign-manager";

const Page = () => {
  const { market_type, chain_id, market_id } = useParams();

  return (
    <MarketManagerStoreProvider>
      <div
        className={cn(
          "flex min-h-screen w-full flex-col items-center bg-[#FBFBF8]"
        )}
      >
        {Number(market_type) === 2 ? (
          <CampaignManager />
        ) : (
          <div
            className={cn(
              "flex min-h-screen w-full flex-col items-center bg-[#FBFBF8] p-12",
              "px-3 py-3 md:px-12"
            )}
          >
            <MarketManager />
          </div>
        )}

        <TransactionModal />
      </div>
    </MarketManagerStoreProvider>
  );
};

export default Page;
