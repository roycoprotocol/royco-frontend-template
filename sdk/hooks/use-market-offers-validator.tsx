import { getMarketOffersValidatorQueryOptions } from "@/sdk/queries";
import { useQuery } from "@tanstack/react-query";

export const useMarketOffersValidator = ({
  offer_ids,
  offerValidationUrl,
}: {
  offer_ids: string[];
  offerValidationUrl: string;
}) => {
  return useQuery({
    ...getMarketOffersValidatorQueryOptions({
      offer_ids,
      offerValidationUrl,
    }),
  });
};
