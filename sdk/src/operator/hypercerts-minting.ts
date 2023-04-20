import { HypercertMinter } from "@hypercerts-org/hypercerts-protocol";
import { BigNumberish, ContractTransaction, ethers } from "ethers";
import { Result } from "true-myth";
import { err, ok } from "true-myth/result";

import { Config, getConfig } from "../config.js";
import { HypercertsSdkError, MintingError } from "../errors.js";
import { HypercertMetadata, HypercertMinterABI, HypercertsStorage, validateMetaData } from "../index.js";
import { handleError } from "../utils/errors.js";

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
  const { contractAddress } = _chainConfig;
  const _storage = new HypercertsStorage({});

  const _provider = provider ?? ethers.getDefaultProvider(chainConfig.chainName);

  const contract = <HypercertMinter>new ethers.Contract(contractAddress, HypercertMinterABI, _provider);

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
  ): Promise<ContractTransaction> => {
    // validate metadata
    const validation = validateMetaData(claimData);
    if (validation.isErr) {
      handleError(validation.error);
      throw validation.error;
    }
    // store metadata on IPFS
    const cid = await _storage.storeMetadata(claimData);
    if (cid.isErr) {
      handleError(cid.error);
      throw cid.error;
    }

    return await contract.mintClaim(address, totalUnits, cid.value, transferRestriction);
  };

  return {
    contract,
    mintHypercert,
    transferRestrictions: TransferRestrictions,
  };
};

export default HypercertMinting;
