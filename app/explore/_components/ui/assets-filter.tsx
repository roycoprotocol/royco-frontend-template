import { Fragment } from "react";

import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/composables";
import { type TypedArrayDistinctAsset, useDistinctAssets } from "@/sdk/hooks";

import { FilterWrapper } from "../composables";
import { sepolia } from "viem/chains";
import { AlertIndicator } from "@/components/common";
import { getSupportedChain } from "@/sdk/utils";

export const AssetsFilter = () => {
  const { data, isLoading, isError, isRefetching } = useDistinctAssets({
    output: "array",
  });

  const totalAssets = !!data
    ? (data as TypedArrayDistinctAsset[]).filter((token) => {
        if (process.env.NEXT_PUBLIC_FRONTEND_TYPE !== "TESTNET") {
          return !token.ids.some((id) => {
            const [chain_id, token_address] = id.split("-");
            const chain = getSupportedChain(parseInt(chain_id));
            return chain?.testnet === true;
          });
        } else {
          return true;
        }
      }).length
    : 0;

  if (isLoading)
    return (
      <div className="flex w-full flex-col place-content-center items-center">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );

  if (!isLoading && totalAssets === 0) {
    return <AlertIndicator className="py-2">No tokens yet</AlertIndicator>;
  }

  if (data) {
    return (
      <Fragment>
        {(data as Array<TypedArrayDistinctAsset>).map((token, index) => {
          const shouldHide =
            process.env.NEXT_PUBLIC_FRONTEND_TYPE !== "TESTNET" &&
            token.ids.some((id) => {
              const [chain_id, token_address] = id.split("-");
              const chain = getSupportedChain(parseInt(chain_id));
              return chain?.testnet === true;
            });

          if (token) {
            return (
              <div
                className={cn(shouldHide && "hidden")}
                key={`filter-wrapper:assets:${token.symbol}`}
              >
                <FilterWrapper
                  filter={{
                    id: "input_token_id",
                    value: token.symbol,
                    matches: token.ids,
                  }}
                  token={{
                    image: token.image,
                    symbol: token.symbol,
                    ids: token.ids,
                  }}
                />
              </div>
            );
          }
        })}
      </Fragment>
    );
  }
};
