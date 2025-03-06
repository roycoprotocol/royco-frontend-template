import "./local.css";

import { MarketManagerStoreProvider } from "@/store";
import { TransactionModal } from "@/components/composables";
import { cn } from "@/lib/utils";

const Page = () => {
  return (
    <MarketManagerStoreProvider>
      <div className="flex w-full flex-col items-center px-3 py-24">
        <div className={cn("flex w-full flex-col items-center")}>
          <h1 className="font-morion text-4xl font-bold">Berachain Claims</h1>

          <p className="mt-5 max-w-lg text-center font-gt text-base text-secondary">
            <span className="font-bold">Undergoing Maintenance:</span> BERA
            Claims will be back soon!
          </p>
        </div>
      </div>

      <TransactionModal />
    </MarketManagerStoreProvider>
  );
};

export default Page;
