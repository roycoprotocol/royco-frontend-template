"use client";

import { MarketManagerStoreProvider } from "@/store";
import { HardcodedButton } from "./hardcoded-button";
import { TransactionModal } from "@/components/composables";

export default function Page() {
  return (
    <MarketManagerStoreProvider>
      <div className="flex h-screen flex-col items-center justify-center">
        <HardcodedButton />

        <TransactionModal />
      </div>
    </MarketManagerStoreProvider>
  );
}
