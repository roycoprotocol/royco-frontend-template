import { providers } from "ethers";
import { useMemo } from "react";
import type { Account, Chain, Client, Transport } from "viem";
import { type Config, useConnectorClient } from "wagmi";

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;

  const provider = new providers.Web3Provider(transport as any, {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  });

  const signer = provider.getSigner(account.address);

  // Use the ethers v5 _signTypedData method
  // @ts-ignore
  if (!signer.signTypedData) {
    // @ts-ignore
    signer.signTypedData = async function (domain, types, value) {
      return this._signTypedData(domain, types, value);
    };
  }

  return signer;
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({
    chainId,
  });

  const signer = useMemo(() => {
    return client ? clientToSigner(client) : undefined;
  }, [client]);

  return signer;
}
