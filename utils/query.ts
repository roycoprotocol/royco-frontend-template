import { keepPreviousData } from "@tanstack/react-query";
import { minutesToMilliseconds, secondsToMilliseconds } from "date-fns";

export const defaultQueryOptions = {
  refetchOnWindowFocus: false,
  refetchIntervalInBackground: true,
  refetchInterval: minutesToMilliseconds(1), // 1 minute
  placeholderData: keepPreviousData, // Keep previous data while fetching new data
  staleTime: minutesToMilliseconds(5), // 5 minutes
  gcTime: minutesToMilliseconds(5), // 5 minutes
} as const;

export const defaultQueryOptionsFastRefresh = {
  refetchOnWindowFocus: false,
  refetchIntervalInBackground: true,
  refetchInterval: secondsToMilliseconds(10), // 10 seconds
  placeholderData: keepPreviousData, // Keep previous data while fetching new data
  staleTime: secondsToMilliseconds(10), // 10 seconds
} as const;
