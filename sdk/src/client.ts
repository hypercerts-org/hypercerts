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
import { parseAllowListEntriesToMerkleTree, parseDataToOzMerkleTree } from "./utils/allowlist";
import { getClaimStoredDataFromTxHash } from "./utils";
import { isClaimOnChain } from "./utils/chains";
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
   * @param config - The configuration options for the client.
   * @throws Will throw a `ClientError` if the public client cannot be connected.
   */
  constructor(config: Partial<HypercertClientConfig>) {
    this._config = getConfig(config);
    this._walletClient = this._config?.walletClient;
    this._publicClient = this._config?.publicClient;
    this._storage = getStorage({ environment: this._config.environment });
    this.readOnly = this._config.readOnly;
  }

  /**
   * Checks if a hypercert or fraction is on the connected chain.
   *
   * This method verifies if the provided claim or fraction ID is on the chain that the wallet client is connected to.
   *
   * @param claimOrFractionId - The ID of the claim or fraction to check.
   * @returns A boolean indicating whether the claim or fraction is on the connected chain.
   */
  isHypercertsOrFractionOnConnectedChain = (claimOrFractionId: string) => {
    const connectedChain = this._walletClient?.chain?.id;
    return isClaimOnChain(claimOrFractionId, connectedChain);
  };

  /**
   * Checks if a claim or fraction is on the connected chain.
   *
   * This method is an alias for `isHypercertsOrFractionOnConnectedChain` and performs the same check.
   *
   * @param claimOrFractionId - The ID of the claim or fraction to check.
   * @returns A boolean indicating whether the claim or fraction is on the connected chain.
   */
  isClaimOrFractionOnConnectedChain = (claimOrFractionId: string) => {
    return this.isHypercertsOrFractionOnConnectedChain(claimOrFractionId);
  };

  /**
   * Gets the config for the client.
   *
   * This getter method returns the configuration object for the `HypercertClient`.
   *
   * @returns The client config.
   */
  get config(): Partial<HypercertClientConfig> {
    return this._config;
  }

  /**
   * Gets the storage service for the client.
   *
   * This getter method returns the storage service used by the `HypercertClient`.
   *
   * @returns The hypercerts storage service.
   */
  get storage(): HypercertStorage {
    return this._storage;
  }

  /**
   * Retrieves the contract addresses and GraphQL URLs for the provided `chainId` or `environment`.
   *
   * When both `chainId` and `environment` are provided, `chainId` takes precedence. If neither is provided, it defaults to the configured environment.
   *
   * @param chainId - The chain ID for which to retrieve deployments.
   * @param environment - The environment for which to retrieve deployments.
   * @returns The addresses, graph name, and graph URL for the specified chain ID or environment.
   */
  getDeployments = ({ chainId, environment }: { chainId?: SupportedChainIds; environment?: Environment }) => {
    if (chainId) return getDeploymentsForChainId(chainId);

    if (environment) return getDeploymentsForEnvironment(environment);

    return getDeploymentsForEnvironment(this._config.environment);
  };

  /**
   * @deprecated Use `mintHypercert` instead.
   */
  mintClaim = async (
    metaData: HypercertMetadata,
    totalUnits: bigint,
    transferRestriction: TransferRestrictions,
    allowList?: AllowlistEntry[],
    overrides?: SupportedOverrides,
  ) => {
    return await this.mintHypercert({ metaData, totalUnits, transferRestriction, allowList, overrides });
  };

  /**
   * Mints a new hypercert.
   *
   * This function handles the minting process of a hypercert, including fetching and parsing the allowlist if provided,
   * validating and storing metadata, and submitting the minting request.
   *
   * @param metaData - The metadata for the hypercert.
   * @param totalUnits - The total units of the hypercert.
   * @param transferRestriction - The transfer restrictions for the hypercert.
   * @param allowList - The allowlist for the hypercert, either as a URI to a CSV file or an array of allowlist entries.
   * @param overrides - Optional overrides for the transaction.
   * @returns A promise that resolves to the transaction hash of the minting request.
   * @throws Will throw a `ClientError` if any validation or request submission fails.
   */
  mintHypercert = async ({ metaData, totalUnits, transferRestriction, allowList, overrides }: MintParams) => {
    const { account } = this.getConnected();

    let root;
    let tree;

    if (allowList) {
      let allowListEntries: AllowlistEntry[] = [];

      // allowList is an uri or stringified allowlist dump
      if (typeof allowList === "string") {
        const res = await fetchFromHttpsOrIpfs(allowList);

        if (!res) {
          throw new ClientError("Invalid or no contents found for the provided allow list uri", { allowList });
        }

        // Try to parse the data as an OZ Merkle tree dump
        try {
          tree = parseDataToOzMerkleTree(res, allowList);
        } catch (error) {
          console.warn(`[mintHypercert] Allow list at ${allowList} is not a valid OZ Merkle tree [as string]`);
        }

        // Try to parse the data as an csv if it is not a valid OZ Merkle tree
        if (!tree && typeof res === "string") {
          const [headerLine, ...lines] = res.split("\n");
          const headers = headerLine.split(",");

          allowListEntries = lines.map((line) => {
            const values = line.split(",");
            const entry = headers.reduce((acc, header, i) => {
              acc[header] = values[i];
              return acc;
            }, {} as Record<string, string>);
            const { address, units } = entry;
            return { address, units: BigInt(units) };
          });

          tree = parseAllowListEntriesToMerkleTree(allowListEntries);
        }
      } else {
        tree = parseAllowListEntriesToMerkleTree(allowList);
      }

      if (!tree) {
        throw new ClientError("Invalid or no contents found for the provided allow list", { allowList });
      }

      root = tree.root;
    }

    if (allowList && !tree) {
      throw new ClientError("No tree found", { allowList });
    }

    // validate and store metadata
    const config = { timeout: overrides?.timeout };
    const metadataRes =
      metaData && allowList && tree
        ? await this.storage.storeMetadataWithAllowlist(
            {
              metadata: metaData,
              allowList: JSON.stringify(tree.dump()),
              totalUnits: totalUnits.toString(),
            },
            config,
          )
        : await this.storage.storeMetadata({ metadata: metaData }, config);

    if (!metadataRes || !metadataRes.data) {
      throw new ClientError("No CID found", { metadataRes });
    }

    const cid = metadataRes.data.data?.cid;
    const method = allowList && tree ? "createAllowlist" : "mintClaim";
    const params =
      allowList && tree
        ? [account?.address, totalUnits, root, cid, transferRestriction]
        : [account?.address, totalUnits, cid, transferRestriction];

    const request = await this.simulateRequest(account, method, params, overrides);
    return this.submitRequest(request);
  };

  /**
   * Gets the {TransferRestrictions} for a claim.
   *
   * @param fractionId
   * @returns a Promise that resolves to the applicable transfer restrictions.
   */
  getTransferRestrictions = async (fractionId: bigint): Promise<TransferRestrictions> => {
    const readContract = this._getContract();

    return await readContract.read.readTransferRestriction([fractionId]).then((res) => res as TransferRestrictions);
  };

  /**
   * Transfers a fraction to a specified address.
   *
   * This function handles the transfer of a fraction from the connected account to the specified address.
   *
   * @param params - The parameters for the transfer.
   * @param params.fractionId - The ID of the fraction to transfer.
   * @param params.to - The address to transfer the fraction to.
   * @param params.overrides - Optional overrides for the transaction.
   * @returns A promise that resolves to the transaction hash of the transfer request.
   * @throws Will throw a `ClientError` if the request fails.
   */
  transferFraction = async ({ fractionId, to, overrides }: TransferParams) => {
    const { account } = this.getConnected();

    const request = await this.simulateRequest(
      account,
      "safeTransferFrom",
      [account?.address, to, fractionId, 1, "0x"],
      overrides,
    );

    return this.submitRequest(request);
  };

  /**
   * Transfers multiple fractions to a specified address.
   *
   * This function handles the batch transfer of multiple fractions from the connected account to the specified address.
   *
   * @param params - The parameters for the batch transfer.
   * @param params.fractionIds - The IDs of the fractions to transfer.
   * @param params.to - The address to transfer the fractions to.
   * @param params.overrides - Optional overrides for the transaction.
   * @returns A promise that resolves to the transaction hash of the batch transfer request.
   * @throws Will throw a `ClientError` if the request fails.
   */
  batchTransferFractions = async ({ fractionIds, to, overrides }: BatchTransferParams) => {
    const { account } = this.getConnected();

    const request = await this.simulateRequest(
      account,
      "safeBatchTransferFrom",
      [account?.address, to, fractionIds, fractionIds.map(() => 1n), "0x"],
      overrides,
    );

    return this.submitRequest(request);
  };

  /**
   * @deprecated Use `mintHypercert` instead.
   */
  createAllowlist = async (
    allowList: AllowlistEntry[],
    metaData: HypercertMetadata,
    totalUnits: bigint,
    transferRestriction: TransferRestrictions,
    overrides?: SupportedOverrides,
  ) => {
    return await this.mintHypercert({ metaData, totalUnits, transferRestriction, allowList, overrides });
  };

  /**
   * Splits a fraction into multiple fractions.
   *
   * This function handles the splitting of a fraction into multiple smaller fractions.
   * It verifies the ownership of the fraction and ensures the sum of the new fractions equals the total units of the original fraction.
   *
   * @param params - The parameters for the split operation.
   * @param params.fractionId - The ID of the fraction to split.
   * @param params.fractions - An array of units representing the new fractions.
   * @param params.overrides - Optional overrides for the transaction.
   * @returns A promise that resolves to the transaction hash of the split request or undefined.
   * @throws Will throw a `ClientError` if the fraction is not owned by the signer or if the sum of the new fractions does not equal the total units.
   */
  splitFraction = async ({
    fractionId,
    fractions,
    overrides,
  }: SplitFractionParams): Promise<`0x${string}` | undefined> => {
    const { account } = this.getConnected();
    const readContract = this._getContract();

    const fractionOwner = (await readContract.read.ownerOf([fractionId])) as `0x${string}`;
    const totalUnits = (await readContract.read.unitsOf([fractionId])) as bigint;

    if (fractionOwner.toLowerCase() !== account?.address.toLowerCase()) {
      throw new ClientError("Claim is not owned by the signer", { signer: account?.address, fractionOwner });
    }

    const sumFractions = fractions.reduce((a, b) => a + b, 0n);
    if (sumFractions !== totalUnits) {
      throw new ClientError("Sum of fractions is not equal to the total units", { totalUnits, sumFractions });
    }

    const request = await this.simulateRequest(
      account,
      "splitFraction",
      [account?.address, fractionId, fractions],
      overrides,
    );
    return this.submitRequest(request);
  };

  /**
   * @deprecated Use `splitFraction` instead.
   */
  splitFractionUnits = async (fractionId: bigint, fractions: bigint[], overrides?: SupportedOverrides) => {
    return this.splitFraction({ fractionId, fractions, overrides });
  };

  /**
   * Merges multiple fractions into a single fraction.
   *
   * This function handles the merging of multiple fractions from the connected account.
   * It verifies the ownership of each fraction and ensures all fractions are owned by the signer.
   *
   * @param params - The parameters for the merge operation.
   * @param params.fractionIds - The IDs of the fractions to merge.
   * @param params.overrides - Optional overrides for the transaction.
   * @returns A promise that resolves to the transaction hash of the merge request.
   * @throws Will throw a `ClientError` if one or more fractions are not owned by the signer.
   */
  mergeFractions = async ({ fractionIds, overrides }: MergeFractionsParams) => {
    const { account } = this.getConnected();
    const readContract = this._getContract();

    const fractions = await Promise.all(
      fractionIds.map(async (id) => ({
        id,
        owner: (await readContract.read.ownerOf([id])) as `0x${string}`,
      })),
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

  /**
   * @deprecated Use `mergeFractions` instead.
   */
  mergeFractionUnits = async (fractionIds: bigint[], overrides?: SupportedOverrides) => {
    return this.mergeFractions({ fractionIds, overrides });
  };

  /**
   * Burns a fraction.
   *
   * This function handles the burning of a fraction from the connected account.
   * It verifies the ownership of the fraction before proceeding with the burn operation.
   *
   * @param params - The parameters for the burn operation.
   * @param params.fractionId - The ID of the fraction to burn.
   * @param params.overrides - Optional overrides for the transaction.
   * @returns A promise that resolves to the transaction hash of the burn request.
   * @throws Will throw a `ClientError` if the fraction is not owned by the signer.
   */
  burnFraction = async ({ fractionId, overrides }: BurnFractionParams) => {
    const { account } = this.getConnected();

    const readContract = this._getContract();

    const hypercertOwner = (await readContract.read.ownerOf([fractionId])) as `0x${string}`;

    if (hypercertOwner.toLowerCase() !== account?.address.toLowerCase()) {
      throw new ClientError("Hypercert is not owned by the signer", { signer: account?.address, hypercertOwner });
    }

    const request = await this.simulateRequest(account, "burnFraction", [account?.address, fractionId], overrides);

    return this.submitRequest(request);
  };

  /**
   * @deprecated Use `burnFraction` instead.
   */
  burnClaimFraction = async (claimId: bigint, overrides?: SupportedOverrides) => {
    return this.burnFraction({ fractionId: claimId, overrides });
  };

  /**
   * Claims a fraction from an allowlist.
   *
   * This function handles the claiming of a fraction from an allowlist for the connected account.
   * It verifies the Merkle proof if a root is provided and then submits the minting request.
   *
   * @param params - The parameters for the claim operation.
   * @param params.hypercertTokenId - The ID of the hypercert token to claim.
   * @param params.units - The number of units to claim.
   * @param params.proof - The Merkle proof for the claim.
   * @param params.root - The Merkle root for the allowlist.
   * @param params.overrides - Optional overrides for the transaction.
   * @returns A promise that resolves to the transaction hash of the claim request.
   * @throws Will throw an `InvalidOrMissingError` if no wallet address is found.
   */
  claimFractionFromAllowlist = async ({
    hypercertTokenId,
    units,
    proof,
    root,
    overrides,
  }: ClaimFractionFromAllowlistParams) => {
    const { account } = this.getConnected();

    if (root?.length) {
      if (!account?.address) throw new InvalidOrMissingError("No wallet address found, are you connected?");
      verifyMerkleProof(
        root.toString(),
        account.address,
        units,
        proof.map((p) => p.toString()),
      );
    }

    const request = await this.simulateRequest(
      account,
      "mintClaimFromAllowlist",
      [account.address, proof, hypercertTokenId, units],
      overrides,
    );
    return this.submitRequest(request);
  };

  /**
   * @deprecated Use `claimFractionFromAllowlist` instead.
   */
  mintClaimFractionFromAllowlist = async (
    claimId: bigint,
    units: bigint,
    proof: (Hex | ByteArray)[],
    root?: Hex | ByteArray,
    overrides?: SupportedOverrides,
  ) => {
    return this.claimFractionFromAllowlist({ hypercertTokenId: claimId, units, proof, root, overrides });
  };

  /**
   * Claims multiple fractions from multiple allowlists.
   *
   * This function handles the batch claiming of fractions from multiple allowlists for the connected account.
   * It verifies the Merkle proofs if roots are provided and then submits the batch minting request.
   *
   * @param params - The parameters for the batch claim operation.
   * @param params.hypercertTokenIds - The IDs of the hypercert tokens to claim.
   * @param params.units - The number of units to claim for each token.
   * @param params.proofs - The Merkle proofs for each claim.
   * @param params.roots - The Merkle roots for the allowlists.
   * @param params.overrides - Optional overrides for the transaction.
   * @returns A promise that resolves to the transaction hash of the batch claim request.
   * @throws Will throw an `InvalidOrMissingError` if no wallet address is found.
   */
  batchClaimFractionsFromAllowlists = async ({
    hypercertTokenIds,
    units,
    proofs,
    roots,
    overrides,
  }: BatchClaimFractionsFromAllowlistsParams) => {
    const { account } = this.getConnected();

    if (roots?.length) {
      if (!account?.address) throw new InvalidOrMissingError("No wallet address found, are you connected?");
      verifyMerkleProofs(
        roots.map((r) => r.toString()),
        account.address,
        units,
        proofs.map((p) => p.map((p) => p.toString())),
      );
    }

    const request = await this.simulateRequest(
      account,
      "batchMintClaimsFromAllowlists",
      [account.address, proofs, hypercertTokenIds, units],
      overrides,
    );

    return this.submitRequest(request);
  };

  /**
   * @deprecated Use `batchClaimFractionsFromAllowlists` instead.
   */
  batchMintClaimFractionsFromAllowlists = async (
    claimIds: bigint[],
    units: bigint[],
    proofs: (Hex | ByteArray)[][],
    roots?: (Hex | ByteArray)[],
    overrides?: SupportedOverrides,
  ) => {
    return this.batchClaimFractionsFromAllowlists({ hypercertTokenIds: claimIds, units, proofs, roots, overrides });
  };

  /**
   * Retrieves claim stored data from a transaction hash.
   *
   * This function fetches the stored data associated with a given transaction hash using the public client.
   *
   * @param hash - The transaction hash to retrieve the claim stored data for.
   * @returns A promise that resolves to the claim stored data.
   */
  getClaimStoredDataFromTxHash = async (hash: `0x${string}`) => {
    const { publicClient } = this.getConnected();
    return await getClaimStoredDataFromTxHash(publicClient, hash);
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
   * @param request - The contract request to submit.
   * @returns a promise that resolves to the hash of the submitted request.
   * @throws will throw a `ClientError` if the request fails.
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
