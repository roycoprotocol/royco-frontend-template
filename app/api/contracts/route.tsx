import { ContractMap } from "royco/contracts";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chain_id = searchParams.get("chain_id");
    const contract_id = searchParams.get("contract_id");
    const key = searchParams.get("key");

    let data = null;

    if (chain_id === null || contract_id === null) {
      throw new Error("Params not found");
    }

    const contracts =
      ContractMap[parseInt(chain_id) as keyof typeof ContractMap] ?? undefined;

    if (contracts === undefined) {
      throw new Error("Contracts not found");
    }

    const contract =
      contracts[contract_id as keyof typeof contracts] ?? undefined;

    if (contract === undefined) {
      throw new Error("Contract not found");
    }

    if (key !== null) {
      data = contract[key as keyof typeof contract] ?? null;
    } else {
      data = contract;
    }

    if (key !== null) {
      return new Response(
        typeof data === "object" ? JSON.stringify(data) : String(data),
        {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        }
      );
    } else {
      return Response.json(
        {
          data: data,
          message: "Success",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error: any) {
    return Response.json(
      {
        data: null,
        message: error.message ?? "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}
