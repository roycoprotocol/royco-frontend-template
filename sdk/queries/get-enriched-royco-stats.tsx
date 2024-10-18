import { type TypedRoycoClient } from "@/sdk/client";
import { sepolia } from "viem/chains";
import { getSupportedChain } from "../utils";

export const getEnrichedRoycoStatsQueryOptions = (
  client: TypedRoycoClient,
  testnet: boolean
) => ({
  queryKey: ["enriched-royco-stats", `testnet=${testnet}`],
  queryFn: async () => {
    const result = await client
      .from("enriched_royco_stats")
      .select("*")
      .throwOnError()
      .then((result) => result.data);

    let total_volume = 0;
    let total_tvl = 0;
    let total_incentives = 0;

    if (!!result && result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (!!result[i].chain_id) {
          const chain = getSupportedChain(result[i].chain_id as number);

          if (testnet === true) {
            if (chain?.testnet === true) {
              total_volume += result[i].total_volume ?? 0;
              total_tvl += result[i].total_tvl ?? 0;
              total_incentives += result[i].total_incentives ?? 0;
            }
          } else {
            if (chain?.testnet === false) {
              total_volume += result[i].total_volume ?? 0;
              total_tvl += result[i].total_tvl ?? 0;
              total_incentives += result[i].total_incentives ?? 0;
            }
          }
        }
      }
    }

    return {
      total_volume,
      total_tvl,
      total_incentives,
    };
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  staleTime: 1000 * 60 * 1, // 1 min
  refetchInterval: 1000 * 60 * 1, // 1 min
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
