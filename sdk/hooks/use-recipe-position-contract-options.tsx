import { SupportedToken } from "../constants";
import { ContractMap } from "../contracts";
import { RoycoMarketType } from "../market";
import { EnrichedPositionsRecipeDataType } from "../queries";
import { TransactionOptionsType } from "../types";

export const getRecipeForfeitTransactionOptions = ({
  position,
}: {
  position: EnrichedPositionsRecipeDataType;
}) => {
  // Get contract address and ABI
  const address =
    ContractMap[position.chain_id as keyof typeof ContractMap][
      "RecipeMarketHub"
    ].address;
  const abi =
    ContractMap[position.chain_id as keyof typeof ContractMap][
      "RecipeMarketHub"
    ].abi;

  // Get transaction options
  const txOptions: TransactionOptionsType = {
    contractId: "RecipeMarketHub",
    chainId: position.chain_id ?? 0,
    id: "forfeit",
    label: "Forfeit Position",
    address,
    abi,
    functionName: "forfeit",
    marketType: RoycoMarketType.recipe.id,
    args: [position.weiroll_wallet, true], // @note: by default, we are executing the withdrawal script upon forfeiting
    txStatus: "idle",
    txHash: null,
  };

  return txOptions;
};
