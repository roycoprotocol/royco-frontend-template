import { createClient } from "@supabase/supabase-js";
import { http, createConfig, multicall } from "@wagmi/core";
import {
  baseSepolia,
  base,
  arbitrumSepolia,
  mainnet,
  sepolia,
  arbitrum,
} from "@wagmi/core/chains";
import { Address } from "abitype";
import { getChain } from "@/sdk/utils";
import { ContractMap } from "@/sdk/contracts";
import {
  encodeFunctionData,
  createPublicClient,
  Chain,
  erc4626Abi,
} from "viem";
import { RPC_API_KEYS } from "@/components/constants";
import { BigNumber } from "ethers";
import { NULL_ADDRESS } from "@/sdk/constants";
import { erc20Abi } from "viem";

export const dynamic = true;

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [sepolia.id]: http(RPC_API_KEYS[sepolia.id]),
    [mainnet.id]: http(RPC_API_KEYS[mainnet.id]),
    [arbitrumSepolia.id]: http(RPC_API_KEYS[arbitrumSepolia.id]),
    [arbitrum.id]: http(RPC_API_KEYS[arbitrum.id]),
    [baseSepolia.id]: http(RPC_API_KEYS[baseSepolia.id]),
    [base.id]: http(RPC_API_KEYS[base.id]),
  },
});

export async function POST(request: Request) {
  try {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );

    // 1. Fetch first 20 rows with conditions
    const { data: vaults, error } = await client
      .from("raw_underlying_vaults")
      .select("*")
      .lt("retries", 100)
      .lt("last_updated", new Date(Date.now() - 60 * 1000).toISOString())
      .order("last_updated", { ascending: true })
      .limit(20);

    if (error) throw error;

    // 2. Process all vaults in parallel
    await Promise.all(
      (vaults || []).map(async (vault) => {
        try {
          const chain = getChain(Number(vault.chain_id));
          const publicClient = createPublicClient({
            chain,
            transport: http(RPC_API_KEYS[chain.id]),
          });

          // Run multicall and getBlock in parallel
          const [multicallResult, block] = await Promise.all([
            publicClient.multicall({
              contracts: [
                {
                  address: vault.underlying_vault_address as Address,
                  abi: erc4626Abi,
                  functionName: "totalAssets",
                },
                {
                  address: vault.underlying_vault_address as Address,
                  abi: erc4626Abi,
                  functionName: "totalSupply",
                },
              ],
            }),
            publicClient.getBlock(),
          ]);

          const blockTimestamp = block.timestamp.toString();
          const [totalAssets, totalSupply] = multicallResult.map(
            (r) => r.result?.toString() || "0"
          );

          // 3. Update
          await client
            .from("raw_underlying_vaults")
            .update({
              prev_total_assets: vault.curr_total_assets,
              prev_total_supply: vault.curr_total_supply,
              prev_block_timestamp: vault.curr_block_timestamp,
              curr_total_assets: totalAssets,
              curr_total_supply: totalSupply,
              curr_block_timestamp: blockTimestamp,
              last_updated: new Date().toISOString(),
              retries: 0,
            })
            .eq("chain_id", vault.chain_id)
            .eq("underlying_vault_address", vault.underlying_vault_address);
        } catch (error) {
          // 4. Increment retries on error
          await client
            .from("raw_underlying_vaults")
            .update({
              retries: (vault.retries || 0) + 1,
              last_updated: new Date().toISOString(),
            })
            .eq("chain_id", vault.chain_id)
            .eq("underlying_vault_address", vault.underlying_vault_address);
        }
      })
    );

    return Response.json({ status: "Success" }, { status: 200 });
  } catch (error) {
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
