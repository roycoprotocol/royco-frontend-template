import type { Abi as TypedAbi, Address } from "viem";

import { Abi } from "abitype/zod";
import { ETHERSCAN_API_KEYS } from "./rpc-constants";

export type getMetadataReturnType = {
  contract_name: string;
  abi: TypedAbi;
} | null;

export const getMetadata = async ({
  chain_id,
  contract_address,
}: {
  chain_id: number;
  contract_address: Address;
}): Promise<getMetadataReturnType> => {
  try {
    const res = await fetch(
      `https://sourcify.dev/server/files/tree/any/${chain_id}/${contract_address}`
    );

    const data = await res.json();

    const metadata_url = data.files.find((file: string) =>
      file.endsWith("metadata.json")
    );

    const metadata_res = await fetch(metadata_url);
    const metadata = await metadata_res.json();

    try {
      const contract_names = metadata.settings.compilationTarget;
      const contract_name = Object.values(contract_names).join(", ");

      const abi = Abi.parse(metadata.output.abi);

      return {
        contract_name,
        abi,
      };
    } catch (error) {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getMetadataFromEtherscan = async ({
  chain_id,
  contract_address,
}: {
  chain_id: number;
  contract_address: Address;
}): Promise<getMetadataReturnType> => {
  try {
    const ETHERSCAN_API_KEY = ETHERSCAN_API_KEYS[chain_id];

    const res = await fetch(
      `${ETHERSCAN_API_KEY}&module=contract&action=getsourcecode&address=${contract_address}`
    );

    const data = await res.json();

    const contract_name = data.result[0].ContractName;

    if (contract_name === "MetaMultiSigWallet") {
      return null;
    }

    const abi = Abi.parse(JSON.parse(data.result[0].ABI));

    return {
      contract_name,
      abi,
    };
  } catch (error) {
    console.log("error", error);
    return null;
  }
};
