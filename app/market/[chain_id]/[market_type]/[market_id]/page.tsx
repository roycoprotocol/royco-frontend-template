import "./local.css";
import { cn } from "@/lib/utils";
import { MarketManager } from "./_components";
import { MarketManagerStoreProvider } from "@/store";
import { TransactionModal } from "@/components/composables";

const Page = () => {
  return (
    <MarketManagerStoreProvider>
      <div
        className={cn(
          "flex min-h-screen w-full flex-col items-center bg-[#FBFBF8] p-12",
          "px-3 py-3 md:px-12"
        )}
      >
        <MarketManager />

        <TransactionModal />
      </div>
    </MarketManagerStoreProvider>
  );
};

export default Page;
