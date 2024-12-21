import { YieldBreakdown } from "@/components/composables";
import { cn } from "@/lib/utils";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";

const Page = () => {
  const yield_breakdown = [
    {
      id: "1-0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f",
      chain_id: 1,
      contract_address: "0x40d16fc0246ad3160ccc09b8d0d3a2cd28ae6c2f",
      name: "GHO",
      symbol: "GHO",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/23508.png",
      decimals: 18,
      source: "coinmarketcap",
      search_id: "23508",
      type: "token",
      category: "base",
      label: "Royco Yield",
      annual_change_ratio: 0.0507548485075012,
      total_supply: 1333499,
      fdv: 1331221.52,
      price: 0.998292102390381,
      allocation: 0.0507548485075012,
    },
    {
      id: "1-0x1a88df1cfe15af22b3c4c783d4e6f7f9e0c1885d",
      chain_id: 1,
      contract_address: "0x1a88df1cfe15af22b3c4c783d4e6f7f9e0c1885d",
      name: "Aave stkGHO",
      symbol: "stkGHO",
      image:
        "https://coin-images.coingecko.com/coins/images/34849/large/stkgho.png?1706260099",
      decimals: 18,
      source: "coingecko",
      search_id: "aave-stkgho",
      type: "point",
      category: "base",
      label: "Native Vault Incentives",
      annual_change_ratio: 0.11566534391794142,
      allocation: 0.11566534391794142,
    },
    {
      id: "1-0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
      chain_id: 1,
      contract_address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
      name: "Aave",
      symbol: "AAVE",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png",
      decimals: 18,
      source: "coinmarketcap",
      search_id: "7278",
      type: "token",
      category: "native",
      label: "Aave Merit Rewards Incentives",
      annual_change_ratio: 0.1192,
    },
  ];

  return (
    <div className="flex w-full flex-col place-content-center items-center gap-4 p-5">
      <HoverCard open={true}>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent className="w-64">
          <YieldBreakdown
            // @ts-ignore
            breakdown={yield_breakdown}
            base_key="1_0_0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b"
          />
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default Page;
