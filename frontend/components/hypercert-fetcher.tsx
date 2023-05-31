import { spawn } from "../lib/common";
import {
  ClaimByIdQuery,
  ClaimTokensByClaimQuery,
  HypercertMetadata,
} from "@hypercerts-org/sdk";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import qs from "qs";
import React, { ReactNode } from "react";
import { useHypercertClient } from "../hooks/hypercerts-client";
import BN from "bn.js";

// The name used to pass data into the Plasmic DataProvider
const DATAPROVIDER_NAME = "hypercertData";
// The querystring key to retrieve the claim ID
const QUERYSTRING_SELECTOR = "claimId";

/**
 * Fetches all data related to a hypercert
 * including the claim, fractions, and metadata
 *
 * The claimId can be specified either by prop or query string (see QUERYSTRING_SELECTOR)
 * `useQueryString` will determine if we prefer the querystring or the prop
 * - If true, try the query string first, if missing use prop
 * - If false, try the prop first, if missing use querystring
 */
export interface HypercertFetcherProps {
  className?: string; // Plasmic CSS class
  variableName?: string; // Name to use in Plasmic data picker
  children?: ReactNode; // Show after done loading
  loading?: ReactNode; // Show during loading if !ignoreLoading
  ignoreLoading?: boolean; // Skip the loading visual
  useQueryString?: boolean; // Forces us to try the query string first
  byClaimId?: string; // Fetch by claimId
  byMetadataUri?: string; // Fetch by metadataUri; If both are specified, byMetadataUri will override the URI in the claim
}

export type HypercertData = ClaimByIdQuery &
  Partial<ClaimTokensByClaimQuery> & {
    metadata?: HypercertMetadata;
  };

export class HypercertOwnerSummary {
  owner: string;
  units: BN;
  totalUnits: BN;

  constructor(owner: string, units: string, totalUnits: string) {
    this.owner = owner;
    this.units = new BN(units);
    this.totalUnits = new BN(totalUnits);
  }

  ownershipPercentage(precision?: number): number {
    precision = precision ?? 2;
    if (precision < 0) {
      precision = 2;
    }

    // JS maximum number values are limited to 52 bits (15-17 decimal digits)
    // and an exponent. So we set a maximum precision to 15
    if (precision > 15) {
      precision = 15;
    }

    const p = Math.pow(10, precision);
    const bnP = new BN(p);

    return (this.units.mul(bnP).divRound(this.totalUnits).toNumber() / p) * 100;
  }
}

export interface HypercertView extends HypercertData {
  getOwner(owner: string): HypercertOwnerSummary;
  listOwners(): Array<HypercertOwnerSummary>;
}

/**
 * Hypercert is a view of a given hypercert from the SDK.
 *
 * The intent is for plasmic consumers of this object to be able to interogate
 * this view for more natural usage of the hypercerts data in plasmic.
 */
export class Hypercert implements HypercertView {
  private claimQueryResp: ClaimByIdQuery;
  private claimTokensQueryResp: ClaimTokensByClaimQuery;
  metadata?: HypercertMetadata;

  constructor(
    claimQueryResp: ClaimByIdQuery,
    claimTokensQueryResp: ClaimTokensByClaimQuery,
  ) {
    this.claimQueryResp = claimQueryResp;
    this.claimTokensQueryResp = claimTokensQueryResp;
  }

  // Access data the old way
  get claim(): any {
    return this.claimQueryResp.claim;
  }

  // Access data the old way
  get claimTokens(): any {
    return this.claimTokensQueryResp.claimTokens;
  }

  /**
   * getOwner returns a specific owner summary
   * @param owner
   * @returns
   */
  getOwner(owner: string): HypercertOwnerSummary {
    return new HypercertOwnerSummary(owner, "0", "0");
  }

  /**
   * listOwners returns a list of HypercertOwnerSummary instances
   * @returns Array<HypercertOwnerSummary>
   */
  listOwners(): Array<HypercertOwnerSummary> {
    return [new HypercertOwnerSummary("hello", "0", "0")];
  }
}

export function HypercertFetcher(props: HypercertFetcherProps) {
  const {
    className,
    variableName,
    children,
    loading,
    ignoreLoading,
    useQueryString,
    byClaimId,
    byMetadataUri,
  } = props;
  const [data, setData] = React.useState<HypercertView | undefined>();
  const {
    client: { indexer, storage },
  } = useHypercertClient();

  React.useEffect(() => {
    spawn(
      (async () => {
        const hashQueryString = window.location.hash.slice(
          window.location.hash.startsWith("#") ? 1 : 0,
        );
        const searchQueryString = window.location.search.slice(
          window.location.search.startsWith("?") ? 1 : 0,
        );
        const hashQuery = qs.parse(hashQueryString);
        const searchQuery = qs.parse(searchQueryString);

        // Take preference with the hash querystring
        const qClaimId = (hashQuery[QUERYSTRING_SELECTOR] ??
          searchQuery[QUERYSTRING_SELECTOR]) as string;

        const claimId = useQueryString
          ? qClaimId ?? byClaimId
          : byClaimId ?? qClaimId;
        // Get the claim
        if (claimId) {
          const claimQueryResp = await indexer.claimById(claimId);
          const claimTokensQueryResp = await indexer.fractionsByClaim(claimId);
          const newData = new Hypercert(claimQueryResp, claimTokensQueryResp);
          // Get the metadata
          const metadataUri = useQueryString
            ? claimQueryResp.claim?.uri ?? byMetadataUri
            : byMetadataUri ?? claimQueryResp?.claim?.uri;
          if (metadataUri) {
            const metadata = await storage.getMetadata(metadataUri);
            newData.metadata = metadata;
          }
          console.log(
            `Hypercert name='${newData.metadata?.name}' claimId=${claimId}, metadataUri=${metadataUri}: `,
            newData,
          );
          setData(newData);
        } else {
          // Do nothing if there's no claimId
        }
      })(),
    );
  }, [useQueryString, byClaimId, byMetadataUri]);

  // Show when loading
  if (!ignoreLoading && !!loading && !data) {
    return <div className={className}> {loading} </div>;
  }

  return (
    <div className={className}>
      <DataProvider name={variableName ?? DATAPROVIDER_NAME} data={data}>
        {children}
      </DataProvider>
    </div>
  );
}
