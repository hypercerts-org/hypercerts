import { HypercertClient } from "@hypercerts-org/hypercerts-sdk";
import { hypercertsStorage } from "../lib/hypercerts-storage";
import { ethers } from "ethers";
import { useSigner } from "wagmi";
import { useEffect, useState } from "react";
import { DEFAULT_CHAIN_ID } from "../lib/config";

type ClientProps = {
  chainId: number;
  provider?: ethers.providers.Provider;
  rpcUrl?: string;
  signer?: ethers.Signer;
};

const storage = hypercertsStorage;

const defaultClient = new HypercertClient({
  config: {
    chainId: DEFAULT_CHAIN_ID,
  },
  storage,
});

export const useHypercertClient = () => {
  const [client, setClient] = useState<HypercertClient>(defaultClient);
  const { data: signer, isLoading } = useSigner();

  useEffect(() => {
    const loadClientFromSigner = async (signer: ethers.Signer) => {
      const config: ClientProps = {
        chainId: await signer.getChainId(),
        provider: signer.provider,
        signer,
      };

      const client = new HypercertClient({ config, storage });

      setClient(client);
    };

    if (signer) {
      loadClientFromSigner(signer);
    }

    if (!signer) {
      setClient(defaultClient);
    }
  }, [signer, isLoading]);

  return { client, isLoading };
};
