import { isAbiValid } from "royco/utils";
import { getContract } from "./contract-getter";
import { Abi } from "abitype";
import { toFunctionHash } from "viem";

export const dynamic = true;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contracts } = body;

    let contracts_data = [];
    let function_data = [];

    for (let i = 0; i < contracts.length; i++) {
      const contract = await getContract(contracts[i]);

      if (!!contract && contract.length > 0) {
        // for (let j = 0; j < contract.length; j++) {
        //   const currContract = contract[j];

        //   const abi: Abi = JSON.parse(JSON.stringify(currContract.abi));
        //   const functions = abi.filter((item) => item.type === "function");
        //   const currFunctions = functions.map((item) => {
        //     return {
        //       id: currContract.id,
        //       function_hash: toFunctionHash(item),
        //       function_name: item.name,
        //     };
        //   });

        //   function_data.push(...currFunctions);
        // }

        contracts_data.push(...contract);
      }
    }

    return Response.json(
      {
        data: contracts_data,
        // functions: function_data,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        data: [],
        // functions: [],
      },
      {
        status: 500,
      }
    );
  }
}
