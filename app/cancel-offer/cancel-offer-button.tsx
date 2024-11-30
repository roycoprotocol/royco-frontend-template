"use client";

import { Button } from "@/components/ui/button";
import { ContractMap } from "@/sdk/contracts";
import { RoycoMarketType } from "@/sdk/market/utils";
import { TransactionOptionsType } from "@/sdk/types/transaction";
import { useMarketManager } from "@/store";

export const CancelOfferButton = () => {
  const { setTransactions, setMarketStep } = useMarketManager();

  const onClick = async () => {
    // Get contract address and ABI
    const address = "0x76953a612c256fc497bbb49ed14147f24c4feb71";
    const abi =
      ContractMap[1 as keyof typeof ContractMap]["RecipeMarketHub"].abi;

    // Get transaction options
    const txOptions: TransactionOptionsType = {
      contractId: "RecipeMarketHub",
      chainId: 1,
      id: "cancel_ip_offer",
      label: "Cancel IP Offer",
      address,
      abi,
      functionName: "cancelIPOffer",
      marketType: RoycoMarketType.recipe.id,
      args: [
        "0x9e76378cc8de5ff9ced89265aa9745c393ddddb0fd23d6ccfc722642a51c1625",
      ],
      txStatus: "idle",
      txHash: null,
    };

    setTransactions([txOptions]);
  };

  return (
    <Button className="w-56" onClick={onClick}>
      Cancel Offer
    </Button>
  );
};
