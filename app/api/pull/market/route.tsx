import { getSupportedChain, shortAddress } from "royco/utils";
import { Octokit } from "@octokit/rest";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

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

export const checkMarketFileExists = async (
  octokit: Octokit,
  filePath: string
) => {
  try {
    await octokit.repos.getContent({
      owner: "roycoprotocol",
      repo: "royco-sdk",
      path: filePath,
      ref: "main",
    });
    return true;
  } catch (error: any) {
    if (error.status === 404) {
      return false;
    }
    throw error;
  }
};

export const getContent = (marketData: any) => {
  return Buffer.from(
    `import { defineMarket } from "royco/constants";

export default defineMarket({
  id: "${marketData.id}",
  name: "${marketData.name}",
  description: "${marketData.description}",
  is_verified: ${marketData.is_verified},
});`
  ).toString("base64");
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { chain_id, market_type, market_id } = body;

    // Check if chain id is provided
    if (!chain_id) {
      console.log("Chain ID is required");
      return Response.json({ status: "Chain ID is required" }, { status: 400 });
    }

    // Check if chain id is a number
    if (typeof chain_id !== "number") {
      console.log("Chain ID must be a number");
      return Response.json(
        { status: "Chain ID must be a number" },
        { status: 400 }
      );
    }

    // Check if chain is supported
    const chain = getSupportedChain(chain_id);
    if (!chain) {
      console.log("Unsupported chain");
      return Response.json({ status: "Unsupported chain" }, { status: 400 });
    }

    // Check if market type is provided
    if (market_type === undefined || market_type === null) {
      console.log("Market type is required");
      return Response.json(
        { status: "Market type is required" },
        { status: 400 }
      );
    }

    // Check if market type is a number
    if (typeof market_type !== "number") {
      console.log("Market type must be a number");
      return Response.json(
        { status: "Market type must be a number" },
        { status: 400 }
      );
    }

    // Check if market type is valid
    if (market_type !== 0 && market_type !== 1) {
      console.log(
        "Market type must be 0 or 1, where 0 represents a recipe market and 1 represents a vault market"
      );
      return Response.json(
        {
          status:
            "Market type must be 0 or 1, where 0 represents a recipe market and 1 represents a vault market",
        },
        { status: 400 }
      );
    }

    // Check if market id is provided
    if (!market_id) {
      console.log("Market ID is required");
      return Response.json(
        { status: "Market ID is required" },
        { status: 400 }
      );
    }

    // Check if market id is a string
    if (typeof market_id !== "string") {
      console.log("Market ID must be a string");
      return Response.json(
        { status: "Market ID must be a string" },
        { status: 400 }
      );
    }

    // Create file path
    const filePath = `sdk/constants/market-map/${chain_id}/definitions/${chain_id}_${market_type}_${market_id}.ts`;

    // Create octokit client
    const octokit = new Octokit({
      auth: process.env.PERSONAL_ACCESS_GITHUB_TOKEN,
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

    // Create empty JSON content
    const content = getContent({
      id: market_id,
      name: "",
      description: "",
      is_verified: false,
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

    return Response.json(
      {
        status: "Success",
        data: {
          chainId: chain_id,
          marketType: market_type,
          marketId: market_id,
          branch: newBranchName,
          filePath: filePath,
          fileUrl: `https://github.com/roycoprotocol/royco-sdk/tree/${newBranchName}/${filePath}`,
          marketUrl: `/market/${chain_id}/${market_type}/${market_id}`,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in route", error);
    return Response.json({ status: "Internal Server Error" }, { status: 500 });
  }
}
