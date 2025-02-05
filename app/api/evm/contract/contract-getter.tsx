import type { Chain, Address, Abi as TypedAbi } from "viem";

import { createPublicClient, http } from "viem";
import { getSupportedChain } from "royco/utils";

import {
  getMetadata,
  getMetadataFromEtherscan,
  getMetadataReturnType,
} from "./abi-functions";
import { RPC_API_KEYS } from "@/components/constants";
import { isProxy } from "./proxy-checker";

export type getContractReturnType = Array<{
  id: string;
  chain_id: number;
  contract_address: Address;
  contract_name: string | null;
  abi: string;
  proxy_type?: string;
  implementation_id?: string;
}>;

export const getContract = async ({
  chain_id,
  contract_address,
}: {
  chain_id: number;
  contract_address: Address;
}): Promise<getContractReturnType> => {
  try {
    let contracts: getContractReturnType = [];
    let contract_metadata: getMetadataReturnType = null;
    let implementation_metadata: getMetadataReturnType = null;

    const chain = getSupportedChain(chain_id);

    if (!chain) {
      return [];
    }

    const client = createPublicClient({
      chain,
      transport: http(RPC_API_KEYS[chain_id], {
        fetchOptions: {
          headers: {
            Origin: "https://app.royco.org",
          },
        },
      }),
    });

    // Fetch from Sourcify
    contract_metadata = await getMetadata({
      chain_id,
      contract_address,
    });

    // If not on Sourcify, fetch from Etherscan
    if (contract_metadata === null) {
      contract_metadata = await getMetadataFromEtherscan({
        chain_id,
        contract_address,
      });
    }

    if (contract_metadata === null) {
      // If no metadata found, return empty array
      return [];
    } else {
      // If metadata found, add to contracts array
      // @ts-ignore
      contracts.push({
        id: `${chain_id}-${contract_address}`,
        chain_id,
        contract_address,
        ...contract_metadata,
      });
    }

    const implementation = await isProxy({
      client,
      contract_address,
    });

    if (implementation !== null && contracts.length > 0) {
      contracts[0].proxy_type = implementation.type;
      contracts[0].implementation_id = `${chain_id}-${implementation.address}`;

      // Fetch from Sourcify
      implementation_metadata = await getMetadata({
        chain_id,
        contract_address: implementation.address,
      });

      // If not on Sourcify, fetch from Etherscan
      implementation_metadata = await getMetadataFromEtherscan({
        chain_id,
        contract_address: implementation.address,
      });

      // If metadata found, add to contracts array
      if (implementation_metadata !== null) {
        // @ts-ignore
        contracts.push({
          id: `${chain_id}-${implementation.address}`,
          chain_id,
          contract_address: implementation.address,
          ...implementation_metadata,
        });
      }
    }

    return contracts;
  } catch (error) {
    console.log("error", error);

    return [];
  }
};
