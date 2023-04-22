import { HypercertMinter } from "@hypercerts-org/hypercerts-protocol";
import { BigNumberish, ContractTransaction, ethers } from "ethers";

import { Config, getConfig } from "../config.js";
import { MalformedDataError } from "../errors.js";
import { HypercertMetadata, HypercertMinterABI, HypercertsStorage, validateMetaData } from "../index.js";
import { TransferRestrictions } from "src/client.js";

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
    transferRestriction: TransferRestrictions,
  ) => Promise<ContractTransaction>;
  transferRestrictions: { AllowAll: 0; DisallowAll: 1; FromCreatorOnly: 2 };
};

const HypercertMinting = ({ provider, chainConfig }: HypercertsMinterProps): HypercertsMinterType => {
  const _chainConfig = getConfig(chainConfig);
  const { contractAddress } = _chainConfig;
  const _storage = new HypercertsStorage({});

  const _provider = provider ?? ethers.getDefaultProvider(chainConfig.chainName);

  const contract = <HypercertMinter>new ethers.Contract(contractAddress, HypercertMinterABI, _provider);

  const mintHypercert = async (
    address: string,
    claimData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: TransferRestrictions,
  ) => {
    // validate metadata
    const { valid, errors } = validateMetaData(claimData);
    if (!valid && Object.keys(errors).length > 0) {
      throw new MalformedDataError("Metadata validation failed", errors);
    }

    // store metadata on IPFS
    const cid = await _storage.storeMetadata(claimData);

    return contract.mintClaim(address, totalUnits, cid, transferRestriction);
  };

  return {
    contract,
    mintHypercert,
    transferRestrictions: TransferRestrictions,
  };
};

export default HypercertMinting;
