import React, { ReactNode } from "react";
import qs from "qs";
import * as sdk from "@network-goods/hypercerts-sdk";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import { ClaimByIdQuery, ClaimTokensByClaimQuery } from "@network-goods/hypercerts-sdk/lib/.graphclient";
import { spawn } from "../lib/common";

// The name used to pass data into the Plasmic DataProvider
const DATAPROVIDER_NAME = "hypercertData";
// The querystring key to retrieve the claim ID
const QUERYSTRING_SELECTOR = "claimId";

export interface HypercertFetcherProps {
  className?: string;       // Plasmic CSS class
  children?: ReactNode;     // Show after done loading
  loading?: ReactNode;      // Show during loading if !ignoreLoading
  ignoreLoading?: boolean;  // Skip the loading visual
  byClaimId?: string;       // Fetch by claimId
  byMetadataUri?: string;   // Fetch by metadataUri; If both are specified, byMetadataUri will override the URI in the claim
}

export type HypercertData = ClaimByIdQuery & Partial<ClaimTokensByClaimQuery> & {
  metadata?: sdk.HypercertMetadata;
}

export function HypercertFetcher(props: HypercertFetcherProps) {
  const { className, children, loading, ignoreLoading, byClaimId, byMetadataUri } = props;
  const [data, setData] = React.useState<HypercertData | undefined>();

  React.useEffect(() => {
    spawn((async () => {
      const newData: HypercertData = {};
      const querystring = window.location.search.replace("?", "");
      const q = qs.parse(querystring ?? "");
      const claimId = byClaimId ?? q[QUERYSTRING_SELECTOR] as string;
      // Get the claim
      if (claimId) {
        const result = await sdk.claimById(claimId);
        console.log(`Claim ${claimId}:`);
        console.log(result.claim);
        newData.claim = result.claim;
      }
      // Get the fraction tokens
      if (claimId) {
        const result = await sdk.fractionsByClaim(claimId);
        console.log(result.claimTokens);
        console.log(`ClaimTokens ${claimId}:`);
        newData.claimTokens = result.claimTokens
      }
      // Get the metadata
      const metadataUri = byMetadataUri ?? newData?.claim?.uri;
      if (metadataUri) {
        const result = await sdk.getMetadata(metadataUri);
        console.log(`Metadata ${metadataUri}:`);
        console.log(result);
        newData.metadata = result;
      }
      setData(newData);
    })());
  }, [ byClaimId, byMetadataUri ]);

  if (!ignoreLoading && !!loading && !data) {
    return (<div className={className}> {loading} </div>);
  }

  return (
    <div className={className}>
      <DataProvider name={DATAPROVIDER_NAME} data={data}>
        {children}
      </DataProvider>
    </div>
  );
};
