import { providers } from "ethers";
import { PublicClient, HttpTransport, WalletClient } from "viem";
import logger from "./logger";
import { Signer, TypedDataSigner } from "@ethersproject/abstract-signer";

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  if (!chain) {
    logger.warn("No chain found in public client, stopping signature request.");
    return;
  }
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    );
  return new providers.JsonRpcProvider(transport.url, network);
}

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  if (!chain) {
    logger.warn("No chain found in public client, stopping signature request.");
    return;
  }
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account?.address);

  return signer as Signer & TypedDataSigner;
}
