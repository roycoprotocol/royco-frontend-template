"use client";

import { RPC_API_KEYS } from "@/components/constants";
import { Abi, Address, http } from "viem";
import { Button } from "@/components/ui/button";
import { getSupportedChain } from "@/sdk/utils/get-supported-chain";
import { createPublicClient } from "viem";
import { ContractMap } from "@/sdk/contracts";

export const Test = () => {
  const testFunction = async () => {
    try {
      const chainClient = createPublicClient({
        batch: {
          multicall: true,
        },
        chain: getSupportedChain(1),
        transport: http(RPC_API_KEYS[1]),
      });

      const contracts = [
        {
          address: "0x887d57a509070a0843c6418eb5cffc090dcbbe95" as Address,
          abi: ContractMap[1 as keyof typeof ContractMap]["WrappedVault"]
            .abi as Abi,
          functionName: "rewardToInterval",
          args: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address],
        },
      ];

      const query = await chainClient.multicall({ contracts });

      console.log("query", query);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button onClick={testFunction}>Click Me</Button>
    </div>
  );
};
