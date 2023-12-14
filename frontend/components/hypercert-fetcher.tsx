import { spawn } from "../lib/common";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import qs from "qs";
import React, { ReactNode } from "react";
import { useHypercertClient } from "../hooks/hypercerts-client";
import { loadHypercert, Hypercert } from "../lib/hypercert";

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
  overrideChainId?: number; // Override the chainId
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
    overrideChainId,
  } = props;
  const [data, setData] = React.useState<Hypercert | undefined>();
  const { client } = useHypercertClient({
    overrideChainId,
  });

  React.useEffect(() => {
    if (!client) {
      return;
    }
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

        const hypercert = await loadHypercert(client, {
          claimId: claimId,
          metadataUri: byMetadataUri,
          overrideMetadataUri: useQueryString && byMetadataUri !== undefined,
        });
        console.log(
          `Hypercert name='${hypercert.name}' claimId=${claimId}, qClaimId=${qClaimId} byClaimId=${byClaimId} metadataUri=${hypercert.metadataUri}: `,
          hypercert,
        );
        setData(hypercert);
      })(),
    );
  }, [useQueryString, byClaimId, byMetadataUri, client]);

  // Show when loading
  if (!client && !ignoreLoading && !!loading && !data) {
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
