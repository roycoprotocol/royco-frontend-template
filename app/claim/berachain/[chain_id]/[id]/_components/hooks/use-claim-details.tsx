"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const useClaimDetails = () => {
  const params = useParams();

  return useQuery({
    queryKey: [
      "merkle-claim-details",
      {
        id: params.id,
      },
    ],
    queryFn: async () => {
      const response = await fetch(`/api/boyco/claim?id=${params.id}`);
      return response.json() as Promise<{
        market_ids: string[];
      }>;
    },
    enabled: !!params.id && !!params.chain_id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
  });
};
