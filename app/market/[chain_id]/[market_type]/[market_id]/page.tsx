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
          "px-5 py-3 md:px-12 md:py-10 lg:px-[10.44rem] xl:px-[12.44rem]"
        )}
      >
        <MarketManager />

        <TransactionModal />
      </div>
    </MarketManagerStoreProvider>
  );
};

export default Page;
