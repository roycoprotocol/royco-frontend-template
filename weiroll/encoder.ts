import { RecipeAction } from "@/store/recipe";
import { Planner, Contract as WeirollContract } from "./planner";
import { Contract as EthersContract } from "@ethersproject/contracts";
import { Abi } from "abitype";

export const encode = ({
  recipeActions,
}: {
  recipeActions: RecipeAction[];
}) => {
  try {
    const planner = new Planner();

    let actionResults: any[] = new Array(recipeActions.length).fill(0);

    for (const action of recipeActions) {
      const ethersContract = new EthersContract(action.address, [action]);

      const contract = WeirollContract.createContract(
        ethersContract,
        action.callType
      );
    }
  } catch (error) {}
};
