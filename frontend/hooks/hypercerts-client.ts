import {
  DEFAULT_CHAIN_ID,
  NFT_STORAGE_TOKEN,
  WEB3_STORAGE_TOKEN,
} from "../lib/config";
import { HypercertClient } from "@hypercerts-org/sdk";
import { useEffect, useState } from "react";
import { type WalletClient, useWalletClient, useNetwork } from "wagmi";
import { getWalletClient } from "@wagmi/core";

const defaultClient = new HypercertClient({
  chainId: DEFAULT_CHAIN_ID,
  nftStorageToken: NFT_STORAGE_TOKEN,
  web3StorageToken: WEB3_STORAGE_TOKEN,
});

import { type PublicClient, getPublicClient } from "@wagmi/core";
import { providers } from "ethers";
import { type HttpTransport } from "viem";
import { Chain } from "wagmi";

const publicClientToProvider = (publicClient: PublicClient) => {
  const { chain, transport } = publicClient;
  // const network = {
  //   chainId: chain.id,
  //   name: chain.name,
  //   ensAddress: chain.contracts?.ensRegistry?.address,
  // };
  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, "any"),
      ),
    );
  return new providers.JsonRpcProvider(transport.url, "any");
};

/** Action to convert a viem Public Client to an ethers.js Provider. */
const getEthersProvider = ({ chainId }: { chainId?: number } = {}) => {
  const publicClient = getPublicClient({ chainId });
  return publicClientToProvider(publicClient);
};

const walletClientToSigner = (walletClient: WalletClient) => {
  const { account, chain, transport } = walletClient;
  if (!chain) return undefined;
  // const network = {
  //   chainId: chain.id,
  //   name: chain.name,
  //   ensAddress: chain.contracts?.ensRegistry?.address,
  // };
  const provider = new providers.Web3Provider(transport, "any");
  const signer = provider.getSigner(account.address);
  return signer;
};

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
const getEthersSigner = async ({ chainId }: { chainId?: number } = {}) => {
  const walletClient = await getWalletClient({ chainId });
  if (!walletClient) return undefined;
  return walletClientToSigner(walletClient);
};

export const useHypercertClient = () => {
  const [client, setClient] = useState<HypercertClient>(defaultClient);
  const [isLoading, setIsLoading] = useState(false);
  const { chain } = useNetwork();

  useEffect(() => {
    const loadClient = async (chain: Chain) => {
      setIsLoading(true);

      const provider = getEthersProvider();
      const signer = await getEthersSigner();
      const chainId = chain?.id;

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

    if (chain) {
      loadClient(chain);
    }
  }, [chain]);

  return { client, isLoading };
};
