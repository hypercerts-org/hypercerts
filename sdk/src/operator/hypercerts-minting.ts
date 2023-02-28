import { BigNumberish, ContractTransaction, ethers } from "ethers";
import { HypercertMinterABI, HypercertMinter } from "@hypercerts-org/hypercerts-protocol";
import { ChainConfig, getChainConfig } from "src/constants.js";
import { HypercertMetadata, HypercertsStorage, validateMetaData } from "src/index.js";

type HypercertsMinterProps = {
  provider: ethers.providers.BaseProvider;
  chainConfig: Partial<ChainConfig>;
};

type HypercertsMinterType = {
  contract: HypercertMinter;
  mintHypercert: (
    address: string,
    claimData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: BigNumberish,
  ) => Promise<ContractTransaction>;
};

const HypercertMinting = ({ provider, chainConfig }: HypercertsMinterProps): HypercertsMinterType => {
  const { contractAddress } = getChainConfig(chainConfig);
  const storage = new HypercertsStorage({});

  const contract = <HypercertMinter>new ethers.Contract(contractAddress, HypercertMinterABI, provider);

  const mintHypercert = async (
    address: string,
    claimData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: BigNumberish,
  ) => {
    const validation = validateMetaData(claimData);
    if (!validation.valid || Object.keys(validation.errors).length > 0) {
      throw new Error(`Error(s) validating metadata: ${validation.errors}`);
    }
    // store metadata on IPFS
    const cid = await storage.storeMetadata(claimData);

    // mint hypercert token
    return await contract.mintClaim(address, totalUnits, cid, transferRestriction);
  };

  return {
    contract,
    mintHypercert,
  };
};

export { HypercertMinting };
