import "./local.css";

import { MarketManagerStoreProvider } from "@/store";
import { TransactionModal } from "@/components/composables";
import { cn } from "@/lib/utils";
import { Header } from "./_components/ui/header";
import { Banner } from "./_components/ui/banner";
import { ClaimCard } from "./_components/ui/claim-card";
import { ClaimStatus } from "./_components/ui/claim-status";
import { MarketList } from "./_components/ui/market-list";

const Page = () => {
  return (
    <MarketManagerStoreProvider>
      <div className="flex w-full flex-col items-center px-3 py-24">
        <Header />

        <div className="mt-10 flex h-fit w-full max-w-2xl flex-col">
          <Banner />

          <ClaimStatus className="mt-10" />

          <ClaimCard className="mt-3" />

          <MarketList className="mt-3" />
        </div>
      </div>

      {/* <div className="flex w-full flex-col items-center px-3 py-24">
        <div className={cn("flex w-full flex-col items-center")}>
          <h1 className="font-morion text-4xl font-bold">Berachain Claims</h1>

          <p className="mt-5 max-w-lg text-center font-gt text-base text-secondary">
            <span className="font-bold">Undergoing Maintenance:</span> BERA
            Claims will be back soon!
          </p>
        </div>
      </div> */}

      <TransactionModal />
    </MarketManagerStoreProvider>
  );
};

export default Page;
