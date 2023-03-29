import { NFT_STORAGE_TOKEN, WEB3_STORAGE_TOKEN } from "./config";
import { HypercertsStorage } from "@hypercerts-org/hypercerts-sdk";

export const hypercertsStorage = new HypercertsStorage({
  nftStorageToken: NFT_STORAGE_TOKEN,
  web3StorageToken: WEB3_STORAGE_TOKEN,
});
