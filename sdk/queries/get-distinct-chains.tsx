/**
 * @notice will be updated
 */

import { type TypedRoycoClient } from "royco/client";
import type { Tables } from "royco/types";

export type DistinctChains = Pick<
  Tables<"distinct_chains">,
  "id" | "symbol" | "image"
>;

export const getDistinctChainsQueryOptions = (client: TypedRoycoClient) => ({
  queryKey: ["distinct-chains"],
  queryFn: async () => {
    return client
      .from("distinct_chains")
      .select("id, image, symbol")
      .throwOnError()
      .then((result) => result.data);
  },
  keepPreviousData: true,
  refetchInterval: 1000 * 60 * 1, // 1 minute
});
