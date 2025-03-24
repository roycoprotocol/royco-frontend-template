"use client";

import { Button } from "@/components/ui/button";
import { ContractMap } from "royco/contracts";
import { RoycoMarketType } from "royco/market";
import { TransactionOptionsType } from "royco/types";
import { useMarketManager } from "@/store";
import { useAccount } from "wagmi";

export const HardcodedButton = () => {
  const { isConnected, address } = useAccount();

  const { setTransactions, setMarketStep } = useMarketManager();

  const onClick = async () => {
    // Get contract address and ABI
    const address = "0x239b40AD70125883d948604f354bA90e1247F3EC";
    const abi = ContractMap[1 as keyof typeof ContractMap]["WeirollWallet"].abi;

    // Get transaction options
    const txOptions: TransactionOptionsType = {
      contractId: "WeirollWallet",
      chainId: 1,
      id: "withdraw_lp_tokens",
      label: "Withdraw LP Tokens",
      address,
      abi,
      functionName: "manualExecuteWeiroll",
      marketType: RoycoMarketType.recipe.id,
      args: [
        [
          "0xb65d95ec01ffffffffffff0107899ac8be7462151d6515fcd4773dd9267c9911",
          "0x2e1cc2f601ffffffffffff0207899ac8be7462151d6515fcd4773dd9267c9911",
          "0x095ea7b3010200ffffffffffd14117baf6ec5d12be68cd06e763a4b82c9b6d1d",
          "0x095ea7b3010200ffffffffffd14117baf6ec5d12be68cd06e763a4b82c9b6d1d",
          "0x9262187b0101ffffffffffffd14117baf6ec5d12be68cd06e763a4b82c9b6d1d",
          "0x70a082310101ffffffffff02f1ef7d2d4c0c881cd634481e0586ed5d2871a74b",
          "0x70a082310101ffffffffff01d14117baf6ec5d12be68cd06e763a4b82c9b6d1d",
          "0x8da5cb5b01ffffffffffff0007899ac8be7462151d6515fcd4773dd9267c9911",
          "0xa9059cbb010001ffffffffffd14117baf6ec5d12be68cd06e763a4b82c9b6d1d",
          "0x8da5cb5b01ffffffffffff0007899ac8be7462151d6515fcd4773dd9267c9911",
          "0xa9059cbb010002fffffffffff1ef7d2d4c0c881cd634481e0586ed5d2871a74b",
        ],
        [
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "0x",
          "0x",
        ],
      ],
      txStatus: "idle",
      txHash: null,
    };

    setTransactions([txOptions]);
  };

  return (
    <Button className="w-56" onClick={onClick} disabled={!isConnected}>
      Withdraw
    </Button>
  );
};
