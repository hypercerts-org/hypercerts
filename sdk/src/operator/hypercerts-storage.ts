// @ts-ignore
import { NFTStorage, CIDString } from "nft.storage";
// @ts-ignore
import { Web3Storage } from "web3.storage";
import {
  defaultNftStorageClient,
  defaultWeb3StorageClient,
  storeMetadata,
  getMetadata,
  storeData,
  getData,
} from "./index.js";
import { HypercertMetadata } from "../types/metadata.js";

export interface HypercertsStorageConfig {
  nftStorageToken?: string;
  web3StorageToken?: string;
}

export class HypercertsStorage {
  private nftStorageClient: NFTStorage;
  private web3StorageClient: Web3Storage;

  constructor(private config: HypercertsStorageConfig) {
    this.nftStorageClient = config.nftStorageToken
      ? new NFTStorage({ token: config.nftStorageToken })
      : defaultNftStorageClient;
    this.web3StorageClient = config.web3StorageToken
      ? new Web3Storage({ token: config.web3StorageToken })
      : defaultWeb3StorageClient;
  }

  public async storeMetadata(data: HypercertMetadata): Promise<CIDString> {
    return await storeMetadata(data, this.nftStorageClient);
  }

  public async getMetadata(cidOrIpfsUri: string): Promise<HypercertMetadata> {
    return await getMetadata(cidOrIpfsUri);
  }

  public async storeData(data: any): Promise<CIDString> {
    return await storeData(data, this.web3StorageClient);
  }

  public async getData(cidOrIpfsUri: string): Promise<any> {
    return await getData(cidOrIpfsUri, this.web3StorageClient);
  }
}
