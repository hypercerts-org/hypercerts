import { HypercertMinterAbi } from "@hypercerts-org/contracts";
import { Account, ByteArray, Hex, PublicClient, WalletClient, getAddress, getContract } from "viem";
import { getStorage } from "./storage";
import {
  AllowlistEntry,
  BatchClaimFractionsFromAllowlistsParams,
  BatchTransferParams,
  BurnFractionParams,
  ClaimFractionFromAllowlistParams,
  ClientError,
  Environment,
  HypercertClientConfig,
  HypercertClientInterface,
  HypercertMetadata,
  InvalidOrMissingError,
  MergeFractionsParams,
  MintParams,
  SplitFractionParams,
  SupportedChainIds,
  SupportedOverrides,
  TransferParams,
  TransferRestrictions,
} from "./types";
import { getConfig, getDeploymentsForChainId, getDeploymentsForEnvironment } from "./utils/config";
import { verifyMerkleProof, verifyMerkleProofs } from "./validator";
import { handleSimulatedContractError } from "./utils/errors";
import { parseAllowListEntriesToMerkleTree } from "./utils/allowlist";
import { getClaimStoredDataFromTxHash } from "./utils";
import { ParserReturnType } from "./utils/txParser";
import { isClaimOnChain } from "./utils/chains";
import { StoreAllowList201AnyOfTwoData, StoreMetadata201AnyOf } from "./__generated__/api";
import { HypercertStorage } from "./types/storage";
import { fetchFromHttpsOrIpfs } from "./utils/fetchers";

/**
 * The `HypercertClient` is a core class in the hypercerts SDK, providing a high-level interface to interact with the hypercerts system.
 *
 * It encapsulates the logic for storage, evaluation, indexing, and wallet interactions, abstracting the complexity and providing a simple API for users.
 * The client is read-only if no walletClient was found.
 *
 * @example
 * const config: Partial<HypercertClientConfig> = {
 *  chain: {id: 11155111 },
 * };
 * const client = new HypercertClient(config);
 *
 * @param {Partial<HypercertClientConfig>} config - The configuration options for the client.
 */
export class HypercertClient implements HypercertClientInterface {
  readonly _config;
  private readonly _publicClient?: PublicClient;
  private readonly _walletClient?: WalletClient;
  private readonly _storage: HypercertStorage;
  readOnly: boolean;

  /**
   * Creates a new instance of the `HypercertClient` class.
   *
   * This constructor takes a `config` parameter that is used to configure the client. The `config` parameter should be a `HypercertClientConfig` object. If the public client cannot be connected, it throws a `ClientError`.
   *
   * @param {Partial<HypercertClientConfig>} config - The configuration options for the client.
   * @throws {ClientError} Will throw a `ClientError` if the public client cannot be connected.
   */
  constructor(config: Partial<HypercertClientConfig>) {
    this._config = getConfig({ config });
    this._walletClient = this._config?.walletClient;
    this._publicClient = this._config?.publicClient;
    this._storage = getStorage({ environment: this._config.environment });
    this.readOnly = this._config.readOnly;
  }

  isHypercertsOrFractionOnConnectedChain = (claimOrFractionId: string) => {
    const connectedChain = this._walletClient?.chain?.id;
    return isClaimOnChain(claimOrFractionId, connectedChain);
  };

  isClaimOrFractionOnConnectedChain = (claimOrFractionId: string) => {
    return this.isHypercertsOrFractionOnConnectedChain(claimOrFractionId);
  };

  /**
   * Gets the config for the client.
   * @returns The client config.
   */
  get config(): Partial<HypercertClientConfig> {
    return this._config;
  }

  /**
   * Gets the storage layer for the client.
   * @returns The storage layer.
   */
  get storage(): HypercertStorage {
    return this._storage;
  }

  /**
   * Gets the contract addresses and graph urls for the provided `chainId` or `environment`. When both are provided, chainId takes precedence. If none is provided, it defaults to the configured environment.
   * @returns The addresses, graph name and graph url
   */
  getDeployments = ({ chainId, environment }: { chainId?: SupportedChainIds; environment?: Environment }) => {
    if (chainId) return getDeploymentsForChainId(chainId);

    if (environment) return getDeploymentsForEnvironment(environment);

    return getDeploymentsForEnvironment(this._config.environment);
  };

  mintClaim = async (
    metaData: HypercertMetadata,
    totalUnits: bigint,
    transferRestriction: TransferRestrictions,
    allowList?: AllowlistEntry[],
    overrides?: SupportedOverrides,
  ) => {
    return await this.mintHypercert({ metaData, totalUnits, transferRestriction, allowList, overrides });
  };

