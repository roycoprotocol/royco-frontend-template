import { OwnershipProofMessage } from "@/components/constants";
import { isSolidityAddressValid } from "royco/utils";
import { recoverMessageAddress } from "viem";

export const isWalletValid = async ({
  account_address,
  proof,
}: {
  account_address: string | null | undefined;
  proof: string | null | undefined;
}) => {
  try {
    if (!account_address || !proof) return false;

    if (!isSolidityAddressValid("address", account_address)) return false;

    const message_signer = await recoverMessageAddress({
      message: OwnershipProofMessage,
      signature: proof as `0x${string}`,
    });

    if (message_signer.toLowerCase() !== account_address.toLowerCase())
      return false;

    return true;
  } catch (err) {
    return false;
  }
};
