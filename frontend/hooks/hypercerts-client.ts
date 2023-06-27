import React, { useEffect, useMemo } from "react";

import {
  DEFAULT_CHAIN_ID,
  NFT_STORAGE_TOKEN,
  WEB3_STORAGE_TOKEN,
} from "../lib/config";
import { HypercertClient } from "@hypercerts-org/sdk";
import { type WalletClient, useWalletClient, useNetwork } from "wagmi";

import { providers } from "ethers";

const defaultClient = new HypercertClient({
  chainId: DEFAULT_CHAIN_ID,
  nftStorageToken: NFT_STORAGE_TOKEN,
  web3StorageToken: WEB3_STORAGE_TOKEN,
});

const walletClientToSigner = (walletClient: WalletClient) => {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
};

const useEthersSigner = ({ chainId }: { chainId?: number } = {}) => {
  const { data: walletClient } = useWalletClient({ chainId });
  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient],
  );
};

export const useHypercertClient = () => {
  const { chain } = useNetwork();
  const signer = useEthersSigner({ chainId: chain?.id });

  const [client, setClient] = React.useState<HypercertClient>(defaultClient);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (chain?.id && signer) {
      setIsLoading(true);
      setClient(
        new HypercertClient({
          chainId: chain.id,
          signer,
        }),
      );
      setIsLoading(false);
    }
  }, [chain?.id, signer]);

  return { client, isLoading };
};
