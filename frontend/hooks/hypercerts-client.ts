import { HypercertClient } from "@hypercerts-org/sdk";

import { ethers } from "ethers";
import { Chain, useNetwork, useProvider, useSigner } from "wagmi";
import { useEffect, useState } from "react";
import {
  DEFAULT_CHAIN_ID,
  NFT_STORAGE_TOKEN,
  WEB3_STORAGE_TOKEN,
} from "../lib/config";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { FetchSignerResult } from "@wagmi/core";

type ClientProps = {
  chainId: number;
  provider?: ethers.providers.Provider;
  rpcUrl?: string;
  signer?: ethers.Signer & TypedDataSigner;
};

const defaultClient = new HypercertClient({
  chainId: DEFAULT_CHAIN_ID,
  nftStorageToken: NFT_STORAGE_TOKEN,
  web3StorageToken: WEB3_STORAGE_TOKEN,
});

export const useHypercertClient = () => {
  const [client, setClient] = useState<HypercertClient>(defaultClient);
  const { data: signer, isLoading } = useSigner();
  const { chain } = useNetwork();
  const provider = useProvider();

  useEffect(() => {
    const loadClient = async (
      signer?: FetchSignerResult<ethers.Signer> | undefined,
      chain?: Chain,
      provider?: ethers.providers.Provider,
    ) => {
      if (signer && chain && provider) {
        const config: ClientProps = {
          chainId: chain.id,
          provider: provider || signer.provider,
          signer: signer as ethers.Signer & TypedDataSigner,
        };

        const client = new HypercertClient(config);

        setClient(client);
      }

      if (!signer && chain && provider) {
        const config: ClientProps = {
          chainId: chain.id,
          provider: provider,
        };

        const client = new HypercertClient(config);

        setClient(client);
      }

      if (!signer && !provider && chain) {
        const config: ClientProps = {
          chainId: chain.id,
        };

        const client = new HypercertClient(config);

        setClient(client);
      }
    };

    loadClient(signer, chain, provider);
  }, [chain, provider, signer, isLoading]);

  return { client, isLoading };
};
