import { HypercertMinter } from "@hypercerts-org/contracts";
import { BigNumberish, ContractTransaction, ethers } from "ethers";

import { HypercertMetadata, HypercertMinterABI, HypercertsStorage, validateMetaData } from "../index.js";
import { HypercertClientConfig } from "../types/client.js";
import { MalformedDataError } from "../types/errors.js";
import { TransferRestrictions } from "../types/hypercerts.js";
import { getConfig } from "../utils/config.js";

/**
 * @deprecated Refactored this type into the client interface
 */
type HypercertsMinterProps = {
  provider?: ethers.providers.BaseProvider;
  chainConfig: Partial<HypercertClientConfig>;
};

/**
 * @deprecated Refactored this type into the client interface
 */
type HypercertsMinterType = {
  contract: HypercertMinter;
  mintHypercert: (
    address: string,
    claimData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: TransferRestrictions,
  ) => Promise<ContractTransaction>;
  transferRestrictions: {
    AllowAll: 0;
    DisallowAll: 1;
    FromCreatorOnly: 2;
  };
};

/**
 * @deprecated Refactored this funtionality into the client
 */
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
    transferRestrictions: {
      AllowAll: 0,
      DisallowAll: 1,
      FromCreatorOnly: 2,
    },
  };
};

export default HypercertMinting;
