import "./local.css";

import { Header } from "./_components/ui/header";
import { Banner } from "./_components/ui/banner";
import { ClaimCard } from "./_components/ui/claim-card";
import { ClaimStatus } from "./_components/ui/claim-status";
import { MarketManagerStoreProvider } from "@/store";
import { TransactionModal } from "@/components/composables";

const Page = () => {
  return (
    <MarketManagerStoreProvider>
      <div className="flex w-full flex-col items-center px-3 py-24">
        <Header />

        <div className="mt-10 flex h-fit w-full max-w-2xl flex-col">
          <Banner />

          <ClaimStatus className="mt-10" />

          <ClaimCard className="mt-3" />
        </div>
      </div>

      <TransactionModal />
    </MarketManagerStoreProvider>
  );
};

export default Page;
