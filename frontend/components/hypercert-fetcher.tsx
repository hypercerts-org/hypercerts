import { spawn } from "../lib/common";
import { hypercertsStorage } from "../lib/hypercerts-storage";
import {
  ClaimByIdQuery,
  ClaimTokensByClaimQuery,
  HypercertMetadata,
} from "@hypercerts-org/sdk";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import qs from "qs";
import React, { ReactNode } from "react";
import { useHypercertClient } from "../hooks/hypercerts-client";

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
  const [data, setData] = React.useState<HypercertData | undefined>();
  const {
    client: { indexer },
  } = useHypercertClient();

  React.useEffect(() => {
    spawn(
      (async () => {
        const newData: HypercertData = {};
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
          const result = await indexer.claimById(claimId);
          newData.claim = result.claim;
        }
        // Get the fraction tokens
        if (claimId) {
          const result = await indexer.fractionsByClaim(claimId);
          newData.claimTokens = result.claimTokens;
        }
        // Get the metadata
        const metadataUri = useQueryString
          ? newData?.claim?.uri ?? byMetadataUri
          : byMetadataUri ?? newData?.claim?.uri;
        if (metadataUri) {
          const result = await hypercertsStorage.getMetadata(metadataUri);
          newData.metadata = result;
        }
        console.log(
          `Hypercert name='${newData.metadata?.name}' claimId=${claimId}, metadataUri=${metadataUri}: `,
          newData,
        );
        setData(newData);
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