  mintHypercert = async ({
    metaData,
    totalUnits,
    transferRestriction,
    allowList,
    overrides,
  }: MintParams): Promise<`0x${string}` | undefined> => {
    const { account } = this.getConnected();

    let allowListCid;
    let root;

    if (allowList) {
      let allowListEntries: AllowlistEntry[] = [];
      if (typeof allowList === "string") {
        // fetch the csv contents
        const csvContents = await fetchFromHttpsOrIpfs(allowList);

        if (!csvContents) {
          throw new ClientError("No contents found in the csv", { allowList });
        }

        if (typeof csvContents !== "string") {
          throw new ClientError("Invalid contents found in the csv", { allowList });
        }
        // parse the csv contents into an array of AllowlistEntry
        // get first row as headers
        const headers = (csvContents as string).split("\n")[0].split(",");
        // map headers onto other rows
        const rows = (csvContents as string)
          .split("\n")
          .slice(1)
          .map((row) => {
            const values = row.split(",");
            return Object.fromEntries(headers.map((header, i) => [header, values[i]]));
          });
        allowListEntries = rows.map((entry) => {
          const { address, units } = entry;
          return { address, units: BigInt(units) };
        });
      } else {
        allowListEntries = allowList;
      }

      const tree = parseAllowListEntriesToMerkleTree(allowListEntries);

      // store allowlist on IPFS
      const allowlistStoreRes = await this.storage.storeAllowlist(
        { allowList: JSON.stringify(tree.dump()), totalUnits: totalUnits.toString() },
        { timeout: overrides?.timeout },
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!allowlistStoreRes.data || !allowlistStoreRes.data.data)
        throw new ClientError("No CID found", { allowlistStoreRes });

      const { cid } = allowlistStoreRes.data.data as StoreAllowList201AnyOfTwoData;
      allowListCid = cid;
      root = tree.root;
    }

    const metadataToStore = allowListCid ? { ...metaData, allowList: allowListCid } : metaData;

    // validate and store metadata
    const metadataRes = await this.storage.storeMetadata(metadataToStore, { timeout: overrides?.timeout });

    if (!metadataRes || !metadataRes.data) {
      throw new ClientError("No CID found", { metadataRes });
    }

    const data = metadataRes.data as StoreMetadata201AnyOf;

    let request;

    if (allowList && allowListCid) {
      request = await this.simulateRequest(
        account,
        "createAllowlist",
        [account?.address, totalUnits, root, data.cid, transferRestriction],
        overrides,
      );
    } else {
      request = await this.simulateRequest(
        account,
        "mintClaim",
        [account?.address, totalUnits, data.cid, transferRestriction],
        overrides,
      );
    }

    return this.submitRequest(request);
  };

  /**
   * Gets the TransferRestrictions for a claim.
   *
   * This method first retrieves the read contract using the `getContract` method. It then simulates a contract call to the `readTransferRestriction` function with the provided fraction ID.
   *
   * @param fractionId
   * @returns a Promise that resolves to the applicable transfer restrictions.
   */
  getTransferRestrictions = async (fractionId: bigint): Promise<TransferRestrictions> => {
    const readContract = this._getContract();

    return await readContract.read.readTransferRestriction([fractionId]).then((res) => res as TransferRestrictions);
  };

  transferFraction = async ({ fractionId, to, overrides }: TransferParams): Promise<`0x${string}` | undefined> => {
    const { account } = this.getConnected();

    const request = await this.simulateRequest(
      account,
      "safeTransferFrom",
      [account?.address, to, fractionId, 1, "0x"],
      overrides,
    );

    return this.submitRequest(request);
  };

  batchTransferFractions = async ({
    fractionIds,
    to,
    overrides,
  }: BatchTransferParams): Promise<`0x${string}` | undefined> => {
    const { account } = this.getConnected();

    const request = await this.simulateRequest(
      account,
      "safeBatchTransferFrom",
      [account?.address, to, fractionIds, fractionIds.map(() => 1n), "0x"],
      overrides,
    );

    return this.submitRequest(request);
  };

  createAllowlist = async (
    allowList: AllowlistEntry[],
    metaData: HypercertMetadata,
    totalUnits: bigint,
    transferRestriction: TransferRestrictions,
    overrides?: SupportedOverrides,
  ): Promise<`0x${string}` | undefined> => {
    const { account } = this.getConnected();

    // create allowlist
    const tree = parseAllowListEntriesToMerkleTree(allowList);

    // store allowlist on IPFS
    const allowlistStoreRes = await this.storage.storeAllowlist(
      { allowList: JSON.stringify(tree.dump()), totalUnits: totalUnits.toString() },
      { timeout: overrides?.timeout },
    );

    console.debug("allowlistStoreRes", allowlistStoreRes);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!allowlistStoreRes.data) throw new ClientError("No CID found", { allowlistStoreRes });

