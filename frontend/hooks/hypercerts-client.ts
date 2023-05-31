import {
  DEFAULT_CHAIN_ID,
  NFT_STORAGE_TOKEN,
  WEB3_STORAGE_TOKEN,
} from "../lib/config";
import { HypercertClient } from "@hypercerts-org/sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, Connector } from "wagmi";

const defaultClient = new HypercertClient({
  chainId: DEFAULT_CHAIN_ID,
  nftStorageToken: NFT_STORAGE_TOKEN,
  web3StorageToken: WEB3_STORAGE_TOKEN,
});

export const useHypercertClient = () => {
  const [client, setClient] = useState<HypercertClient>(defaultClient);
  const [isLoading, setIsLoading] = useState(false);
  const { connector } = useAccount();

  useEffect(() => {
    const loadClient = async (connector: Connector) => {
      setIsLoading(true);

      const { signer, provider } = await connector
        .getProvider()
        .then((provider) => {
          const _provider = new ethers.providers.Web3Provider(provider);
          const signer = _provider.getSigner();
          return { provider: _provider, signer };
        });

      const chainId = await connector.getChainId();

      if (chainId) {
        const client = new HypercertClient({
          chainId,
          provider,
          signer,
        });
        setClient(client);
      }

      setIsLoading(false);
    };

    if (connector) {
      loadClient(connector);
    }
  }, [connector]);

  return { client, isLoading };
};
