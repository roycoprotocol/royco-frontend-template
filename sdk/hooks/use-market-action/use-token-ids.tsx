import {
  RoycoMarketUserType,
  RoycoMarketOfferType,
  RoycoMarketType,
  TypedRoycoMarketUserType,
  TypedRoycoMarketOfferType,
  TypedRoycoMarketType,
} from "../../market";
import { getSupportedToken } from "../../constants";
import { BigNumber } from "ethers";
import { useReadMarket } from "../use-read-market";
import { useMarketOffers } from "../use-market-offers";
import { EnrichedMarketDataType } from "@/sdk/queries";

export const useTokenIds = ({
  enabled,
  market_type,
  market,
  user_type,
  offer_type,
  propsMarketOffers,
  propsReadMarket,
  incentive_token_ids,
  incentive_token_amounts,
}: {
  enabled: boolean;
  market_type: TypedRoycoMarketType;
  market: EnrichedMarketDataType | null;
  user_type: TypedRoycoMarketUserType;
  offer_type: TypedRoycoMarketOfferType;
  propsMarketOffers: ReturnType<typeof useMarketOffers>;
  propsReadMarket: ReturnType<typeof useReadMarket>;
  incentive_token_ids?: string[];
  incentive_token_amounts?: string[];
}) => {
  let token_ids: string[] = [];
  let action_incentive_token_ids: string[] = [];
  let action_incentive_token_amounts: string[] = [];

  // Modify token_ids
  if (enabled) {
    // handle Recipe Market
    if (market_type === RoycoMarketType.recipe.id) {
      // handle AP
      if (user_type === RoycoMarketUserType.ap.id) {
        // handle AP Market Offer Recipe Market
        if (offer_type === RoycoMarketOfferType.market.id) {
          const token_id_to_amount_map =
            propsMarketOffers.data?.reduce(
              (acc, offer) => {
                offer.token_ids.forEach((token_id, index) => {
                  const amount = BigNumber.from(
                    offer.token_amounts[index].toString()
                  );

                  const actual_amount = amount
                    .mul(BigNumber.from(offer.fill_quantity))
                    .div(BigNumber.from(offer.quantity));

                  if (acc[token_id]) {
                    acc[token_id] = acc[token_id].add(actual_amount);
                  } else {
                    acc[token_id] = actual_amount; // Initialize with the BigNumber amount
                  }
                });
                return acc;
              },
              {} as Record<string, BigNumber>
            ) ?? {};

          // Get the unique token IDs
          const market_offer_incentive_token_ids = Object.keys(
            token_id_to_amount_map
          );

          // Get the summed token amounts as strings to avoid any floating-point issues
          const market_offer_incentive_token_amounts =
            market_offer_incentive_token_ids.map((token_id) =>
              token_id_to_amount_map[token_id].toString()
            );

          token_ids = [
            market?.input_token_id as string,
            ...market_offer_incentive_token_ids,
          ];

          action_incentive_token_ids = market_offer_incentive_token_ids;
          action_incentive_token_amounts = market_offer_incentive_token_amounts;
        }
        // handle AP Limit Offer Recipe Market
        else {
          token_ids = [
            market?.input_token_id as string,
            ...(incentive_token_ids || []),
          ];

          action_incentive_token_ids = incentive_token_ids || [];
          action_incentive_token_amounts = incentive_token_amounts || [];
        }
      }
      // handle IP
      else {
        // handle IP Market Offer Recipe Market
        if (offer_type === RoycoMarketOfferType.market.id) {
          const token_id_to_amount_map =
            propsMarketOffers.data?.reduce(
              (acc, offer) => {
                offer.token_ids.forEach((token_id, index) => {
                  const amount = BigNumber.from(offer.token_amounts[index])
                    .mul(BigNumber.from(offer.fill_quantity))
                    .div(BigNumber.from(offer.quantity));

                  const actual_amount = amount
                    .add(
                      amount
                        .mul(
                          BigNumber.from(
                            propsReadMarket.data?.protocol_fee as string
                          )
                        )
                        .div(BigNumber.from("10").pow(18))
                    )
                    .add(
                      amount
                        .mul(
                          BigNumber.from(
                            propsReadMarket.data?.frontend_fee as string
                          )
                        )
                        .div(BigNumber.from("10").pow(18))
                    );

                  if (acc[token_id]) {
                    acc[token_id] = acc[token_id].add(actual_amount); // Add the amount to the existing BigNumber
                  } else {
                    acc[token_id] = actual_amount; // Initialize with the BigNumber amount
                  }
                });
                return acc;
              },
              {} as Record<string, BigNumber>
            ) ?? {};

          // Get the unique token IDs
          const market_offer_incentive_token_ids = Object.keys(
            token_id_to_amount_map
          );

          // Get the summed token amounts as strings to avoid any floating-point issues
          const market_offer_incentive_token_amounts =
            market_offer_incentive_token_ids.map((token_id) => {
              const raw_amount: BigNumber = token_id_to_amount_map[token_id];
              // const raw_amount_after_fees: BigNumber = raw_amount
              //   .add(
              //     raw_amount.mul(
              //       BigNumber.from(
              //         propsReadMarket.data?.protocol_fee as string
              //       ).div(BigNumber.from(10).pow(18))
              //     )
              //   )
              //   .add(
              //     raw_amount.mul(
              //       BigNumber.from(
              //         propsReadMarket.data?.frontend_fee as string
              //       ).div(BigNumber.from(10).pow(18))
              //     )
              //   );

              return raw_amount.toString();
            });

          token_ids = [
            market?.input_token_id as string,
            ...market_offer_incentive_token_ids,
          ];

          action_incentive_token_ids = market_offer_incentive_token_ids;
          action_incentive_token_amounts = market_offer_incentive_token_amounts;
        }
        // handle IP Limit Offer Recipe Market
        else {
          const protocol_fee = propsReadMarket.data?.protocol_fee as string;
          const frontend_fee = propsReadMarket.data?.frontend_fee as string;

          token_ids = [
            market?.input_token_id as string,
            ...(incentive_token_ids || []),
          ];

          action_incentive_token_ids = incentive_token_ids || [];
          action_incentive_token_amounts =
            (incentive_token_amounts || []).map((raw_amount, index) => {
              const token_data = getSupportedToken(
                (incentive_token_ids ?? [])[index]
              );

              const raw_amount_after_fees = BigNumber.from(raw_amount)
                .sub(
                  BigNumber.from(raw_amount).mul(
                    BigNumber.from(protocol_fee).div(BigNumber.from(10).pow(18))
                  )
                )
                .sub(
                  BigNumber.from(raw_amount).mul(
                    BigNumber.from(frontend_fee).div(BigNumber.from(10).pow(18))
                  )
                )
                .toString();

              // const token_amount = ethers.utils.formatUnits(
              //   raw_amount_after_fees,
              //   token_data.decimals
              // );

              return raw_amount_after_fees;
            }) || [];
        }
      }
    }
    // @TODO
    // handle Vault Market
    else {
      // handle AP
      if (user_type === RoycoMarketUserType.ap.id) {
        // handle AP Market Offer Vault Market
        if (offer_type === RoycoMarketOfferType.market.id) {
          token_ids = [market?.input_token_id as string];
        }
        // handle AP Limit Offer Vault Market
        else {
        }
      }
      // handle IP
      else {
        // handle IP Market Offer Vault Market
        if (offer_type === RoycoMarketOfferType.market.id) {
          // @TODO based on market offers
        }
        // handle IP Limit Offer Vault Market
        else {
          token_ids = incentive_token_ids || [];

          action_incentive_token_ids = incentive_token_ids || [];
          action_incentive_token_amounts = incentive_token_amounts || [];
        }
      }
    }
  }

  return {
    token_ids,
    action_incentive_token_ids,
    action_incentive_token_amounts,
  };
};
