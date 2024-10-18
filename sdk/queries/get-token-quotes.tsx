import { type TypedRoycoClient } from "@/sdk/client";
import { getSupportedToken } from "../constants";

export type TypedTokenQuote = {
  token_id: string;
  price: number;
  total_supply: number;
  fdv: number;
};

export const getTokenQuotesQueryOptions = (
  client: TypedRoycoClient,
  token_ids: string[]
) => ({
  queryKey: ["tokens-quote", token_ids.map((id) => `${id}`).join(":")],
  queryFn: async () => {
    const lowercaseTokenIds = token_ids.map((id) => id.toLowerCase());

    const result = await client
      .from("token_quotes_latest")
      .select("*")
      .in("token_id", lowercaseTokenIds)
      .throwOnError();

    if (result.data) {
      const rows = result.data as TypedTokenQuote[];

      const new_rows = lowercaseTokenIds.map((token_id) => {
        const token_data = getSupportedToken(token_id);
        let quote_data = rows.find(
          (r) => r.token_id.toLowerCase() === token_id
        );

        if (!quote_data) {
          quote_data = {
            token_id,
            price: 0,
            total_supply: 0,
            fdv: 0,
          };
        }

        return {
          ...token_data,
          ...quote_data,
        };
      });

      return new_rows;
    }

    return null;
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  staleTime: 1000 * 60 * 1, // 1 min
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
