"use client";

import { useParams } from "next/navigation";
import {
  useActionsDecoder,
  useHighestOffers,
  useEnrichedMarkets,
  useReadMarket,
} from "royco/hooks";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import { isEqual } from "lodash";
import { produce } from "immer";

import { MarketType, useGlobalStates } from "@/store";
import { EnrichedMarketDataType } from "royco/queries";

export const useActiveMarket = () => {
  const params = useParams();
  const chain_id = params.chain_id;
  const market_type = params.market_type;
  const market_id = params.market_id;

  const { customTokenData } = useGlobalStates();

  /**
   * @notice Enriched Market
   */
  const propsEnrichedMarket = useEnrichedMarkets({
    // @ts-ignore
    chain_id: parseInt(chain_id),
    // @ts-ignore
    market_type: parseInt(market_type),
    // @ts-ignore
    market_id: market_id,
    custom_token_data: customTokenData,
  });

  /**
   * @notice Enriched Market Placeholder Data
   */
  const [placeholderDatasEnrichedMarket, setPlaceholderDatasEnrichedMarket] =
    useImmer<Array<EnrichedMarketDataType | undefined | null>>([
      undefined,
      undefined,
    ]);

  /**
   * @notice Top Offers
   */
  const propsHighestOffers = useHighestOffers({
    // @ts-ignore
    chain_id: parseInt(chain_id),
    // @ts-ignore
    market_id: market_id,
    // @ts-ignore
    market_type: parseInt(market_type),
    custom_token_data: customTokenData,
  });

  /**
   * @notice Top Offers Placeholder Data
   */
  const [placeholderDatasHighestOffers, setPlaceholderDatasHighestOffers] =
    // @ts-ignore
    useImmer<Array<typeof propsHighestOffers.data>>([undefined, undefined]);

  /**
   * @notice Read Recipe Market
   */
  const propsReadMarket = useReadMarket({
    // @ts-ignore
    chain_id: parseInt(chain_id),
    // @ts-ignore
    market_type: parseInt(market_type) === 0 ? "recipe" : "vault",
    // @ts-ignore
    market_id: market_id,
  });

  /**
   * @notice Actions Decoder Enter Market
   */
  // const propsActionsDecoderEnterMarket = useActionsDecoder({
  //   // @ts-ignore
  //   chain_id: parseInt(chain_id),
  //   script: propsReadMarket.data?.enter_market_script ?? null,
  // });

  // /**
  //  * @notice Actions Decoder Exit Market
  //  */
  // const propsActionsDecoderExitMarket = useActionsDecoder({
  //   // @ts-ignore
  //   chain_id: parseInt(chain_id),
  //   script: propsReadMarket.data?.exit_market_script ?? null,
  // });

  /**
   * @notice Update Top Offers Recipe Data
   */
  useEffect(() => {
    if (
      propsHighestOffers.isLoading === false &&
      propsHighestOffers.isRefetching === false &&
      !isEqual(propsHighestOffers.data, placeholderDatasHighestOffers[1])
    ) {
      setPlaceholderDatasHighestOffers((prevDatas) => {
        return produce(prevDatas, (draft) => {
          // Prevent overwriting previous data with the same object reference
          if (!isEqual(draft[1], propsHighestOffers.data)) {
            draft[0] = draft[1] as typeof propsHighestOffers.data; // Set previous data to the current data
            draft[1] =
              propsHighestOffers.data as typeof propsHighestOffers.data; // Set current data to the new data
          }
        });
      });
    }
  }, [
    propsHighestOffers.isLoading,
    propsHighestOffers.isRefetching,
    propsHighestOffers.data,
  ]);

  /**
   * @notice Update Enriched Market Data
   */
  useEffect(() => {
    if (
      propsEnrichedMarket.isLoading === false &&
      propsEnrichedMarket.isRefetching === false &&
      !isEqual(propsEnrichedMarket.data, placeholderDatasEnrichedMarket[1])
    ) {
      setPlaceholderDatasEnrichedMarket((prevDatas) => {
        return produce(prevDatas, (draft) => {
          // Prevent overwriting previous data with the same object reference
          if (!isEqual(draft[1], propsEnrichedMarket.data)) {
            // @ts-ignore
            draft[0] = draft[1] as typeof propsEnrichedMarket.data; // Set previous data to the current data
            // @ts-ignore
            draft[1] =
              propsEnrichedMarket.data as typeof propsEnrichedMarket.data; // Set current data to the new data
          }
        });
      });
    }
  }, [
    ,
    propsEnrichedMarket.isLoading,
    propsEnrichedMarket.isRefetching,
    propsEnrichedMarket.data,
  ]);

  // Debugging: Log the state changes
  // console.log("Current Market Data:", placeholderDatas[1]);
  // console.log("Previous Market Data:", placeholderDatas[0]);

  const isLoading =
    propsEnrichedMarket.isLoading || propsHighestOffers.isLoading;
  // propsReadMarket.isLoading ||
  // propsActionsDecoderEnterMarket.isLoading ||
  // propsActionsDecoderExitMarket.isLoading;

  return {
    isLoading,
    marketMetadata: {
      // @ts-ignore
      chain_id: parseInt(chain_id) as number,
      // @ts-ignore
      // market_type: parseInt(market_type) as 0 | 1,
      market_type:
        // @ts-ignore
        parseInt(market_type) === 0
          ? MarketType.recipe.id
          : // @ts-ignore
            MarketType.vault.id,
      // @ts-ignore
      market_id: market_id as string,
    },
    propsEnrichedMarket,
    previousMarketData:
      !!placeholderDatasEnrichedMarket[0] &&
      // @ts-ignore
      placeholderDatasEnrichedMarket[0].length > 0
        ? // @ts-ignore
          (placeholderDatasEnrichedMarket[0][0] as EnrichedMarketDataType)
        : undefined,
    currentMarketData: propsEnrichedMarket.data?.[0] as EnrichedMarketDataType,
    // currentMarketData:
    //   !!placeholderDatasEnrichedMarket[1] &&
    //   // @ts-ignore
    //   placeholderDatasEnrichedMarket[1].length > 0
    //     ? // @ts-ignore
    //       (placeholderDatasEnrichedMarket[1][0] as EnrichedMarketDataType)
    //     : undefined,
    propsHighestOffers,
    previousHighestOffers: placeholderDatasHighestOffers[0],
    currentHighestOffers: placeholderDatasHighestOffers[1],
    propsActionsDecoderEnterMarket: {
      data: [],
      isLoading: false,
      isRefetching: false,
      isError: false,
    },
    propsActionsDecoderExitMarket: {
      data: [],
      isLoading: false,
      isRefetching: false,
      isError: false,
    },
    propsReadMarket,
  };
};
