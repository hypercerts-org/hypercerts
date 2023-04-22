import { HypercertMinter, HypercertMinterABI } from "@hypercerts-org/hypercerts-protocol";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { BigNumberish, ContractTransaction, ethers } from "ethers";

import { Config, getConfig } from "./config.js";
import { ClientError, MalformedDataError, StorageError } from "./errors.js";
import { HypercertMetadata, HypercertsStorage, validateMetaData } from "./index.js";
import { validateAllowlist } from "./validator/index.js";

export enum TransferRestrictions {
  AllowAll = 0,
  DisallowAll = 1,
  FromCreatorOnly = 2,
}

export type AllowlistEntry = {
  address: string;
  units: BigNumberish;
};

export type Allowlist = AllowlistEntry[];

type HypercertClientConfig = {
  config: Partial<Config>;
  storage: HypercertsStorage;
};

type HypercertClient = {
  readonly: boolean;
  config: Config;
  provider: ethers.providers.JsonRpcProvider;
  contract: HypercertMinter;
  storage: HypercertsStorage;
  mintClaim: (
    metaData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: TransferRestrictions,
  ) => Promise<ContractTransaction>;
  createAllowlist: (
    allowList: Allowlist,
    metaData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: TransferRestrictions,
  ) => Promise<ContractTransaction>;
};

const HypercertClient = ({ config, storage }: HypercertClientConfig) => {
  const clientConfig = getConfig(config);
  const _storage = storage ?? new HypercertsStorage({});
  const provider = new ethers.providers.JsonRpcProvider(clientConfig.rpcUrl);
  const contract = <HypercertMinter>new ethers.Contract(clientConfig.contractAddress, HypercertMinterABI, provider);

  const readonly = !provider._isProvider || contract.address === undefined;

  if (readonly) console.warn("Client is readonly. No signer is set.");

  const mintClaim = async (
    metaData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: TransferRestrictions,
  ) => {
    if (readonly) throw new ClientError("Client is readonly", { client: this });
    if (!clientConfig.signer) throw new ClientError("Client signer is not set", { client: this });

    // validate metadata
    const { valid, errors } = validateMetaData(metaData);
    if (!valid && Object.keys(errors).length > 0) {
      throw new MalformedDataError("Metadata validation failed", errors);
    }

    // store metadata on IPFS
    const cid = await _storage.storeMetadata(metaData);

    return contract.mintClaim(clientConfig.signer.getAddress(), totalUnits, cid, transferRestriction);
  };

  const createAllowlist = async (
    allowList: Allowlist,
    metaData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: TransferRestrictions,
  ) => {
    if (readonly) throw new ClientError("Client is readonly", { client: this });
    if (!clientConfig.signer) throw new ClientError("Client signer is not set", { client: this });

    // validate allowlist
    const { valid: validAllowlist, errors: allowlistErrors } = validateAllowlist(allowList, totalUnits);
    if (!validAllowlist && Object.keys(allowlistErrors).length > 0) {
      throw new MalformedDataError("Allowlist validation failed", allowlistErrors);
    }

    // validate metadata
    const { valid: validMetaData, errors: metaDataErrors } = validateMetaData(metaData);
    if (!validMetaData && Object.keys(metaDataErrors).length > 0) {
      throw new MalformedDataError("Metadata validation failed", metaDataErrors);
    }

    // create allowlist
    const tuples = allowList.map(p => [p.address, p.units]);
    const tree = StandardMerkleTree.of(tuples, ["address", "uint256"]);
    const cidMerkle = await _storage.storeData(JSON.stringify(tree.dump()));

    if (!cidMerkle) throw new StorageError("Unable to store allowlist on IPFS");

    metaData.allowList = cidMerkle;
    // store metadata on IPFS
    const cid = await _storage.storeMetadata(metaData);

    return contract.createAllowlist(clientConfig.signer.getAddress(), totalUnits, tree.root, cid, transferRestriction);
  };

  return {
    readonly,
    config: clientConfig,
    provider,
    contract,
    storage: _storage,
    mintClaim,
    createAllowlist,
  };
};

export default HypercertClient;
