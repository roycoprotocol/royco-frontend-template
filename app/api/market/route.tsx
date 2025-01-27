import { getSupportedChain, shortAddress } from "royco/utils";
import { createClient } from "@supabase/supabase-js";
import { http } from "@wagmi/core";
import { createPublicClient } from "viem";

import { getMarketIdFromEventLog } from "royco/market";
import { Octokit } from "@octokit/rest";
import validator from "validator";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

const SERVER_RPC_API_KEYS = {
  1: process.env.SERVER_RPC_1_1,
  11155111: process.env.SERVER_RPC_11155111_1,
  42161: process.env.SERVER_RPC_42161_1,
  8453: process.env.SERVER_RPC_8453_1,
  146: process.env.SERVER_RPC_146_1,
  80094: process.env.SERVER_RPC_80094_1,
  80000: process.env.SERVER_RPC_80000_1,
  21000000: process.env.SERVER_RPC_21000000_1,
  98865: process.env.SERVER_RPC_98865_1,
};

export const createCommitMessage = ({
  chainId,
  marketType,
  marketId,
}: {
  chainId: number;
  marketType: number;
  marketId: string;
}) => {
  return `feat(market-map): Update market -- ${chainId}_${marketType}_${marketId} -- ${marketType === 0 ? "Recipe" : "Vault"} (${shortAddress(marketId)})
  
Market Details:
- Chain ID: ${chainId}
- Market Type: ${marketType} (${marketType === 0 ? "Recipe" : "Vault"})
- Market ID: ${marketId} (${marketType === 0 ? "Market Hash" : "Wrapped Vault Address"})
- Request Timestamp: ${new Date().toUTCString()}`;
};

export const getBoycoMarket = ({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description: string;
}) => {
  return Buffer.from(
    `import { defineMarket } from "@/sdk/constants";

export default defineMarket({
  id: \`${id}\`,
  name: \`${name}\`,
  description: \`${description}\`,
  is_verified: false,
  category: \`boyco\`,
});`
  ).toString("base64");
};

export const getDefaultMarket = ({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description: string;
}) => {
  return Buffer.from(
    `import { defineMarket } from "@/sdk/constants";

export default defineMarket({
  id: \`${id}\`,
  name: \`${name}\`,
  description: \`${description}\`,
  is_verified: false,
});`
  ).toString("base64");
};

export const getContent = (marketData: any) => {
  const sanitizedName = validator.escape(validator.trim(marketData.name || ""));
  const sanitizedDescription = validator.escape(
    validator.trim(marketData.description || "")
  );

  if (process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco") {
    return getBoycoMarket({
      id: marketData.id,
      name: sanitizedName,
      description: sanitizedDescription,
    });
  } else {
    return getDefaultMarket({
      id: marketData.id,
      name: sanitizedName,
      description: sanitizedDescription,
    });
  }
};

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin") || "https://app.royco.org";
    const body = await request.json();
    const { chain_id, market_type, tx_hash, name, description, push } = body;

    const chain = getSupportedChain(chain_id);
    if (!chain) {
      return Response.json({ data: "Chain not found", status: false });
    }

    const viemClient = createPublicClient({
      chain,
      transport: http(
        SERVER_RPC_API_KEYS[chain_id as keyof typeof SERVER_RPC_API_KEYS],
        {
          fetchOptions: {
            headers: {
              Origin: origin,
            },
          },
        }
      ),
    });

    const receipt = await viemClient.getTransactionReceipt({
      hash: tx_hash as `0x${string}`,
    });

    if (!receipt) {
      return Response.json(
        { data: "Transaction not found", status: false },
        { status: 404 }
      );
    }

    // Get the logs from the transaction receipt
    const logs = receipt.logs;

    const { status, market_id } = getMarketIdFromEventLog({
      chain_id,
      market_type,
      logs,
    });

    if (status && market_id) {
      const id = `${chain_id}_${market_type}_${market_id}`;

      const row = {
        id,
        name,
        description,
        ...(process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco"
          ? { category: "boyco" }
          : {}),
      };

      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.SUPABASE_SERVICE_ROLE_KEY as string
      );

      const { data, error } = await client
        .from("market_userdata")
        .insert([row]);

      if (!error && push === true) {
        // Create file path
        const filePath = `sdk/constants/market-map/${chain_id}/definitions/${chain_id}_${market_type}_${market_id}.ts`;

        // Create octokit client
        const octokit = new Octokit({
          auth: process.env.ROYCO_SDK_GITHUB_TOKEN,
        });

        // Create a new branch name based on the market details
        const newBranchName = `market-map/${chain_id}_${market_type}_${market_id}_${Date.now()}`;

        // Get the main branch's latest commit SHA
        const mainRef = await octokit.git.getRef({
          owner: "roycoprotocol",
          repo: "royco-sdk",
          ref: "heads/main",
        });

        // Create a new branch from main
        await octokit.git.createRef({
          owner: "roycoprotocol",
          repo: "royco-sdk",
          ref: `refs/heads/${newBranchName}`,
          sha: mainRef.data.object.sha,
        });

        // Create market map content
        const content = getContent({
          id: id,
          name: name,
          description: description,
          is_verified: false,
          ...(process.env.NEXT_PUBLIC_FRONTEND_TAG === "boyco"
            ? { category: "boyco" }
            : {}),
        });

        // Create commit message
        const commitMessage = createCommitMessage({
          chainId: chain_id,
          marketType: market_type,
          marketId: market_id,
        });

        // Check if file exists and get its SHA if it does
        let fileSha;
        try {
          const fileContent = await octokit.repos.getContent({
            owner: "roycoprotocol",
            repo: "royco-sdk",
            path: filePath,
            ref: newBranchName,
          });

          if ("sha" in fileContent.data) {
            fileSha = fileContent.data.sha;
          }
        } catch (error: any) {
          // File doesn't exist, which is fine
          if (error.status !== 404) {
            throw error;
          }
        }

        if (fileSha) {
          throw new Error("Market File already exists");
        }

        // Create the file in the new branch
        await octokit.repos.createOrUpdateFileContents({
          owner: "roycoprotocol",
          repo: "royco-sdk",
          path: filePath,
          message: commitMessage,
          content,
          branch: newBranchName,
          ...(fileSha && { sha: fileSha }), // Include SHA only if file exists
        });

        // Create pull request
        const pr = await octokit.pulls.create({
          owner: "roycoprotocol",
          repo: "royco-sdk",
          title: `feat(market-map): Update market -- ${chain_id}_${market_type}_${market_id}`,
          head: newBranchName,
          base: "main",
          body: commitMessage,
        });

        // Auto-merge the pull request
        await octokit.pulls.merge({
          owner: "roycoprotocol",
          repo: "royco-sdk",
          pull_number: pr.data.number,
          merge_method: "squash",
        });

        // Delete the branch after merging
        await octokit.git.deleteRef({
          owner: "roycoprotocol",
          repo: "royco-sdk",
          ref: `heads/${newBranchName}`,
        });
      } else {
        console.log("Error in creating pull request", error);
      }

      return Response.json(
        {
          data: error ? "Insert Error" : "Insert Success",
          status: error ? false : true,
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        { data: "Market not found or invalid log", status: false },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error in creating market", error);
    return Response.json(
      {
        data: "Internal Server Error",
        // functions: [],
      },
      {
        status: 500,
      }
    );
  }
}
