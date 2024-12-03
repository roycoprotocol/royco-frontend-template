import { BaseChains, SupportedChainlist } from "royco/constants";

export const useBaseChains = () => {
  const data = SupportedChainlist.sort((a, b) => a.name.localeCompare(b.name));

  return { data };
};
