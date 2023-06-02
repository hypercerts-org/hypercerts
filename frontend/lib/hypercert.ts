import {
  ClaimByIdQuery,
  ClaimTokensByClaimQuery,
  HypercertMetadata,
} from "@hypercerts-org/sdk";
import BN from "bn.js";

export class HypercertTokens {
  totalUnits: BN;
  tokens: ClaimTokensByClaimQuery["claimTokens"];

  constructor(tokens: ClaimTokensByClaimQuery["claimTokens"], totalUnits: BN) {
    this.totalUnits = totalUnits;
    this.tokens = tokens;
  }

  get units(): BN {
    return this.tokens
      .map((t) => new BN(t.units))
      .reduce((a, c) => a.add(c), new BN(0));
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

    const p = Math.pow(10, precision + 2);
    const bnP = new BN(p);

    return (this.units.mul(bnP).divRound(this.totalUnits).toNumber() / p) * 100;
  }
}

export interface HypercertView {
  getTokensFor(owner: string): HypercertTokens;
  metadata?: HypercertMetadata;
  claim: ClaimByIdQuery["claim"];
  claimTokens: ClaimTokensByClaimQuery["claimTokens"];
  name: string;
  totalUnits: BN;
}

/**
 * Hypercert is a view of a given hypercert from the SDK.
 *
 * The intent is for plasmic consumers of this object to be able to interogate
 * this view for more natural usage of the hypercerts data in plasmic.
 */
export class Hypercert implements HypercertView {
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
    address = address.toLocaleLowerCase();
    return new HypercertTokens(
      this.claimTokens.filter((t) => t.owner == address),
      this.totalUnits,
    );
  }

  get name(): string {
    return this.metadata?.name ?? "";
  }

  get totalUnits(): BN {
    return new BN(this.claim?.totalUnits ?? 1);
  }
}
