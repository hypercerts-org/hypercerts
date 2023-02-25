import { storeMetadata, getMetadata, storeData, getData } from "./index.js";
import { HypercertMetadata } from "../types/metadata.js";

export class HypercertsStorage {
  public async storeMetadata(data: HypercertMetadata) {
    return storeMetadata(data);
  }

  public async getMetadata(cidOrIpfsUri: string) {
    return getMetadata(cidOrIpfsUri);
  }

  public async storeData(data: any) {
    return storeData(data);
  }

  public async getData(cidOrIpfsUri: string) {
    return getData(cidOrIpfsUri);
  }
}
