"use client";

import { MarketManagerStoreProvider } from "@/store";
import { CancelOfferButton } from "./cancel-offer-button";
import { TransactionModal } from "@/components/composables";

export default function CancelOffer() {
  return (
    <MarketManagerStoreProvider>
      <div className="flex h-screen flex-col items-center justify-center">
        <CancelOfferButton />

        <TransactionModal />
      </div>
    </MarketManagerStoreProvider>
  );
}
