import { createClient } from "@supabase/supabase-js";
import { http } from "@wagmi/core";
import { Address } from "abitype";
import { getSupportedChain } from "royco/utils";
import { createPublicClient, erc4626Abi } from "viem";
import { RPC_API_KEYS } from "@/components/constants";
import { BigNumber } from "ethers";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

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
      .lt("retries", 20)
      .lt("last_updated", new Date(Date.now() - 60 * 1000).toISOString())
      .order("last_updated", { ascending: true })
      .limit(20);

    if (error) throw error;

    // 2. Process all vaults in parallel
    await Promise.all(
      (vaults || []).map(async (vault) => {
        try {
          const chain = getSupportedChain(Number(vault.chain_id));
          if (!chain) throw new Error("Chain not found");
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

          // Modified comparison logic using BigNumber for all comparisons
          const timestampDiff = BigNumber.from(blockTimestamp).sub(
            BigNumber.from(vault.curr_block_timestamp || "0")
          );
          const isTimestampStale = timestampDiff.gt(
            BigNumber.from(24 * 60 * 60)
          );
          const hasValuesChanged =
            !BigNumber.from(totalAssets).eq(
              BigNumber.from(vault.curr_total_assets || "0")
            ) ||
            !BigNumber.from(totalSupply).eq(
              BigNumber.from(vault.curr_total_supply || "0")
            );

          // If values haven't changed and timestamp is fresh, just update last_updated
          if (!hasValuesChanged && !isTimestampStale) {
            await client
              .from("raw_underlying_vaults")
              .update({
                last_updated: new Date().toISOString(),
                retries: 0,
              })
              .eq("chain_id", vault.chain_id)
              .eq("underlying_vault_address", vault.underlying_vault_address);
          } else {
            // Proceed with full update
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
          }
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