    const data = allowlistStoreRes.data as unknown as StoreAllowList201AnyOfTwoData;

    console.debug("Storing metadata", { ...metaData, allowList: data.cid });

    // store metadata on IPFS
    const metadataCID = await this.storage.storeMetadata(
      { ...metaData, allowList: data.cid },
      { timeout: overrides?.timeout },
    );
    const request = await this.simulateRequest(
      account,
      "createAllowlist",
      [account?.address, totalUnits, tree.root, metadataCID, transferRestriction],
      overrides,
    );

    return this.submitRequest(request);
  };

  splitFraction = async ({
    fractionId,
    fractions,
    overrides,
  }: SplitFractionParams): Promise<`0x${string}` | undefined> => {
    const { account } = this.getConnected();

    const readContract = this._getContract();

    const fractionOwner = (await readContract.read.ownerOf([fractionId])) as `0x${string}`;
    const totalUnits = (await readContract.read.unitsOf([fractionId])) as bigint;

    if (fractionOwner.toLowerCase() !== account?.address.toLowerCase())
      throw new ClientError("Claim is not owned by the signer", { signer: account?.address, fractionOwner });

    // check if the sum of the fractions is equal to the total units
    const sumFractions = fractions.reduce((a, b) => a + b, 0n);
    if (sumFractions != totalUnits)
      throw new ClientError("Sum of fractions is not equal to the total units", { totalUnits, sumFractions });

    const request = await this.simulateRequest(
      account,
      "splitFraction",
      [account?.address, fractionId, fractions],
      overrides,
    );

    return this.submitRequest(request);
  };

  splitFractionUnits = async (
    fractionId: bigint,
    fractions: bigint[],
    overrides?: SupportedOverrides,
  ): Promise<`0x${string}` | undefined> => {
    return this.splitFraction({ fractionId, fractions, overrides });
  };

  mergeFractions = async ({ fractionIds, overrides }: MergeFractionsParams): Promise<`0x${string}` | undefined> => {
    const { account } = this.getConnected();

    const readContract = this._getContract();

    const fractions = await Promise.all(
      fractionIds.map(async (id) => ({ id, owner: (await readContract.read.ownerOf([id])) as `0x${string}` })),
    );

    const notOwned = fractions.filter((fraction) => fraction.owner.toLowerCase() !== account?.address.toLowerCase());

    if (notOwned.length > 0) {
      throw new ClientError("One or more fractions are not owned by the signer", {
        signer: account?.address,
        notOwned,
      });
    }

    const request = await this.simulateRequest(account, "mergeFractions", [account?.address, fractionIds], overrides);

    return this.submitRequest(request);
  };

  mergeFractionUnits = async (
    fractionIds: bigint[],
    overrides?: SupportedOverrides,
  ): Promise<`0x${string}` | undefined> => {
    return this.mergeFractions({ fractionIds, overrides });
  };

  burnFraction = async ({ fractionId, overrides }: BurnFractionParams): Promise<`0x${string}` | undefined> => {
    const { account } = this.getConnected();

    const readContract = this._getContract();

    const hypercertOwner = (await readContract.read.ownerOf([fractionId])) as `0x${string}`;

    if (hypercertOwner.toLowerCase() !== account?.address.toLowerCase()) {
      throw new ClientError("Hypercert is not owned by the signer", { signer: account?.address, hypercertOwner });
    }

    const request = await this.simulateRequest(account, "burnFraction", [account?.address, fractionId], overrides);

    return this.submitRequest(request);
  };

  burnClaimFraction = async (claimId: bigint, overrides?: SupportedOverrides): Promise<`0x${string}` | undefined> => {
    return this.burnFraction({ fractionId: claimId, overrides });
  };

  claimFractionFromAllowlist = async ({
    hypercertTokenId,
    units,
    proof,
    root,
    overrides,
  }: ClaimFractionFromAllowlistParams): Promise<`0x${string}` | undefined> => {
    const { account } = this.getConnected();

    //verify the proof using the OZ merkle tree library
    if (root && root.length > 0) {
      if (!account?.address) throw new InvalidOrMissingError("No wallet address found, are you connected?");
      verifyMerkleProof(
        root.toString(),
        account?.address,
        units,
        proof.map((p) => p.toString()),
      );
    }

    const request = await this.simulateRequest(
      account,
      "mintClaimFromAllowlist",
      [account?.address, proof, hypercertTokenId, units],
      overrides,
    );

    return this.submitRequest(request);
  };

  mintClaimFractionFromAllowlist = async (
    claimId: bigint,
    units: bigint,
    proof: (Hex | ByteArray)[],
    root?: Hex | ByteArray,
    overrides?: SupportedOverrides,
  ): Promise<`0x${string}` | undefined> => {
    return this.claimFractionFromAllowlist({ hypercertTokenId: claimId, units, proof, root, overrides });
  };

  batchClaimFractionsFromAllowlists = async ({
    hypercertTokenIds,
    units,
    proofs,
    roots,
    overrides,
  }: BatchClaimFractionsFromAllowlistsParams): Promise<`0x${string}` | undefined> => {
    const { account } = this.getConnected();

    //verify the proof using the OZ merkle tree library
    if (roots && roots.length > 0) {
      if (!account?.address) throw new InvalidOrMissingError("No wallet address found, are you connected?");

      verifyMerkleProofs(
        roots.map((r) => r.toString()),
        account?.address,
        units,
        proofs.map((p) => p.map((p) => p.toString())),
      );
    }

    const request = await this.simulateRequest(
      account,
      "batchMintClaimsFromAllowlists",
      [account?.address, proofs, hypercertTokenIds, units],
      overrides,
    );

    return this.submitRequest(request);
  };

  batchMintClaimFractionsFromAllowlists = async (
    claimIds: bigint[],
    units: bigint[],
    proofs: (Hex | ByteArray)[][],
    roots?: (Hex | ByteArray)[],
    overrides?: SupportedOverrides,
  ): Promise<`0x${string}` | undefined> => {
    return this.batchClaimFractionsFromAllowlists({ hypercertTokenIds: claimIds, units, proofs, roots, overrides });
  };

  getClaimStoredDataFromTxHash = async (hash: `0x${string}`): Promise<ParserReturnType> => {
    const { publicClient } = this.getConnected();

    const { data, errors, success } = await getClaimStoredDataFromTxHash(publicClient, hash);

    return { data, errors, success };
  };

  private _getContract = () => {
    const { walletClient, publicClient } = this.getConnected();

    const chainId = walletClient.chain?.id as SupportedChainIds;

    const deployment = this.getDeployments({ chainId });

    if (!deployment[chainId].addresses.HypercertMinterUUPS)
      throw new ClientError("No contract address found", { config: this.config });

    return getContract({
      address: getAddress(deployment[chainId].addresses.HypercertMinterUUPS!),
      abi: HypercertMinterAbi,
      client: { public: publicClient },
    });
  };

  private getCleanedOverrides = (overrides?: SupportedOverrides) => {
    const _overrides = {
      value: overrides?.value,
      gas: overrides?.gasLimit,
      gasPrice: overrides?.gasPrice,
    };

    return Object.fromEntries(Object.entries(_overrides).filter(([_, value]) => value !== undefined));
  };

  private getConnected = () => {
    if (!this._walletClient) {
      throw new ClientError("Could not connect to wallet; sending transactions not allowed.", { client: this });
    }
    if (this.readOnly) throw new ClientError("Client is readonly", { client: this });
    if (!this._walletClient.account) throw new ClientError("No account found", { client: this });
    if (!this._publicClient) throw new ClientError("No public client found", { client: this });

    return {
      walletClient: this._walletClient,
      account: this._walletClient.account,
      publicClient: this._publicClient,
    };
  };

  private simulateRequest = async (
    account: Account,
    functionName: string,
    args: unknown[],
    overrides?: SupportedOverrides,
  ) => {
    const { publicClient } = this.getConnected();
    try {
      // Need to get the contract config before passing it to the simulateContract method
      const readContract = this._getContract();

      const { request } = await publicClient.simulateContract({
        functionName,
        account: account.address,
        args,
        abi: HypercertMinterAbi,
        address: readContract.address,
        ...this.getCleanedOverrides(overrides),
      });

      return request;
    } catch (err) {
      throw handleSimulatedContractError(err);
    }
  };

  /**
   * Submits a contract request.
   *
   * This method submits a contract request using the `writeContract` method of the wallet client. If the request fails, it throws a `ClientError`.
   *
   * @param {any} request - The contract request to submit.
   * @returns {Promise<`0x${string}`>} A promise that resolves to the hash of the submitted request.
   * @throws {ClientError} Will throw a `ClientError` if the request fails.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private submitRequest = async (request: any) => {
    const { walletClient } = this.getConnected();
    const hash = await walletClient?.writeContract(request);

    if (!hash) {
      throw new ClientError("Something went wrong when executing request", { request, hash });
    }

    return hash;
  };
}
