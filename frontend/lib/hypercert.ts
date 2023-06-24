import {
  ClaimByIdQuery,
  ClaimTokensByClaimQuery,
  HypercertMetadata,
  HypercertClient,
} from "@hypercerts-org/sdk";

export interface Hypercert {
  getTokensFor(owner: string): HypercertTokens;
  metadata?: HypercertMetadata;
  claim?: ClaimByIdQuery["claim"];
  claimTokens?: ClaimTokensByClaimQuery["claimTokens"];
  name: string;
  totalUnits: bigint;
  metadataUri: string;
}

type LoadOptions = {
  claimId?: string;
  metadataUri?: string;
  overrideMetadataUri?: boolean;
};

export async function loadHypercert(
  client: HypercertClient,
  options: LoadOptions,
): Promise<Hypercert> {
  if (options.claimId) {
    const claimQueryResp = await client.indexer.claimById(options.claimId);
    const claimTokensQueryResp = await client.indexer.fractionsByClaim(
      options.claimId,
    );
    const hypercert = new FullHypercert(claimQueryResp, claimTokensQueryResp);
    // Get the metadata assuming that the metadata uri is set
    const metadataUri =
      options.overrideMetadataUri && options.metadataUri
        ? options.metadataUri
        : claimQueryResp.claim?.uri;
    if (metadataUri) {
      const metadata = await client.storage.getMetadata(metadataUri);
      hypercert.metadata = metadata;
    }
    return hypercert;
  } else {
    if (options.metadataUri) {
      const metadata = await client.storage.getMetadata(options.metadataUri);
      return new MetadataOnlyHypercert(options.metadataUri, metadata);
    }
    throw new Error(
      "A metadataUri or claimId are required to load a hypercert",
    );
  }
}

/**
 * HypercertTokens is a collection of tokens. This can be any arbitrary set of
 * tokens. Through this you can sum up the units of a given collection of tokens
 * or calculate the percentage of total share percentage.
 *
 * This is intended to contain tokens of the same hypercert. There aren't guards
 * to ensure that all of these tokens relate to the same hypercert.
 */
export class HypercertTokens {
  totalUnits: bigint;
  tokens: ClaimTokensByClaimQuery["claimTokens"];

  constructor(
    tokens: ClaimTokensByClaimQuery["claimTokens"],
    totalUnits: bigint,
  ) {
    this.totalUnits = totalUnits;
    this.tokens = tokens;
  }

  get units(): bigint {
    return this.tokens
      .map((t) => BigInt(t.units))
      .reduce((a, c) => a + c, BigInt(0));
  }

  percentage(precision?: number): number {
    precision = precision ?? 2;
    if (precision < 0) {
      precision = 2;
    }

    // JS maximum number values are limited to 52 bits (15-17 decimal digits)
    // and an exponent. So we set a maximum precision to 15
    if (precision > 15) {
      precision = 15;
    }

    const p = BigInt(Math.pow(10, precision + 2));
    const bnP = BigInt(p);

    return Number((divRound(this.units * bnP, this.totalUnits) / p) * 100n);
  }
}

const divRound = (numerator: bigint, denominator: bigint): bigint => {
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;
  if (remainder * 2n >= denominator) {
    return quotient + 1n;
  } else {
    return quotient;
  }
};

export class MetadataOnlyHypercert implements Hypercert {
  claim?: ClaimByIdQuery["claim"];
  claimTokens?: ClaimTokensByClaimQuery["claimTokens"];
  metadata: HypercertMetadata;
  metadataUri: string;

  constructor(metadataUri: string, metadata: HypercertMetadata) {
    this.metadata = metadata;
    this.metadataUri = metadataUri;
  }

  getTokensFor(_owner: string): HypercertTokens {
    throw new Error(
      "Cannot retrieve tokens. This view contains hypercert metadata only",
    );
  }

  get totalUnits(): bigint {
    throw new Error(
      "Cannot retrieve tokens. This view contains hypercert metadata only",
    );
  }

  get name(): string {
    return this.metadata.name;
  }
}

/**
 * FullHypercert is a fully resolved hypercert with the claim, tokens, and
 * metadata
 *
 * The intent is for plasmic consumers of this object to be able to interogate
 * this view for more natural usage of the hypercerts data in plasmic.
 */
export class FullHypercert implements Hypercert {
  // Introduce no breaking change by providing the same interface as the
  // previous HypercertData type
  claim: ClaimByIdQuery["claim"];
  claimTokens: ClaimTokensByClaimQuery["claimTokens"];
  metadata?: HypercertMetadata;

  constructor(
    claimQueryResp: ClaimByIdQuery,
    claimTokensQueryResp: ClaimTokensByClaimQuery,
  ) {
    this.claim = claimQueryResp.claim;
    this.claimTokens = claimTokensQueryResp.claimTokens;
  }

  /**
   * getTokensFor returns tokens for a specific address
   * @param address
   * @returns
   */
  getTokensFor(address: string): HypercertTokens {
    address = address.toLowerCase();
    return new HypercertTokens(
      this.claimTokens.filter((t) => t.owner == address),
      this.totalUnits,
    );
  }

  get name(): string {
    return this.metadata?.name ?? "";
  }

  get totalUnits(): bigint {
    return BigInt(this.claim?.totalUnits ?? 1);
  }

  get metadataUri(): string {
    return this.claim?.uri ?? "";
  }
}
