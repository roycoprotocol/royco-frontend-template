"use client";

import { Fragment, useMemo } from "react";

import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/composables";
import { type TypedArrayDistinctAsset, useDistinctAssets } from "royco/hooks";

import { FilterWrapper } from "../composables";
import { AlertIndicator } from "@/components/common";
import { getSupportedChain } from "royco/utils";
import { getFrontendTag } from "@/store";

const excludedToken = ["1-0x4f8e1426a9d10bddc11d26042ad270f16ccb95f2"];

export const AssetsFilter = () => {
  const { data, isLoading, isError, isRefetching } = useDistinctAssets();

  const tokens = !!data
    ? (data as TypedArrayDistinctAsset[]).filter((token) => {
        const frontendTag =
          typeof window !== "undefined" ? getFrontendTag() : "default";

        if (frontendTag === "testnet") {
          return token.ids.every((id) => {
            const [chain_id] = id.split("-");
            const chain = getSupportedChain(parseInt(chain_id));
            return chain?.id === 11155111;
          });
        } else if (frontendTag !== "dev") {
          return !token.ids.every((id) => {
            const [chain_id, token_address] = id.split("-");
            const chain = getSupportedChain(parseInt(chain_id));
            return chain?.testnet === true;
          });
        } else {
          return true;
        }
      })
    : [];

  const filteredTokens = useMemo(() => {
    return tokens.filter((token: any) => {
      return !excludedToken.includes(token.id);
    });
  }, [tokens]);

  if (isLoading)
    return (
      <div className="flex w-full flex-col place-content-center items-center">
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );

  if (!isLoading && tokens.length === 0) {
    return <AlertIndicator className="py-2">No tokens yet</AlertIndicator>;
  }

  if (data) {
    return (
      <Fragment>
        {filteredTokens.map((token, index) => {
          if (token) {
            return (
              <div key={`filter-wrapper:assets:${token.symbol}`}>
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
