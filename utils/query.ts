import { keepPreviousData } from "@tanstack/react-query";
import { minutesToMilliseconds } from "date-fns";

export const defaultQueryOptions = {
  refetchOnWindowFocus: false,
  refetchIntervalInBackground: true,
  refetchInterval: minutesToMilliseconds(1), // 1 minute
  placeholderData: keepPreviousData, // Keep previous data while fetching new data
  staleTime: minutesToMilliseconds(5), // 5 minutes
  gcTime: minutesToMilliseconds(5), // 5 minutes
} as const;
