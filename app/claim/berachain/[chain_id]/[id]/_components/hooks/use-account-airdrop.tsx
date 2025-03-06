"use client";

import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { TransactionOptionsType } from "royco/types";

export const useAccountAirdrop = () => {
  const params = useParams();

  const { isConnected, address } = useAccount();

  return useQuery({
    queryKey: [
      "bera-airdrop",
      {
        address,
        id: params.id,
      },
    ],
    queryFn: async () => {
      const response = await fetch(
        `/api/boyco/bera?id=${params.id}&chain_id=${params.chain_id}&address=${address}`
      );
      return response.json() as Promise<{
        is_eligible: boolean;
        is_claimed: boolean;
        amount: string;
        proof: string[];
        markets: {
          royco_market_id: string;
          amount: string;
        }[];
        tx_options: TransactionOptionsType | null;
      }>;
    },
    enabled: !!isConnected && !!address && !!params.id,
  });
};
