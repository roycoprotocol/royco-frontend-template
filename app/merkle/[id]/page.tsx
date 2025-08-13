import "./local.css";

import { MarketManagerStoreProvider } from "@/store";
import { TransactionModal } from "@/components/composables";
import { cn } from "@/lib/utils";
import { MerkleUI } from "./_components/ui";

const Page = () => {
  return (
    <MarketManagerStoreProvider>
      <div className="flex w-full flex-col items-center px-3 py-24">
        <MerkleUI />
      </div>

      <TransactionModal />
    </MarketManagerStoreProvider>
  );
};

export default Page;
