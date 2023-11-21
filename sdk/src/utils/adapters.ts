import { providers } from "ethers";
import { PublicClient, HttpTransport, WalletClient } from "viem";
import logger from "./logger";
import { Signer, TypedDataSigner } from "@ethersproject/abstract-signer";

/**
 * This function converts a `PublicClient` instance to an ethers.js `Provider` to faciliate compatibility between ethers and viem.
 *
 * It extracts the chain and transport from the `PublicClient` and creates a network object.
 * If no chain is found in the `PublicClient`, it logs a warning and stops the signature request.
 * If the transport type is "fallback", it creates a `FallbackProvider` with multiple transports.
 * Otherwise, it creates a `JsonRpcProvider` with a single transport.
 *
 * Ref: https://viem.sh/docs/ethers-migration.html
 *
 * @param publicClient - The `PublicClient` instance to convert.
 * @returns An ethers.js `Provider` instance, or `undefined` if no chain is found in the `PublicClient`.
 */
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

/**
 * This function converts a `WalletClient` instance to an ethers.js `Signer` to faciliate compatibility between ethers and viem.
 *
 * It extracts the account, chain, and transport from the `WalletClient` and creates a network object.
 * If no chain is found in the `WalletClient`, it logs a warning and stops the signature request.
 * It then creates a `Web3Provider` with the transport and network, and gets a `Signer` from the provider using the account's address.
 *
 * Ref: https://viem.sh/docs/ethers-migration.html
 *
 * @param walletClient - The `WalletClient` instance to convert.
 * @returns An ethers.js `Signer` instance, or `undefined` if no chain is found in the `WalletClient`.
 */
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
