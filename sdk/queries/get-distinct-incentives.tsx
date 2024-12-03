/**
 * @notice will be updated
 */

import { type TypedRoycoClient } from "royco/client";
import type { Tables } from "royco/types";

export type DistinctIncentives = Pick<
  Tables<"distinct_incentives">,
  "symbol" | "image" | "ids"
>;

export const getDistinctIncentivesQueryOptions = (
  client: TypedRoycoClient
) => ({
  queryKey: ["distinct-incentives"],
  queryFn: async () => {
    return client
      .from("distinct_incentives")
      .select("symbol, ids")
      .throwOnError()
      .then((result) => result.data);
  },
  keepPreviousData: true,
  refetchInterval: 1000 * 60 * 1, // 1 minute
});
