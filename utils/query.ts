import { keepPreviousData } from "@tanstack/react-query";

export const defaultQueryOptions = {
  staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  gcTime: 1000 * 60 * 5, // Keep data in cache for 5 minutes
  placeholderData: keepPreviousData, // Keep previous data while fetching new data
  refetchOnWindowFocus: false, // Don't refetch on window focus
  refetchIntervalInBackground: true, // Refetch in background
} as const;

export const defaultQueryOptionsFastRefresh = {
  refetchInterval: 1000 * 60 * 1, // Refetch every 1 minute
  gcTime: 1000 * 60 * 1, // Keep data in cache for 1 minute
  placeholderData: keepPreviousData, // Keep previous data while fetching new data
  refetchOnWindowFocus: false, // Don't refetch on window focus
  refetchIntervalInBackground: true, // Refetch in background
} as const;
