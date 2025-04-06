import { BrowserProvider } from "ethers";
import { useEffect, useState } from "react";
import type { Account, Chain, Client, Transport } from "viem";
import { type Config, useConnectorClient } from "wagmi";

async function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;

  const provider = new BrowserProvider(transport as any, {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  });

  const signer = await provider.getSigner(account.address);

  return signer;
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({
    chainId,
  });

  const [signer, setSigner] = useState<any>(undefined);

  useEffect(() => {
    (async () => {
      if (client) {
        const signer = await clientToSigner(client);
        setSigner(signer);
      } else {
        setSigner(undefined);
      }
    })();
  }, [client]);

  return signer;
}
