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
      const response = await fetch(
        `/api/boyco/claim?id=${params.id}&chain_id=${params.chain_id}`
      );
      return response.json() as Promise<{
        active_at: number;
      }>;
    },
    enabled: !!params.id && !!params.chain_id,
  });
};
