import { api } from "@/app/api/royco";
import { atomWithQuery } from "jotai-tanstack-query";
import { enrichedMarketIdAtom } from "./atoms";
import { lastRefreshTimestampAtom, customTokenDataAtom } from "../global";
import { ChartResponse } from "royco/api";
import {
  defaultQueryOptions,
  defaultQueryOptionsFastRefresh,
} from "@/utils/query";

export const loadableChartAtom = atomWithQuery<ChartResponse>((get) => ({
  queryKey: [
    "chart",
    {
      enrichedMarketId: get(enrichedMarketIdAtom),
      customTokenData: get(customTokenDataAtom),
      lastRefreshTimestamp: get(lastRefreshTimestampAtom),
    },
  ],
  queryFn: async () => {
    const enrichedMarketId = get(enrichedMarketIdAtom);
    const customTokenData = get(customTokenDataAtom);

    if (!enrichedMarketId) throw new Error("Enriched market ID is not set");

    return api
      .chartControllerGetMarketChart(enrichedMarketId, {
        customTokenData,
      })
      .then((res) => res.data);
  },
  ...defaultQueryOptionsFastRefresh,
  enabled: Boolean(get(enrichedMarketIdAtom)),
}));
