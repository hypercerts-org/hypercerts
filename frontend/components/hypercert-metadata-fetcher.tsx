import React, { ReactNode } from "react";
import qs from "qs";
import * as sdk from "@network-goods/hypercerts-sdk";
import { DataProvider } from "@plasmicapp/loader-nextjs";

const METADATA_SELECTOR_KEY = "metadata";
const QUERYSTRING_SELECTOR = "hypercert_metadata";

export interface HypercertMetadataFetcherProps {
  className?: string;     // Plasmic CSS class
  children?: ReactNode;   // Show after done loading
  loading?: ReactNode;    // Show during loading if !ignoreLoading
  ignoreLoading?: boolean; // Skip the loading visual
  cid?: string;           // CID of metadata
}

export function HypercertMetadataFetcher(props: HypercertMetadataFetcherProps) {
  const { className, children, loading, ignoreLoading, cid } = props;
  const [metadata, setMetadata] = React.useState<sdk.HypercertMetadata | undefined>();

  React.useEffect(() => {
    const querystring = window.location.search.replace("?", "");
    const q = qs.parse(querystring ?? "");
    const metadataCid = cid ?? q[QUERYSTRING_SELECTOR] as string;
    if (!!metadataCid) {
      sdk.getMetadata(metadataCid).then(m => {
        console.log(m);
        setMetadata(m);
      });
    }
  }, [ cid ]);

  if (!ignoreLoading && !!loading && !metadata) {
    return (<div className={className}> {loading} </div>);
  }

  return (
    <div className={className}>
      <DataProvider name={METADATA_SELECTOR_KEY} data={metadata}>
        {children}
      </DataProvider>
    </div>
  );
};
