import { HypercertMinter } from "@hypercerts-org/hypercerts-protocol";
import { BigNumberish, ContractTransaction, ethers } from "ethers";

import { Config, getConfig } from "../config.js";
import { HypercertMetadata, HypercertMinterABI, HypercertsStorage, validateMetaData } from "../index.js";

type HypercertsMinterProps = {
  provider?: ethers.providers.BaseProvider;
  chainConfig: Partial<Config>;
};

type HypercertsMinterType = {
  contract: HypercertMinter;
  mintHypercert: (
    address: string,
    claimData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: BigNumberish,
  ) => Promise<ContractTransaction>;
  transferRestrictions: { AllowAll: 0; DisallowAll: 1; FromCreatorOnly: 2 };
};

const HypercertMinting = ({ provider, chainConfig }: HypercertsMinterProps): HypercertsMinterType => {
  const _chainConfig = getConfig(chainConfig);
  const _storage = new HypercertsStorage({});

  const _provider = provider !== undefined ? provider : ethers.getDefaultProvider(chainConfig.chainName);

  const contract = <HypercertMinter>new ethers.Contract(_chainConfig.contractAddress, HypercertMinterABI, _provider);

  const TransferRestrictions = {
    AllowAll: 0,
    DisallowAll: 1,
    FromCreatorOnly: 2,
  } as const;

  const mintHypercert = async (
    address: string,
    claimData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: BigNumberish,
  ) => {
    // validate metadata
    const validation = validateMetaData(claimData);
    if (!validation.valid || Object.keys(validation.errors).length > 0) {
      throw new Error(`Error(s) validating metadata: ${validation.errors}`);
    }
    // store metadata on IPFS
    const cid = await _storage.storeMetadata(claimData);

    // mint hypercert token
    return await contract.mintClaim(address, totalUnits, cid, transferRestriction);
  };

  return {
    contract,
    mintHypercert,
    transferRestrictions: TransferRestrictions,
  };
};

export default HypercertMinting;
