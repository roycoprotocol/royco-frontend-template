"use client";

import { Fragment, useMemo, useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/composables";
import { type TypedArrayDistinctAsset, useDistinctAssets } from "royco/hooks";

import { FilterWrapper } from "../composables";
import { AlertIndicator } from "@/components/common";
import { getSupportedChain } from "royco/utils";
import { getSupportedToken } from "royco/constants";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const excludedToken = ["1-0x4f8e1426a9d10bddc11d26042ad270f16ccb95f2"];

const boycoAssetIds = [
  "1-0x7a56e1c57c7475ccf742a1832b028f0456652f97",
  "1-0xd9d920aa40f578ab794426f5c90f6c731d159def",
  "1-0x094c0e36210634c3CfA25DC11B96b562E0b07624",
  "1-0x7122985656e38BDC0302Db86685bb972b145bD3C",
  "1-0x8a60e489004ca22d775c5f2c657598278d17d9c2",
  "1-0x2b66aade1e9c062ff411bd47c44e0ad696d43bd9",
  "1-0x09D4214C03D01F49544C0448DBE3A27f768F2b34",
  "1-0x4c9edd5852cd905f086c759e8383e09bff1e68b3",
  "1-0x9d39a5de30e57443bff2a8307a4256c8797a3497",
  "1-0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
  "1-0xf6718b2701D4a6498eF77D7c152b2137Ab28b8A3",
  "1-0x09DEF5aBc67e967d54E8233A4b5EBBc1B3fbE34b",
  "1-0xADc9c900b05F39f48bB6F402A1BAE60929F4f9A8",
  "1-0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568",
  "1-0x8236a87084f8b84306f72007f36f2618a5634494",
  "1-0xC96dE26018A54D51c097160568752c4E3BD6C364",
  "1-0xd87a19fF681AE98BF10d2220D1AE3Fbd374ADE4e",
  "1-0xd4Cc9b31e9eF33E392FF2f81AD52BE8523e0993b",
  "1-0x6c77bdE03952BbcB923815d90A73a7eD7EC895D1",
  "1-0xcc7E6dE27DdF225E24E8652F62101Dab4656E20A",
  "1-0xB13aa2d0345b0439b064f26B82D8dCf3f508775d",
  "1-0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3",
  "1-0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0",
  "1-0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7",
  "1-0x73A15FeD60Bf67631dC6cd7Bc5B6e8da8190aCF5",
  "1-0x35D8949372D46B7a3D5A56006AE77B215fc69bC0",
  "1-0xd155d91009cbE9B0204B06CE1b62bf1D793d3111",
  "1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  "1-0xdAC17F958D2ee523a2206206994597C13D831ec7",

  // LP Tokens
  "1-0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
  "1-0x004375Dff511095CC5A197A54140a24eFEF3A416",
  "1-0xBb2b8038a1640196FbE3e38816F3e67Cba72D940",
  "1-0x3041CbD36888bECc7bbCBc0045E3B1f144466f5f",
  "1-0x1E496FaE4613b4e9C4f8Fc31826812cDcbD03A90",
  "1-0x2289F64e11a3c6A3e23d5f0c705bb0Bb7661278a",
  "1-0xcF21354360FdAe8EdAD02c0529E55cB3E71c36c9",
  "1-0xc28E4f6798c5ef47c6BCD54F7353EF0Ff59fCf06",
  "1-0xde838AEd5b25c956AdFE6A377DC056327D1Df19a",
  "1-0x19dBb3CB7F6AAa65c436246Fb22978b8D89206E2",
  "1-0xB2c5d104F481d0BEb056842bD5312BE6Fd831429",
  "1-0xb2D8385342eBbb6D92355FcEc0ccd409487B118F",
  "1-0xAb2F42FEd7F2C1aEd5CA8a20139313aBeA74790b",
  "1-0x75c240478F358F8a1a817F2a52fb84d61B9939fF",
  "1-0x032A6c903E588d9548875BEf3B23dAF912F4f7E4",
  "1-0xCde5d40F312b9BCf704BabcDb6713D2547a277C4",
  "1-0x16E5060779B75f2F9b748d0E1c0F89a13F35B2De",
  "1-0x8cd64380b991E6D67424B9aE30fd2048947d7FFE",
  "1-0x8460de55C1D491Fb0FDe1bd3e40c1319be4DceED",
  "1-0x3aC9e11B2fF50652340abAFA96CE984240060330",
  "1-0x8A05Bc1665059d5E19e30A66CF077f090F88609f",
  "1-0x42A094364bBdCa0eFac8AF2cF7d6B9ec885ee554",
  "1-0xbc15dDb819CE347f8A67b5485910B8a37911f283",
  "1-0xbafc759ca196e83900721d3b840dfbcd40e59617",
  "1-0xa259c4614d02d3a548de5c95d12fc71d296662ff",
  "1-0x94b78ebaf10fdb9d832860f2e2cd8ee52d39f751",
  "1-0x761c035187d3670dad9cdaeca7d5591d79268a13",
  "1-0xf354aaee4038071e213e0307e574c18f6722a57f",
  "1-0xdb99073c0a20d33bf1aed19f0876612b1dcf8438",
  "1-0x325845b0b12b479a0991ea3bac1249ca18254a4d",
];

const boycoAssets = boycoAssetIds.map((assetId) => {
  const id = assetId.toLowerCase();
  return {
    ...getSupportedToken(id),
    ids: [id],
  };
});

const minifiedFilterTokenSymbols = [
  "wBTC",
  "WETH",
  "USDT",
  "USDC",
  "USDe",
  "STONE",
];

export const AssetsFilter = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading } = useDistinctAssets();

  const [showAllTokens, setShowAllTokens] = useState(false);

  const tokens = useMemo(() => {
    let result: TypedArrayDistinctAsset[] = [];
    if (process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco") {
      result = boycoAssets;
    } else if (data) {
      result = (data as TypedArrayDistinctAsset[]).filter((token) => {
        const tag = process.env.NEXT_PUBLIC_FRONTEND_TAG ?? "default";

        if (tag === "dev" || tag === "testnet") {
          return true;
        } else {
          const isTestnetToken = token.ids.every((id) => {
            const [chain_id] = id.split("-");

            const chain = getSupportedChain(parseInt(chain_id));
            return chain?.testnet === true;
          });

          return !isTestnetToken;
        }
      });
    }

    if (!showAllTokens) {
      result = result.filter((token) => {
        return minifiedFilterTokenSymbols.includes(token.symbol);
      });
    }

    return result;
  }, [data, showAllTokens]);

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

  if (data && mounted) {
    return (
      <Fragment>
        <AnimatePresence mode="wait">
          <motion.div
            key={
              showAllTokens
                ? "assets-filter-expanded"
                : "assets-filter-collapsed"
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-wrap gap-2">
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
                          id: (token as any).id,
                          image: token.image,
                          symbol: token.symbol,
                          ids: token.ids,
                        }}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/**
         * Show/Hide All Tokens
         */}
        <button
          className="mt-1 flex flex-row justify-between text-sm font-light text-secondary"
          onClick={() => setShowAllTokens((prev) => !prev)}
        >
          {showAllTokens ? "View Less" : "View More"}
        </button>
      </Fragment>
    );
  }
};
