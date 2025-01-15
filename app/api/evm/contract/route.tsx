import { getContract } from "./contract-getter";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contracts } = body;

    let contracts_data = [];

    for (let i = 0; i < contracts.length; i++) {
      const contract = await getContract(contracts[i]);

      if (!!contract && contract.length > 0) {
        contracts_data.push(...contract);
      }
    }

    return Response.json(
      {
        data: contracts_data,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        data: [],
      },
      {
        status: 500,
      }
    );
  }
}
