/**
 * @notice will be updated
 */

import { type TypedRoycoClient } from "@/sdk/client";
import type { Tables } from "@/sdk/types";

export type DistinctAssets = Pick<
  Tables<"distinct_assets">,
  "symbol" | "image" | "ids"
>;

export const getDistinctAssetsQueryOptions = (client: TypedRoycoClient) => ({
  queryKey: ["distinct-assets"],
  queryFn: async () => {
    return client
      .from("distinct_assets")
      .select("symbol, ids")
      .throwOnError()
      .then((result) => result.data);
  },
  keepPreviousData: true,
  refetchInterval: 1000 * 60 * 1, // 1 minute
});
